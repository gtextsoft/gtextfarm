(function () {
    var mast = document.querySelector(".mast");
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (mast) {
        var onScroll = function () {
            mast.classList.toggle("is-scrolled", window.scrollY > 8);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (toggle && links) {
        toggle.addEventListener("click", function () {
            var open = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!open));
            toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
            links.classList.toggle("is-open", !open);
        });

        links.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                toggle.setAttribute("aria-expanded", "false");
                links.classList.remove("is-open");
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            var id = this.getAttribute("href");
            if (!id || id === "#") return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        });
    });

    var fallback = document.querySelector(".hero__media img, .page-hero__media img");
    var fallbackSrc = fallback ? fallback.getAttribute("src") : "";
    if (fallbackSrc) {
        document.querySelectorAll(".product__img img, .frame img").forEach(function (img) {
            img.addEventListener("error", function () {
                if (this.dataset.fallbackApplied) return;
                this.dataset.fallbackApplied = "1";
                this.src = fallbackSrc;
                this.classList.add("is-fallback");
            });
        });
    }

    if (reduce) {
        document.querySelectorAll("[data-reveal], [data-stagger]").forEach(function (el) {
            el.classList.add("is-in");
        });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-in");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    document.querySelectorAll("[data-reveal], [data-stagger]").forEach(function (el) {
        observer.observe(el);
    });
})();
