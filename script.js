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
   INICIO COMO VIDRIERA (2026-10-17): flechas del carrusel y "Leer más"
   ========================================================= */
(function () {
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  ready(function () {
    var car = document.querySelector(".plan-carousel");
    if (car) {
      var btns = document.querySelectorAll(".carousel-btn");
      var step = function () {
        var card = car.querySelector(".plan-card");
        return card ? card.getBoundingClientRect().width + 18 : 320;
      };
      var update = function () {
        var max = car.scrollWidth - car.clientWidth - 2;
        btns.forEach(function (b) {
          var dir = Number(b.getAttribute("data-dir"));
          b.disabled = dir < 0 ? car.scrollLeft <= 2 : car.scrollLeft >= max;
        });
      };
      btns.forEach(function (b) {
        b.addEventListener("click", function () {
          car.scrollBy({ left: Number(b.getAttribute("data-dir")) * step(), behavior: "smooth" });
        });
      });
      car.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
    }

    // En escritorio el texto de "Sobre mí" se ve completo; en celular, con "Leer más".
    var more = document.getElementById("about-more");
    if (more && window.matchMedia("(min-width: 901px)").matches) more.open = true;
  });
})();
