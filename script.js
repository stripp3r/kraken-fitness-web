/* =========================================================
   KRAKEN FITNESS — script.js
   Navegación y animaciones de scroll.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Año dinámico en el footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: fondo al hacer scroll ---------- */
  const header = document.getElementById("site-header");
  const onScroll = () => {
    if (window.scrollY > 20) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú mobile ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav");

  const closeNav = () => {
    nav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll(".nav-link, .nav-dropdown-link").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  /* ---------- Menú desplegable "Herramientas" ---------- */
  document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
    const toggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (!toggle) return;

    const closeDropdown = () => {
      dropdown.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) closeDropdown();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDropdown();
    });
  });

  /* ---------- Animaciones al hacer scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealAll = () => revealEls.forEach((el) => el.classList.add("visible"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
    // Red de seguridad: si algo no se reveló por un fallo del observer, mostrarlo igual.
    setTimeout(revealAll, 2500);
  } else {
    revealAll();
  }
});

/* =========================================================
   OLA 1 — dinamismo (2026-10-16)
   Barra de progreso, volver arriba, sección activa en el nav, hero animado,
   parallax, luz en tarjetas y entradas escalonadas. Todo es opcional: si algo
   falla o el usuario pidió menos movimiento, el sitio funciona igual.
   ========================================================= */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var wide = window.matchMedia && window.matchMedia("(min-width: 901px)").matches;

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    /* ---------- Barra de progreso + volver arriba ---------- */
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    var toTop = document.createElement("button");
    toTop.type = "button";
    toTop.className = "to-top";
    toTop.setAttribute("aria-label", "Volver arriba");
    toTop.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
    document.body.appendChild(toTop);

    /* ---------- Hero: título palabra por palabra ---------- */
    var hero = document.querySelector(".hero");
    var title = document.querySelector(".hero-title");
    if (hero && title && !reduce) {
      var idx = 0;
      var split = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) {
                frag.appendChild(document.createTextNode(part));
              } else {
                var s = document.createElement("span");
                s.className = "w";
                s.style.setProperty("--i", idx++);
                s.textContent = part;
                frag.appendChild(s);
              }
            });
            node.replaceChild(frag, n);
          } else if (n.nodeType === 1 && n.nodeName !== "BR") {
            split(n);
          }
        });
      };
      split(title);
      hero.classList.add("hero-anim");
    }

    /* ---------- Parallax suave de la foto del hero (escritorio con mouse) ---------- */
    var heroMedia = document.querySelector(".hero-media:not(.hero-media--icon)");
    var heroImg = heroMedia && heroMedia.querySelector("img");
    var ticking = false;

    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
      toTop.classList.toggle("is-on", y > 700);
      if (heroImg && !reduce && finePointer && wide && y < window.innerHeight * 1.2) {
        heroImg.style.transform = "translate3d(0," + (y * 0.07).toFixed(1) + "px,0) scale(1.07)";
      }
      ticking = false;
    }
    if (heroImg && !reduce && finePointer && wide) heroMedia.classList.add("hero-media--parallax");
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(onScroll);
        }
      },
      { passive: true }
    );
    onScroll();

    /* ---------- Nav: marcar la sección visible ---------- */
    var links = {};
    document.querySelectorAll('.nav-link[href^="#"]').forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    var ids = Object.keys(links).filter(function (id) {
      return document.getElementById(id);
    });
    if (ids.length && "IntersectionObserver" in window) {
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            ids.forEach(function (id) {
              links[id].classList.toggle("is-active", id === e.target.id);
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      ids.forEach(function (id) {
        spy.observe(document.getElementById(id));
      });
    }

    /* ---------- Luz que sigue al mouse en las tarjetas de planes ---------- */
    if (finePointer && !reduce) {
      document.querySelectorAll(".plan-card").forEach(function (card) {
        card.addEventListener("pointermove", function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty("--mx", e.clientX - r.left + "px");
          card.style.setProperty("--my", e.clientY - r.top + "px");
        });
      });
    }

    /* ---------- Entradas escalonadas: las tarjetas de una misma fila entran una tras otra ---------- */
    if (!reduce) {
      window.requestAnimationFrame(function () {
        var groups = new Map();
        document.querySelectorAll(".plan-grid > .reveal, .values-grid > .reveal").forEach(function (el) {
          var p = el.parentNode;
          if (!groups.has(p)) groups.set(p, []);
          groups.get(p).push(el);
        });
        groups.forEach(function (els) {
          els.forEach(function (el, i) {
            var inRow = 0;
            for (var k = 0; k < i; k++) {
              if (Math.abs(els[k].offsetTop - el.offsetTop) < 6) inRow++;
            }
            if (!inRow) return;
            el.style.transitionDelay = inRow * 110 + "ms";
            var clear = function (ev) {
              if (ev.propertyName === "opacity") {
                el.style.transitionDelay = "";
                el.removeEventListener("transitionend", clear);
              }
            };
            el.addEventListener("transitionend", clear);
          });
        });
      });
    }
  });
})();

