/* Video de la KRAKEN App en /app: arranca en silencio y en bucle, solo se reproduce
   mientras se ve en pantalla, y el botón activa o silencia el sonido. */
(function () {
  var v = document.getElementById("app-video");
  var btn = document.getElementById("app-video-sound");
  if (!v) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    v.removeAttribute("autoplay");
    v.removeAttribute("loop");
    v.pause();
    v.controls = true;
    if (btn) btn.hidden = true;
    return;
  }

  if (btn) {
    btn.addEventListener("click", function () {
      v.muted = !v.muted;
      var on = !v.muted;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? btn.getAttribute("data-off") : btn.getAttribute("data-on"));
      if (on && v.paused) v.play().catch(function () {});
    });
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) v.play().catch(function () {});
          else v.pause();
        });
      },
      { threshold: 0.35 }
    ).observe(v);
  }
})();
