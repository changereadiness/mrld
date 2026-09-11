(() => {
    "use strict";

    const script = document.currentScript;
    const siteRoot = script?.src ? new URL("../../", script.src) : new URL("./", window.location.href);
    const storageKey = "mrld-language";

    const locales = {
        en: {
            code: "en",
            label: "EN",
            name: "English",
            lang: "en",
            dir: "ltr",
            file: null,
            enabled: true
        },
        "fr-CA": {
            code: "fr-CA",
            label: "FR",
            name: "Français (Canada)",
            lang: "fr-CA",
            dir: "ltr",
            file: "content/fr-CA.js",
            enabled: true
        },
        ar: {
            code: "ar",
            label: "العربية",
            name: "العربية",
            lang: "ar",
            dir: "rtl",
            file: "content/ar.js",
            enabled: false
        },
        "th-TH": {
            code: "th-TH",
            label: "ไทย",
            name: "ภาษาไทย",
            lang: "th-TH",
            dir: "ltr",
            file: "content/th-TH.js",
            enabled: false
        },
        "zh-CN": {
            code: "zh-CN",
            label: "中文",
            name: "简体中文",
            lang: "zh-CN",
            dir: "ltr",
            file: "content/zh-CN.js",
            enabled: false
        }
    };

    const aliases = {
        en: "en",
        "en-ca": "en",
        fr: "fr-CA",
        "fr-ca": "fr-CA",
        ar: "ar",
        th: "th-TH",
        "th-th": "th-TH",
        zh: "zh-CN",
        "zh-cn": "zh-CN",
        "zh-hans": "zh-CN"
    };

    const normalizeLocale = (value) => {
        if (!value) return null;
        return aliases[String(value).trim().toLowerCase()] || null;
    };

    let requested = null;
    try {
        requested = normalizeLocale(new URL(window.location.href).searchParams.get("lang"));
    } catch {}

    let stored = null;
    try {
        stored = normalizeLocale(window.localStorage.getItem(storageKey));
    } catch {}

    const locale = requested || stored || "en";
    const config = locales[locale] || locales.en;

    if (requested) {
        try { window.localStorage.setItem(storageKey, locale); } catch {}
    }

    document.documentElement.lang = config.lang;
    document.documentElement.dir = config.dir;
    document.documentElement.dataset.locale = locale;

    window.MRLD_LOCALE = {
        locale,
        storageKey,
        siteRoot: siteRoot.href,
        locales
    };
})();
