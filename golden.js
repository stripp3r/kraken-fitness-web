/* Selector mensual / anual de KRAKEN Golden.
   Cambia el precio mostrado y los enlaces de cobro de la app. Sin JS queda el anual
   (es el valor por defecto de la app). Acepta ?frecuencia=mensual|anual en la URL
   (útil para links de campañas). */
(function () {
  var box = document.getElementById("golden-pay");
  var dataEl = document.getElementById("golden-data");
  if (!box || !dataEl) return;

  var data;
  try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }

  var app = box.getAttribute("data-app");
  var btns = box.querySelectorAll(".freq-btn");

  function set(freq) {
    var d = freq === "mensual" ? data.m : data.a;
    box.querySelector("[data-usd]").textContent = d.usd;
    box.querySelector("[data-per]").textContent = d.per;
    box.querySelector("[data-ars]").textContent = d.ars;
    box.querySelector("[data-per-ars]").textContent = d.per;
    var sub = box.querySelector("[data-sub]");
    sub.textContent = d.sub;
    sub.hidden = !d.sub;
    btns.forEach(function (b) {
      var on = b.getAttribute("data-freq") === freq;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    box.querySelectorAll("[data-pay]").forEach(function (a) {
      a.href = app + "/api/checkout/golden/" + a.getAttribute("data-pay") + "?frecuencia=" + freq;
    });
  }

  btns.forEach(function (b) {
    b.addEventListener("click", function () { set(b.getAttribute("data-freq")); });
  });

  var q = new URLSearchParams(window.location.search).get("frecuencia");
  set(q === "mensual" ? "mensual" : "anual");
})();
