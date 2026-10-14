/* Formulario público de arrepentimiento y baja (Disposición 954/2025).
   Envía la solicitud a la app (endpoint público, sin login) y muestra el código de
   identificación. Si algo falla, se ofrece WhatsApp / email como alternativa.
   Contrato del endpoint: ver BITACORA-PROYECTO.md (sección "Formulario público"). */
(function () {
  var ENDPOINT = 'https://appfit.krakenbrand.com/api/publico/solicitud';
  var form = document.getElementById('solicitud-form');
  if (!form) return;

  var btn = document.getElementById('solicitud-btn');
  var msg = document.getElementById('solicitud-msg');
  var ok = document.getElementById('solicitud-ok');
  var codigoEl = document.getElementById('solicitud-codigo');
  var emailNote = document.getElementById('solicitud-email-note');
  var tipo = form.getAttribute('data-tipo');
  var altLinks = document.querySelector('.solicitud-alt');

  function mostrar(texto, esError) {
    msg.hidden = false;
    msg.className = 'solicitud-msg' + (esError ? ' is-error' : '');
    msg.textContent = texto;
  }

  function mostrarFallo(texto) {
    mostrar(texto + ' Podés usar WhatsApp o email (abajo).', true);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.elements.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      mostrar('Revisá el email: parece incompleto.', true);
      form.elements.email.focus();
      return;
    }

    var body = {
      tipo: tipo,
      email: email,
      producto: form.elements.producto.value,
      numeroOperacion: form.elements.numeroOperacion.value.trim(),
      website: form.elements.website.value
    };

    btn.disabled = true;
    var textoBtn = btn.textContent;
    btn.textContent = 'Enviando…';
    msg.hidden = true;

    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 20000) : null;

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) {
          return { status: r.status, data: d };
        });
      })
      .then(function (res) {
        var d = res.data || {};
        if (res.status === 200 && d.ok && d.codigo && d.codigo !== 'SIN-REGISTRO') {
          codigoEl.textContent = d.codigo;
          emailNote.textContent = d.constanciaEnviadaPorEmail
            ? 'También te enviamos la constancia por email.'
            : 'La constancia te llega por email en cuanto se procese.';
          form.hidden = true;
          msg.hidden = true;
          ok.hidden = false;
          ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        if (res.status === 200) {
          // Respuesta del honeypot u otra sin código: no confirmar nada que no se registró.
          mostrarFallo('No pudimos registrar tu solicitud.');
        } else if (res.status === 400 && d.error) {
          mostrar(d.error, true);
        } else if (res.status === 429) {
          mostrarFallo(d.error || 'Hiciste demasiados intentos.');
        } else {
          mostrarFallo('No pudimos registrar tu solicitud en este momento.');
        }
      })
      .catch(function () {
        mostrarFallo('No pudimos conectarnos para registrar tu solicitud.');
      })
      .then(function () {
        if (timer) clearTimeout(timer);
        btn.disabled = false;
        btn.textContent = textoBtn;
      });
  });
})();