/* =========================================================
   INICIO (2026-10-17): planes desplegables y "Leer más"
   ========================================================= */
(function () {
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  ready(function () {
    // Un solo plan abierto a la vez (por si el navegador no soporta details[name]).
    var accs = document.querySelectorAll("details.plan-acc");
    accs.forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (!d.open) return;
        accs.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });

    // En escritorio el texto de "Sobre mí" se ve completo; en celular, con "Leer más".
    var more = document.getElementById("about-more");
    if (more && window.matchMedia("(min-width: 901px)").matches) more.open = true;
  });
})();

/* =========================================================
   EFECTOS TRAÍDOS DE DIGITAL (2026-10-30): cursor con etiqueta
   Sobre las fotos aparece un círculo con "KRAKEN"; sobre el video de la app,
   "Sonido" (un clic en el video activa o silencia el sonido, igual que su
   botón). Solo escritorio con mouse y sin movimiento reducido.
   ========================================================= */
(function () {
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduce) return;
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  ready(function () {
    var en = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
    document.querySelectorAll(".hero-media:not(.hero-media--icon), .about-media").forEach(function (z) {
      z.setAttribute("data-cursor", "KRAKEN");
    });
    var vid = document.querySelector(".app-video");
    var snd = document.getElementById("app-video-sound");
    if (vid && snd && !snd.hidden) {
      vid.setAttribute("data-cursor", en ? "Sound" : "Sonido");
      vid.addEventListener("click", function (e) {
        if (!e.target.closest("#app-video-sound")) snd.click();
      });
    }
    if (!document.querySelector("[data-cursor]")) return;

    var c = document.createElement("div");
    c.className = "cursor";
    c.setAttribute("aria-hidden", "true");
    var lab = document.createElement("span");
    c.appendChild(lab);
    document.body.appendChild(c);

    var x = -200, y = -200, tx = -200, ty = -200, s = 0, ts = 0, running = false;
    var loop = function () {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      s += (ts - s) * 0.2;
      c.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) scale(" + s.toFixed(3) + ")";
      if (Math.abs(tx - x) < 0.2 && Math.abs(ty - y) < 0.2 && Math.abs(ts - s) < 0.002) {
        running = false;
        return;
      }
      window.requestAnimationFrame(loop);
    };
    var kick = function () {
      if (!running) {
        running = true;
        window.requestAnimationFrame(loop);
      }
    };
    window.addEventListener(
      "pointermove",
      function (e) {
        tx = e.clientX;
        ty = e.clientY;
        var z = e.target.closest && e.target.closest("[data-cursor]");
        var onCtl = e.target.closest && e.target.closest("a, button");
        var label = z && !onCtl ? z.getAttribute("data-cursor") : "";
        ts = label ? 1 : 0;
        if (label) lab.textContent = label;
        kick();
      },
      { passive: true }
    );
    document.addEventListener("pointerleave", function () {
      ts = 0;
      kick();
    });
  });
})();

/* =========================================================
   EFECTOS TRAÍDOS DE DIGITAL (2026-10-30): botones "magnéticos"
   Los botones principales siguen un poco al mouse (solo escritorio con mouse).
   ========================================================= */
(function () {
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduce) return;
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  ready(function () {
    document
      .querySelectorAll(".hero-actions .btn, .hero-actions .hero-app-cta, .about-text > .btn, .install-actions .btn, .notfound-actions .btn")
      .forEach(function (b) {
        if (b.matches(".btn-mercadopago, .btn-paypal")) return;
        b.addEventListener("pointermove", function (e) {
          var r = b.getBoundingClientRect();
          b.style.translate =
            ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px " +
            ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + "px";
        });
        b.addEventListener("pointerleave", function () {
          b.style.translate = "";
        });
      });
  });
})();
