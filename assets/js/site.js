(() => {
    "use strict";

    const root = document.documentElement;
    root.classList.add("mrld-js");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const onReady = (callback) => {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback, { once: true });
        } else {
            callback();
        }
    };

    const normalisePath = (value) => {
        try {
            const url = new URL(value, window.location.href);
            let path = url.pathname.replace(/\/index\.html$/i, "/");
            path = path.replace(/\.html$/i, "");
            path = path.replace(/\/$/, "");
            return path || "/";
        } catch { return ""; }
    };

    function initNavigation() {
        const navbar = document.querySelector(".navbar");
        const header = navbar ? navbar.closest("header") : null;
        const toggle = document.querySelector(".nav-toggle");
        const nav = document.querySelector(".nav-links");

        if (header) {
            header.classList.add("site-header");
            const syncHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 16);
            syncHeader();
            window.addEventListener("scroll", syncHeader, { passive: true });
        }

        document.querySelectorAll(".nav-links a").forEach((link) => {
            if (normalisePath(link.href) === normalisePath(window.location.href)) {
                link.setAttribute("aria-current", "page");
            }
        });

        if (!toggle || !nav) return;

        const closeNavigation = () => {
            nav.classList.remove("is-open");
            toggle.classList.remove("is-open");
            document.body.classList.remove("nav-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", window.MRLD_I18N?.t("Open navigation") || "Open navigation");
        };
        const openNavigation = () => {
            nav.classList.add("is-open");
            toggle.classList.add("is-open");
            document.body.classList.add("nav-open");
            toggle.setAttribute("aria-expanded", "true");
            toggle.setAttribute("aria-label", window.MRLD_I18N?.t("Close navigation") || "Close navigation");
        };

        toggle.addEventListener("click", () => nav.classList.contains("is-open") ? closeNavigation() : openNavigation());
        nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));
        document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeNavigation(); });
        document.addEventListener("click", (event) => {
            if (!nav.classList.contains("is-open")) return;
            if (nav.contains(event.target) || toggle.contains(event.target)) return;
            closeNavigation();
        });
        window.addEventListener("resize", () => { if (window.innerWidth >= 1050) closeNavigation(); });
    }

    function initScrollProgress() {
        if (document.body.classList.contains("card-page")) return;
        const progress = document.createElement("div");
        progress.className = "site-progress";
        progress.setAttribute("aria-hidden", "true");
        document.body.appendChild(progress);
        let ticking = false;
        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const value = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
            progress.style.transform = `scaleX(${value})`;
            progress.classList.toggle("is-active", max > 240 && window.scrollY > 4);
            ticking = false;
        };
        const requestUpdate = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", requestUpdate);
    }

    function initRevealSystem() {
        const heroContainers = [
            ".hero-content", ".bridge-intro", ".sourcing-intro-header", ".industries-intro-content",
            ".logistics-intro-content", ".process-intro", ".partner-gate-inner", ".intro"
        ];
        heroContainers.forEach((selector) => {
            document.querySelectorAll(selector).forEach((container) => {
                Array.from(container.children).forEach((element, index) => {
                    element.classList.add("motion-item", "motion-hero");
                    element.style.setProperty("--motion-delay", `${Math.min(index, 5) * 80}ms`);
                });
            });
        });

        const revealSelectors = [
            "main > section:not(:first-child)", ".service-card", ".bridge-card", ".industry-card", ".scope-card",
            ".equipment-card", ".logistics-card", ".process-step", ".capability", ".cta-box", ".footer-content"
        ];
        const items = Array.from(document.querySelectorAll(revealSelectors.join(",")));
        const uniqueItems = [...new Set(items)].filter((item) => !item.classList.contains("motion-hero"));
        uniqueItems.forEach((item) => {
            item.classList.add("motion-item");
            const siblings = item.parentElement ? Array.from(item.parentElement.children).filter((child) => uniqueItems.includes(child)) : [];
            const index = siblings.indexOf(item);
            if (index > -1) item.style.setProperty("--motion-delay", `${Math.min(index % 6, 5) * 55}ms`);
        });

        if (prefersReducedMotion) {
            document.querySelectorAll(".motion-item").forEach((item) => item.classList.add("is-visible"));
            return;
        }
        window.requestAnimationFrame(() => document.querySelectorAll(".motion-hero").forEach((item) => item.classList.add("is-visible")));
        if (!("IntersectionObserver" in window)) {
            uniqueItems.forEach((item) => item.classList.add("is-visible"));
            return;
        }
        const observer = new IntersectionObserver((entries, revealObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
        uniqueItems.forEach((item) => {
            const bounds = item.getBoundingClientRect();
            if (bounds.top < window.innerHeight * 0.92) item.classList.add("is-visible");
            else observer.observe(item);
        });
    }

    function initSurfaceResponse() {
        if (!finePointer || prefersReducedMotion) return;
        const selectors = [
            ".service-card", ".bridge-card", ".industry-card", ".scope-card", ".equipment-card",
            ".logistics-card", ".process-step", ".capability", ".action", ".website-card", ".contact a"
        ];
        document.querySelectorAll(selectors.join(",")).forEach((surface) => {
            surface.classList.add("interactive-surface");
            surface.addEventListener("pointermove", (event) => {
                const rect = surface.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;
                surface.style.setProperty("--pointer-x", `${x}%`);
                surface.style.setProperty("--pointer-y", `${y}%`);
            });
            surface.addEventListener("pointerenter", () => surface.classList.add("is-pointer-active"));
            surface.addEventListener("pointerleave", () => surface.classList.remove("is-pointer-active"));
        });
    }

    function initForms() {
        document.querySelectorAll("form").forEach((form) => {
            form.querySelectorAll("input, select, textarea").forEach((field) => {
                field.addEventListener("focus", () => field.classList.add("is-engaged"));
                field.addEventListener("blur", () => field.classList.toggle("has-value", Boolean(field.value && field.value.trim())));
            });
            form.addEventListener("submit", () => {
                const submit = form.querySelector('button[type="submit"], input[type="submit"]');
                if (!submit || !form.checkValidity()) return;
                submit.classList.add("is-submitting");
            });
        });
    }

    function initCardEntry() {
        if (!document.body.classList.contains("card-page")) return;
        const card = document.querySelector(".card");
        if (!card || prefersReducedMotion) return;
        requestAnimationFrame(() => card.classList.add("is-ready"));
    }

    function initHomeBridge() {
        if (!document.body.classList.contains("home-page") || prefersReducedMotion) return;
        const bridge = document.querySelector(".market-bridge");
        if (!bridge) return;
        const nodes = bridge.querySelectorAll(".market-node");
        const arrows = bridge.querySelectorAll(".market-arrow");
        const sequence = () => {
            nodes.forEach((n) => n.classList.remove("is-bridge-active"));
            arrows.forEach((a) => a.classList.remove("is-bridge-active"));
            const steps = [
                () => nodes[0]?.classList.add("is-bridge-active"),
                () => arrows[0]?.classList.add("is-bridge-active"),
                () => nodes[1]?.classList.add("is-bridge-active"),
                () => arrows[1]?.classList.add("is-bridge-active"),
                () => nodes[2]?.classList.add("is-bridge-active")
            ];
            steps.forEach((step, i) => window.setTimeout(step, 260 + i * 430));
            window.setTimeout(() => {
                nodes.forEach((n) => n.classList.remove("is-bridge-active"));
                arrows.forEach((a) => a.classList.remove("is-bridge-active"));
            }, 2850);
        };
        sequence();
        window.setInterval(sequence, 6200);

        if (finePointer) {
            bridge.addEventListener("pointermove", (event) => {
                const rect = bridge.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - .5;
                const y = (event.clientY - rect.top) / rect.height - .5;
                bridge.style.transform = `perspective(1100px) rotateX(${(-y * 1.25).toFixed(2)}deg) rotateY(${(x * 1.5).toFixed(2)}deg)`;
            });
            bridge.addEventListener("pointerleave", () => { bridge.style.transform = ""; });
        }
    }

    const startSite = () => onReady(() => {
        initNavigation();
        initScrollProgress();
        initRevealSystem();
        initSurfaceResponse();
        initForms();
        initCardEntry();
        initHomeBridge();
    });

    if (window.MRLD_I18N_READY) {
        Promise.resolve(window.MRLD_I18N_READY).catch(() => {}).finally(startSite);
    } else {
        startSite();
    }
})();
