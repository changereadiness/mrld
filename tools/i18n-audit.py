#!/usr/bin/env python3
"""Audit MRLD locale coverage against the canonical English HTML source.

Usage:
    python tools/i18n-audit.py fr-CA

The English HTML remains the source of truth. Locale files map exact English
strings to localized copy. Missing strings are reported by page.
"""
from __future__ import annotations
import json, re, sys
from pathlib import Path
from bs4 import BeautifulSoup, Comment

ROOT = Path(__file__).resolve().parents[1]
LOCALE = sys.argv[1] if len(sys.argv) > 1 else "fr-CA"
LOCALE_FILE = ROOT / "content" / f"{LOCALE}.js"

if not LOCALE_FILE.exists():
    raise SystemExit(f"Locale file not found: {LOCALE_FILE}")

raw = LOCALE_FILE.read_text(encoding="utf-8")
match = re.search(r"=\s*(\{.*\})\s*;\s*$", raw, re.S)
if not match:
    raise SystemExit(f"Could not parse locale data in {LOCALE_FILE}")
data = json.loads(match.group(1))

global_map = data.get("global", {})
pages_map = data.get("pages", {})
preserve = set(data.get("preserve", []))

html_files = [p for p in ROOT.rglob("*.html") if "__MACOSX" not in p.parts]
attrs = ["aria-label", "placeholder", "alt", "title", "data-title", "data-detail"]

TRIVIAL = re.compile(r"^[\d\s·.()@+\-–—→↗↔︎✓/🇨🇦]+$")
URLISH = re.compile(r"^(https?://|mailto:|tel:)", re.I)

def norm(v: str) -> str:
    return re.sub(r"\s+", " ", v or "").strip()

def page_name(path: Path) -> str:
    stem = path.stem
    return "home" if stem == "index" else stem

def should_ignore(s: str) -> bool:
    if not s or s in preserve or TRIVIAL.fullmatch(s) or URLISH.match(s):
        return True
    if s in {"html", "MRLD", "Sayudi Inc.", "Ali Saïd", "LinkedIn"}:
        return True
    if "@" in s and " " not in s:
        return True
    if re.fullmatch(r"\+?[\d ()-]+", s):
        return True
    if re.fullmatch(r"[A-Z]{1,4}", s) and s not in {"LEGAL"}:
        return True
    return False

missing_total = 0
for path in sorted(html_files):
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    for tag in soup(["style", "script", "noscript", "code", "pre"]):
        tag.decompose()
    strings = []
    if soup.title:
        strings.append(norm(soup.title.get_text(" ", strip=True)))
    desc = soup.find("meta", attrs={"name":"description"})
    if desc and desc.get("content"):
        strings.append(norm(desc["content"]))
    if soup.body:
        for node in soup.body.find_all(string=True):
            if isinstance(node, Comment):
                continue
            strings.append(norm(str(node)))
        for element in soup.body.find_all(True):
            for attr in attrs:
                if element.get(attr):
                    strings.append(norm(element.get(attr)))

    page = page_name(path)
    pmap = pages_map.get(page, {})
    missing = []
    seen = set()
    for s in strings:
        if s in seen or should_ignore(s):
            continue
        seen.add(s)
        if s not in pmap and s not in global_map:
            missing.append(s)
    if missing:
        rel = path.relative_to(ROOT)
        print(f"\n{rel} [{page}] — {len(missing)} missing")
        for s in missing:
            print(f"  - {s}")
        missing_total += len(missing)

if missing_total:
    print(f"\nFAIL: {missing_total} untranslated strings found for {LOCALE}.")
    raise SystemExit(1)
print(f"PASS: {LOCALE} covers all audited website strings.")
