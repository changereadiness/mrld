(() => {
    "use strict";

    const state = window.MRLD_LOCALE || {
        locale: "en",
        storageKey: "mrld-language",
        siteRoot: new URL("./", window.location.href).href,
        locales: { en: { code: "en", label: "EN", name: "English", lang: "en", dir: "ltr", enabled: true } }
    };

    let locale = state.locale || "en";
    let localeData = null;

    const pageName = (() => {
        const path = window.location.pathname.split("/").filter(Boolean);
        const file = (path[path.length - 1] || "index.html").replace(/\.html$/i, "");
        return file === "index" ? "home" : file;
    })();

    const normalize = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

    function lookup(value) {
        if (locale === "en" || !localeData) return value;
        const key = normalize(value);
        if (!key) return value;

        const pageMap = localeData.pages?.[pageName] || {};
        if (Object.prototype.hasOwnProperty.call(pageMap, key)) return pageMap[key];
        if (Object.prototype.hasOwnProperty.call(localeData.global || {}, key)) return localeData.global[key];
        return value;
    }

    function loadLocaleData() {
        if (locale === "en") return Promise.resolve(null);

        const existing = window.MRLD_TRANSLATIONS?.[locale];
        if (existing) return Promise.resolve(existing);

        const config = state.locales?.[locale];
        if (!config?.file) return Promise.resolve(null);

        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = new URL(config.file, state.siteRoot).href;
            script.async = true;
            script.dataset.mrldLocale = locale;
            script.onload = () => resolve(window.MRLD_TRANSLATIONS?.[locale] || null);
            script.onerror = () => reject(new Error(`Unable to load MRLD locale file: ${config.file}`));
            document.head.appendChild(script);
        });
    }

    function replaceTextNode(node) {
        const raw = node.nodeValue;
        const key = normalize(raw);
        if (!key) return;
        const translated = lookup(key);
        if (translated === key) return;

        const leading = raw.match(/^\s*/)?.[0] || "";
        const trailing = raw.match(/\s*$/)?.[0] || "";
        node.nodeValue = `${leading}${translated}${trailing}`;
    }

    function translateDocument() {
        if (locale === "en" || !localeData) return;

        document.title = lookup(document.title);

        const description = document.querySelector('meta[name="description"]');
        if (description?.content) description.content = lookup(description.content);

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    if (["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"].includes(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return normalize(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(replaceTextNode);

        const attrs = ["aria-label", "placeholder", "alt", "title", "data-title", "data-detail"];
        document.querySelectorAll("*").forEach((element) => {
            attrs.forEach((attr) => {
                if (!element.hasAttribute(attr)) return;
                const raw = element.getAttribute(attr);
                const translated = lookup(raw);
                if (translated !== raw) element.setAttribute(attr, translated);
            });
        });
    }

    function localizeInternalLinks() {
        document.querySelectorAll('a[href]').forEach((link) => {
            const href = link.getAttribute("href");
            if (!href || href.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(href)) return;

            let url;
            try { url = new URL(href, window.location.href); } catch { return; }
            if (url.origin !== window.location.origin && window.location.protocol !== "file:") return;
            if (!/\.html$/i.test(url.pathname) && !url.pathname.endsWith("/")) return;

            if (locale === "en") url.searchParams.delete("lang");
            else url.searchParams.set("lang", locale);

            if (window.location.protocol === "file:") {
                link.href = url.href;
            } else {
                link.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
            }
        });
    }

    function buildLanguageSelector() {
        const nav = document.querySelector(".nav-links");
        if (!nav || nav.querySelector(".nav-language")) return;

        const enabled = Object.values(state.locales || {}).filter((item) => item.enabled);
        if (enabled.length < 2) return;

        const item = document.createElement("li");
        item.className = "nav-language";
        item.setAttribute("aria-label", lookup("Language selector"));

        enabled.forEach((entry, index) => {
            if (index) {
                const separator = document.createElement("span");
                separator.className = "lang-separator";
                separator.setAttribute("aria-hidden", "true");
                separator.textContent = "/";
                item.appendChild(separator);
            }

            if (entry.code === locale) {
                const current = document.createElement("span");
                current.className = "lang-current";
                current.setAttribute("aria-current", "page");
                current.textContent = entry.label;
                item.appendChild(current);
                return;
            }

            const link = document.createElement("a");
            link.className = "lang-option";
            link.lang = entry.lang;
            link.hreflang = entry.lang;
            link.textContent = entry.label;
            link.setAttribute("aria-label", entry.name);

            const url = new URL(window.location.href);
            if (entry.code === "en") url.searchParams.delete("lang");
            else url.searchParams.set("lang", entry.code);
            link.href = url.href;

            link.addEventListener("click", () => {
                try { window.localStorage.setItem(state.storageKey, entry.code); } catch {}
            });

            item.appendChild(link);
        });

        nav.appendChild(item);
    }

    function addAlternateLanguageLinks() {
        document.querySelectorAll('link[data-mrld-hreflang]').forEach((node) => node.remove());

        const base = new URL(window.location.href);
        base.searchParams.delete("lang");
        base.searchParams.delete("i18nDebug");

        Object.values(state.locales || {}).filter((item) => item.enabled).forEach((entry) => {
            const url = new URL(base.href);
            if (entry.code !== "en") url.searchParams.set("lang", entry.code);

            const link = document.createElement("link");
            link.rel = "alternate";
            link.hreflang = entry.lang;
            link.href = url.href;
            link.dataset.mrldHreflang = "true";
            document.head.appendChild(link);
        });

        const fallback = document.createElement("link");
        fallback.rel = "alternate";
        fallback.hreflang = "x-default";
        fallback.href = base.href;
        fallback.dataset.mrldHreflang = "true";
        document.head.appendChild(fallback);
    }

    function debugMissing() {
        let enabled = false;
        try { enabled = new URL(window.location.href).searchParams.get("i18nDebug") === "1"; } catch {}
        if (!enabled || locale === "en" || !localeData) return;

        const missing = new Set();
        const preserved = new Set(localeData.preserve || []);
        const pageMap = localeData.pages?.[pageName] || {};
        const globalMap = localeData.global || {};

        const consider = (value) => {
            const key = normalize(value);
            if (!key || preserved.has(key)) return;
            if (Object.prototype.hasOwnProperty.call(pageMap, key)) return;
            if (Object.prototype.hasOwnProperty.call(globalMap, key)) return;
            if (/^[\d\s·.()@+\-–—→↗↔︎✓🇨🇦/]+$/.test(key)) return;
            if (/^(MRLD|Sayudi Inc\.|Ali Saïd|LinkedIn|Canada|Asia)$/i.test(key)) return;
            missing.add(key);
        };

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) consider(walker.currentNode.nodeValue);
        if (missing.size) console.warn(`[MRLD i18n] Missing ${locale} strings on ${pageName}:`, [...missing]);
    }

    window.MRLD_I18N = {
        locale,
        page: pageName,
        t: (value) => lookup(value),
        availableLocales: state.locales
    };

    window.MRLD_I18N_READY = (async () => {
        try {
            localeData = await loadLocaleData();
            if (locale !== "en" && !localeData) throw new Error(`No MRLD translation data available for ${locale}`);
        } catch (error) {
            console.error("[MRLD i18n]", error);
            locale = "en";
            localeData = null;
            document.documentElement.lang = "en";
            document.documentElement.dir = "ltr";
            document.documentElement.dataset.locale = "en";
        }

        window.MRLD_I18N.locale = locale;
        window.MRLD_I18N.t = (value) => lookup(value);

        translateDocument();
        localizeInternalLinks();
        buildLanguageSelector();
        addAlternateLanguageLinks();
        debugMissing();

        document.documentElement.dataset.i18nReady = "true";
        window.dispatchEvent(new CustomEvent("mrld:i18n-ready", { detail: { locale, page: pageName } }));
        return { locale, page: pageName };
    })();
})();
