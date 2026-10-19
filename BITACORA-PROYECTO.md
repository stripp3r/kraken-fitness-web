# KRAKEN — Bitácora del proyecto (sitio web)

Este documento existe para que no se pierda contexto importante entre sesiones de
Claude Code (las conversaciones se compactan/cortan en algún momento). Acá queda
registrado **qué se decidió y por qué**, no solo qué archivo tiene qué código —
eso último ya se ve leyendo el código. Si estás retomando este proyecto, empezá
por acá.

Última actualización: 2026-10-03.

---

## 1. Qué es este sitio

Sitio de una página para **KRAKEN FITNESS**, la marca de entrenamiento de Ezequiel.
HTML + CSS + JS puro, sin build, sin framework. Vive en el repo `kraken-fitness-web`
(GitHub: `stripp3r/kraken-fitness-web`), desplegado en Vercel, auto-deploy en cada
`git push` a `main`.

Estructura de archivos y secciones del home: ver `README.md` (desactualizado en
precios/página de ebooks, pero la estructura de carpetas sigue vigente).

---

## 2. Dominio y DNS — IMPORTANTE, leer antes de tocar nada de esto

### 2.1. Por qué existe `krakenbrand.com`

Surgió de una limitación real encontrada del lado de la app (`kraken-entrena-app`):
Supabase no permite personalizar el mail de recuperación de contraseña sin un
servicio SMTP propio (Resend, gratis hasta 3.000 mails/mes), y eso exige tener un
dominio propio verificado. Ni este sitio ni la app tenían uno — todo vivía en
subdominios `.vercel.app`.

### 2.2. El dominio elegido y por qué

**`krakenbrand.com`** — comprado el 2026-10-03 en **Cloudflare Registrar**, que
vende dominios a precio de costo real (sin margen, nunca sube en la renovación —
política declarada de Cloudflare, no una oferta de entrada). Precio: **US$10,46/año**,
el mismo todos los años, renovación automática activada.

Se descartó `kraken.com` (lo tiene el exchange cripto) y `kraken.fitness` (precio
de entrada bajo pero renovación de US$43,98/año — la razón por la que ahora
**siempre se chequea el precio de renovación real, no el de oferta**, antes de
comprar cualquier dominio).

Se evaluaron ~20 variantes (`krakengroup.com`, `grupokraken.com`, `krakenstudio.com`,
etc.) — la mayoría estaban tomadas o a precio de reventa absurdo. `krakenbrand.com`
fue la elegida entre las que quedaban libres.

Cuenta de Cloudflare usada: `ezequiel.arce@outlook.com`.

### 2.3. Esquema de subdominios — DECISIÓN CLAVE, no revertir sin que el usuario lo pida

KRAKEN Brand es (va a ser) una **multimarca**: fitness, DJing, y lo que venga
después. La regla es **un solo dominio, infinitos subdominios gratis** — nunca
comprar un dominio nuevo por cada vertical.

- **`fit.krakenbrand.com`** → **este sitio** (KRAKEN FITNESS). Es la URL
  canónica/permanente del sitio de fitness. Usar esta URL en links nuevos
  (bio, WhatsApp, etc.), no la de `vercel.app` ni el dominio pelado.
- **`dj.krakenbrand.com`** → futuro sitio de KRAKEN DJ. Todavía no existe.
- **`app.krakenbrand.com`** → la app (`kraken-entrena-app`). Se coordina desde
  **esa otra sesión/repo**, no desde acá — cuando lo conecten, van a actualizar
  también Supabase y los webhooks de Mercado Pago/PayPal del lado de la app.
- **`krakenbrand.com` y `www.krakenbrand.com`** → **HOY apuntan a este mismo
  sitio de fitness** (quedó así al conectar el dominio, antes de que existiera
  el subdominio `fit.`). El usuario fue explícito: **esto es temporal**. La
  idea final es que el dominio pelado sea un **sitio "hub"** que muestre todas
  las ramas de KRAKEN Brand (fit, dj, etc.), no el sitio de fitness en sí.
  **Cuando se construya ese hub: sacar `krakenbrand.com` y `www.krakenbrand.com`
  de los dominios del proyecto `kraken-fitness-web` en Vercel, y conectarlos al
  proyecto nuevo del hub.** `fit.krakenbrand.com` no se toca en esa migración,
  ya es una entrada de dominio independiente.

### 2.4. Cómo está armado técnicamente (por si hay que tocarlo)

- El dominio vive en **Cloudflare** (registrador + DNS). Vercel **no** maneja el
  DNS de este dominio.
- Para cada subdominio conectado a este sitio, el patrón es siempre el mismo:
  1. En Vercel → proyecto `kraken-fitness-web` → Settings → Domains → Add
     Existing → escribir el dominio/subdominio → ambiente **Production**.
  2. Vercel pide un registro **CNAME** (mismo valor para todos los subdominios
     de este proyecto hoy: `ed4a5d0968315c00.vercel-dns-017.com`, puede cambiar
     con el tiempo — siempre usar el valor exacto que muestre Vercel en ese
     momento, no asumir que este no cambia).
  3. En Cloudflare → `krakenbrand.com` → DNS → Records → Add record → tipo
     CNAME, nombre = el subdominio (`fit`, `dj`, `@` para el dominio pelado,
     `www`), valor = lo que pidió Vercel, **Proxy status: DNS only** (nube
     gris, no naranja — el proxy de Cloudflare puede trabar la emisión del
     certificado SSL automático de Vercel la primera vez).
  4. Esperar 1-2 minutos, refrescar en Vercel hasta que diga "Valid Configuration".

---

## 3. Mentorías — Basic y VIP (`mentorias/basic.html`, `mentorias/vip.html`)

Dos páginas de producto para el acompañamiento 1:1, con el mismo lenguaje visual
del resto del sitio (ícono en vez de foto en el hero — ver 3.2).

### 3.1. Precios y pago (no cambiar sin pedido explícito)

- **Basic: US$39/mes.** **VIP: US$99/mes.** Sin cargo de "puesta en marcha" —
  se probó con eso al principio y se sacó, el coach no quiere fricción por poca
  plata.
- Pago: dos botones de marca, **Mercado Pago** y **PayPal**, en una sección
  `#pagar` al final de cada página, apuntando a
  `kraken-entrena-app.vercel.app/api/checkout/mentoria-online/{mercadopago,paypal}?tier={basic,vip}`.
  Esos endpoints y el checkout en sí viven en el repo de la app, no acá.
- El precio en ARS para Mercado Pago está cargado en la base de la app
  (Basic $58.500, VIP $150.000) — si algún día tira 503, es porque ese precio
  se borró o cambió del lado de la app, no un problema de este sitio.

### 3.2. Diseño del hero — ícono, no foto

Las dos páginas usan un ícono "1:1" en vez de una foto (el coach no quería
reusar fotos ya usadas en otra sección, y la idea de un ícono dedicado terminó
gustando más). Básic = ícono negro, VIP = ícono **dorado** (`#c6a24c`, el mismo
tono del badge "Premium" de la tarjeta de VIP en el home) — el dorado se ajustó
a mano porque el primer intento (amber-400, el mismo de "Golden" en la app) se
veía amarillo, no dorado.

El ícono va **suelto**, sin tarjeta/borde alrededor (el arte ya trae su propia
forma y sombra). En mobile va arriba del todo, centrado, chico — no como fondo
a pantalla completa (eso solo tiene sentido para una foto).

Clases relevantes en `styles.css`: `.hero--icon` (mobile: saca el centrado
vertical de 100vh que tienen las otras heroes, porque acá el contenido es corto
y quedaba con mucho aire arriba/abajo) y `.hero-media--icon`.

### 3.3. Estructura de contenido — Basic y VIP usan patrones DISTINTOS a propósito

- **Basic**: una sola sección, **"Así funciona"**, en prosa (sin bullets ni
  números). Al principio había "Cómo funciona" (pasos numerados) + "Qué
  incluye" (bullets) por separado, pero se pisaban — repetían la misma
  información dos veces. El coach pidió unificarlas.
- **VIP**: **sí** mantiene las dos secciones separadas — "Cómo funciona" (3
  pasos numerados, componente `.steps-list`) y "Qué incluye" (bullets,
  componente `.includes-list`, con la frase "Incluye todo lo de la Mentoría
  Basic y, además:"). Acá no se pisaban porque VIP tiene mucho más contenido
  y cada beneficio nuevo es un delta concreto sobre Basic (revisión semanal,
  hasta 4 revisiones de técnica por video al mes, WhatsApp con respuesta en 1
  día hábil, videollamada de 45 min vs. los 20 de Basic, 50% off en
  consultorías). **No copiar un patrón al otro sin que el usuario lo pida** —
  son decisiones de contenido distintas, no un descuido.
- El `.steps-list` (círculo numerado) y `.includes-list` (cuadradito) son el
  mismo lenguaje visual con distinto marcador — reusar donde haga falta
  mostrar una lista con/sin orden importante.

### 3.4. Otros detalles de copy a respetar

- Nada de "contacto diario" como promesa (ni en Basic ni en VIP) — se
  reemplazó por "seguimiento continuo" (Basic) y "WhatsApp prioritario, con
  respuesta dentro de un día hábil" (VIP). Son promesas que sí se pueden
  sostener.
- FAQ de cada página: primer borrador escrito por Claude, pero **ya revisado y
  ajustado junto con el coach** en varias rondas — no es un placeholder.
- Botón "Hablar antes por WhatsApp" se sacó del hero de ambas páginas (quedaba
  redundante con la burbuja flotante de WhatsApp que ya está en todo el sitio).

---

## 4. Link-in-bio (`link/index.html`)

Reemplaza un Linktree pago que había empezado a mostrar ads. Vive en
`/link/` y también en la URL corta **`/l`** (redirect en `vercel.json`).
Ahora disponible en **`fit.krakenbrand.com/link/`** y **`fit.krakenbrand.com/l`**
(mismo deploy, domino nuevo — no hizo falta tocar nada de código para esto,
simplemente ya responde ahí apenas se conectó el subdominio).

Estado actual (2026-10-03): wordmark "KRAKEN" en texto plano (se abandonó una
versión estilizada "KЯΛKΞN" que no convenció), foto de fondo desenfocada
sutil, 6 íconos de redes, 4 botones (Web Site, Entrená Conmigo, Protocolo
Anti-Flakardo, Instalar App). Los links de "Web Site" y "Protocolo
Anti-Flakardo" ya apuntan a `fit.krakenbrand.com` (actualizado el 2026-10-03,
antes apuntaban a `kraken-fitness-web.vercel.app`). "Instalar App" sigue
apuntando a `kraken-entrena-app.vercel.app/login` — se actualizará a
`app.krakenbrand.com` cuando ese subdominio quede conectado del lado de la app.

**Pendiente (mencionado por el usuario, no armado todavía):** va a existir un
linktree separado para **KRAKEN DJ** en algún momento — hoy no hay nada que
hacer al respecto, es solo para tenerlo anotado.

---

## 5. Otras páginas del sitio

- **`planes/anti-flakardo.html`** — página de producto del plan autoguiado
  KRAKEN Anti-Flakardo (US$29,99 pago único). Pago igual que las mentorías:
  Mercado Pago + PayPal vía `kraken-entrena-app`. Es la plantilla a duplicar
  si se arman páginas propias para los otros 4 planes autoguiados (Grasa
  Sub-Cero, Híbrido, En Casa, Minimalista) — hoy esos todavía van directo a
  WhatsApp desde la tarjeta del home.
- **`herramientas/calculadora-calorias.html`** — calculadora de calorías/macros
  gratis. **Oculta del menú de navegación** a pedido del coach (la calculadora
  ahora vive también en la app, no hace falta duplicarla en el sitio) — el
  archivo sigue existiendo y funcionando, solo no está linkeada desde ningún
  lado. Si se reactiva, el dropdown "Herramientas" está comentado (no borrado)
  en el `<nav>` de `index.html`, `anti-flakardo.html` y la propia calculadora.

- **Páginas legales** (`privacidad.html`, `terminos.html`, `eliminar-datos.html`)
  — las exigen Meta (login con Facebook) y Google para la app KRAKEN Entrena.
  URLs públicas: `fit.krakenbrand.com/privacidad`, `/terminos` y
  `/eliminar-datos` (rewrites en `vercel.json`; los `.html` también andan).
  Enlazadas desde el pie (`.footer-links`) de todas las páginas del sitio.
  Texto base armado con los datos reales de la app (2026-10-07), **conviene
  revisarlo con alguien con criterio legal**. Pendientes dentro del texto:
  "Cancelaciones y reembolsos" dice **A DEFINIR POR EL COACH** (visible en la
  página — completarlo cuando lo defina); plazo de borrado (30 días) y
  conservación de registros de pago por obligación legal, a confirmar.
  Contacto usado: email del sitio + WhatsApp **3417211050** (desde 2026-10-13; el 3412672887 se dio de baja). Si la
  app cambia los datos que guarda o suma un proveedor, actualizar
  `privacidad.html` (lista de datos y de proveedores).

---

## 6. Pendientes conocidos (no son bugs, son trabajo a futuro)

- Automatizar por WhatsApp el código de 24 h para arrepentimiento y baja.
- **Botón de arrepentimiento y botón de baja (2026-10-07, hecho):** páginas
  `arrepentimiento.html` y `baja.html` (`/arrepentimiento`, `/baja`), con una
  **barra fija abajo en todas las páginas** (`.legal-bar`, bajo el botón
  flotante de WhatsApp) para cumplir la Disposición 954/2025 ("a simple vista,
  en lugar destacado, desde el primer acceso"). El pedido llega por WhatsApp
  **+54 9 341 267-2887** (mensaje prearmado, sin registro) o por email; hay que
  responder con un código de identificación en 24 h — **esa automatización la
  arma el coach aparte con Claude Code, todavía no existe**. Reglas del coach
  (ya en `terminos.html`): arrepentimiento 14 días corridos, reembolso total
  dentro del plazo y nada fuera, igual para todos los planes; baja = se frena
  la renovación y se mantiene el acceso hasta fin del período pagado (si se
  cobra igual tras pedir la baja, se devuelve); pago rechazado = 48 h de
  gracia; cambio de precio = pop-up de confirmación en la app. **Excepción
  eliminada (2026-10-07):** para no chocar con el art. 34 Ley 24.240 el coach
  decidió que el PDF de los planes autoguiados sea **solo lectura dentro de la
  app, sin descarga**, y que el acceso se revoque si se revoca la compra (se
  quita la excepción de los términos; falta implementarlo en la app — hasta
  entonces el texto no es del todo cierto). Validar con un abogado que alcance. **Pendiente en la app:** pop-up de cambio de precio, 48 h de
  gracia y las tareas del prompt del chat de la app.
- **Cumplimiento (revisión de ChatGPT del 2026-10-07, corroborada en parte
  con búsqueda web — Disposición 954/2025, vigente desde el 4/9/2025):** el
  sitio vende a distancia (mentorías por suscripción), así que debería tener
  visibles desde el primer acceso un **"BOTÓN DE ARREPENTIMIENTO"** y un
  **"BOTÓN DE BAJA DE SERVICIO"**, sin exigir registro previo y con código de
  solicitud en 24 h. Hoy no existen. Requieren que el coach defina el proceso
  (cancelación, reembolso, arrepentimiento, cambio de precio) antes de
  construirlos. Otros puntos: casilla "Acepto Términos y Privacidad" con
  registro de versión/fecha en el registro de la app, revocar tokens de Google
  al borrar cuenta (lado app), y revisar si hay que inscribir la base en el
  Registro Nacional de Bases de Datos Personales (AAIP). Ya aplicado en
  `privacidad.html`/`eliminar-datos.html`: reformulación de datos sensibles,
  datos obligatorios/opcionales, transferencias internacionales y plazos
  legales. Todo sigue siendo texto base a validar con un abogado.

- Sacar `krakenbrand.com`/`www.krakenbrand.com` de este proyecto cuando se
  construya el sitio "hub" multimarca (ver sección 2.3).
- Conectar `dj.krakenbrand.com` cuando exista contenido de KRAKEN DJ.
- Armar el linktree separado de KRAKEN DJ.
- Actualizar "Instalar App" (acá y en el home) a `app.krakenbrand.com` cuando
  quede listo del lado de la app.
- Páginas de producto propias para Grasa Sub-Cero, Híbrido, En Casa y
  Minimalista (hoy van a WhatsApp).
- Sección de Ebooks: está oculta (`hidden`) en `index.html`, lista para activar
  cuando haya título/precio/link reales.

---

## 6.bis. Diagnóstico y endurecimiento del sitio (2026-10-12)

**Hecho (commit local, falta `git push`):**
- `vercel.json`: headers de seguridad en todo el sitio (`X-Content-Type-Options`,
  `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, COOP y una
  **CSP enforced**: solo `'self'`, Google Fonts, y frames de YouTube/Vimeo para
  el futuro video). Si se agrega un script/iframe/imagen de otro dominio
  (Meta Pixel, GA, Calendly, etc.) **hay que sumarlo a la CSP o se bloquea**.
  Verificado en local: ninguna página tira violaciones.
- Hosts `krakenbrand.com` y `www.krakenbrand.com` responden con
  `X-Robots-Tag: noindex, nofollow` (sirven el mismo sitio que `fit.` y no
  deben competir en Google). **Quitar esos dos bloques de `vercel.json` cuando
  se arme el hub multimarca** (sección 2.3).
- Cache de 7 días para `/img/*`.
- `robots.txt` (bloquea `/herramientas/`) y `sitemap.xml` (9 URLs; no incluye
  linktree ni la calculadora oculta).
- Todas las páginas: `<link rel="canonical">` a `https://fit.krakenbrand.com/...`
  y Open Graph / Twitter card (imagen `img/og-kraken.jpg`, 1200x630, isotipo
  blanco sobre negro). La calculadora lleva `noindex`.
- Imágenes: `Kraken icon.png` 1,27 MB → 33 KB (512 px); íconos de mentoría
  ~440/380 KB → ~240/210 KB (500 px).
- `.gitignore`: `.agents/`, `.claude/`, `skills-lock.json`.

**Decisiones que quedan para el coach:**
- ~~Dos números de WhatsApp~~ RESUELTO 2026-10-15: **todo el sitio usa
  3417211050** (donde está el chatbot). Ya no existe el 3413441070 en el sitio.
- `img/ChatGPT Image 2 oct 2026…png` (1,9 MB) sigue sin trackear; borrar o
  usar, a decisión del coach.

**Pendiente de la app (no se puede resolver desde el sitio):** emails sin
`lower()` en el reclamo de compras, "reclamar mi compra" si el email difiere,
página de gracias propia de mentorías, aviso al coach por compra nueva,
formulario de ingreso de mentoría, activar los 4 planes autoguiados con PDF,
y la coherencia "PDF para siempre" vs 3 meses de premium.

---

## 6.ter. Revisión legal ChatGPT + verificación propia (2026-10-12)

ChatGPT revisó las 5 páginas legales; se contrastó con las normas (no se tomó
como verdad absoluta). **Verificado:** plazo legal de arrepentimiento = **10 días
corridos** (art. 34 Ley 24.240 y art. 1110 CCyC, irrenunciable; la Disp. 954/2025
remite a eso y exige botones visibles en la primera pantalla, sin registro, con
código en 24 h); Disp. 3/2026 permite verificación razonable de identidad.
**Falso:** que los términos dijeran "A DEFINIR POR EL COACH" (no estaba, ni en el
repo ni en producción).

Aplicado en el sitio: 10 días legales + **14 días como garantía comercial** del
coach; reembolso sin excepción dentro del plazo y a salvo los reclamos por
incumplimiento fuera de él (art. 10 bis); PDF de solo lectura NO usado como
fundamento para negar el arrepentimiento; baja sin penalidad/preaviso +
constancia con el código; devolución proactiva si se cobra tras la baja;
48 h de gracia con aviso; cambio de precio solo con aceptación expresa (el
silencio no cuenta); cláusulas de responsabilidad, cambios del servicio y
suspensión de cuentas reescritas; edad mínima 18; aviso de verificación de
identidad; link a Defensa del Consumidor; privacidad: datos de salud voluntarios
y transferencias sin "aceptás al crear tu cuenta".

**Falta (decide/provee el coach):** CUIT y domicilio del proveedor en los
términos; confirmar con la AAIP si hay que inscribir la base; auditar regiones y
contratos de Supabase/Vercel/Resend/Cloudflare/MP/PayPal/Google/Meta;
calendario de conservación por categoría; consentimiento específico para datos
de salud (lado app); formulario público de arrepentimiento/baja con código
automático (lado app + este sitio, y sumar el endpoint a `connect-src` de la
CSP). Todo sigue siendo texto base a validar con un abogado.

---

**Actualización 2026-10-13:** CUIT 20-37449501-2 y domicilio (Aliau 3458,
Rosario, Santa Fe) cargados en `terminos.html` y `privacidad.html`. Sin abogado:
se verificó en fuentes oficiales: (a) Disp. 954/2025 art. 1/4 (botones a la
vista, lugar destacado, primer acceso, sin registro), art. 3 (excepciones:
art. 1116 CCyC, ya usó/consumió, reventa, perecederos; el coach decidió no
invocar "consumido"), art. 5 (código en 24 h). (b) AAIP: inscripción de bases
obligatoria solo para públicas y privadas destinadas a dar informes (art. 21
Ley 25.326 + Dec. 1558/2001): KRAKEN probablemente no está alcanzado. (c) Datos a
EE.UU.: no es país adecuado según la AAIP; vías válidas = consentimiento
expreso (casilla separada, a implementar en la app) o cláusulas modelo (Disp.
60-E/2016, Res. 198/2023). El texto de privacidad ya promete esa casilla.
Prompts enviados al chat "KRAKEN APP 2" el 2026-10-13.

---

## 6.quater. Formulario público de arrepentimiento y baja (2026-10-14)

`arrepentimiento.html` y `baja.html` tienen un formulario (email, producto,
nº de operación opcional, honeypot oculto) que hace `POST` a
`https://appfit.krakenbrand.com/api/publico/solicitud` (endpoint de la app, sin
login). Lógica en `solicitud.js`; estilos `.solicitud-*` al final de `styles.css`;
`vercel.json` suma `https://appfit.krakenbrand.com` a `connect-src` de la CSP.
WhatsApp y email quedan como alternativa debajo del formulario y como respaldo
si el envío falla.

Contrato (de la app): body `{tipo: "arrepentimiento"|"baja", email, producto?,
numeroOperacion?, website: ""}`. 200 `{ok, codigo, constanciaEnviadaPorEmail,
verificada}` -> se muestra el código en pantalla (el honeypot devuelve 200 con
`SIN-REGISTRO`: el sitio lo trata como fallo). 400 -> se muestra `error`;
429 (5/IP/hora, 3/email/día), 403, 500 o red -> mensaje + WhatsApp/email.
CORS solo `https://fit.krakenbrand.com`. La app NO corta suscripciones ni revoca
compras sola: el coach ejecuta la solicitud; por eso el texto dice "recibimos
tu solicitud", nunca "se canceló". Las constancias por email salen cuando el
coach cargue `RESEND_API_KEY`, `MAIL_FROM` y `COACH_EMAIL` en Vercel de la app
(hasta entonces quedan en cola y el código igual se muestra).

Probado en local con respuestas simuladas (200, 400, 429, 500, red, honeypot) y
sin violaciones de CSP. Pruebas reales contra producción: pendiente de hacer
desde `fit.krakenbrand.com` una vez publicado (crea una solicitud real y avisa al
coach: usar un email de prueba propio).

---

## 6.quinquies. Unificación de WhatsApp y dominio de la app (2026-10-15)

- Todos los `wa.me` del sitio (inicio, planes, mentorías, calculadora oculta,
  linktree, legales) apuntan a **5493417211050**. Decisión del coach: ese es el
  número del chatbot y el único a usar.
- Todos los links a la app (Instalar App, checkouts de Anti-Flakardo y de
  mentorías) pasaron de `kraken-entrena-app.vercel.app` a
  **`appfit.krakenbrand.com`** (el dominio viejo sigue funcionando en la app).
- Links del linktree revisados: todos responden 200.
- Meta/Google: Google en producción (nada pendiente). Facebook sigue en
  verificación de Meta; las URLs que debe tener la app de Meta son
  `https://fit.krakenbrand.com/privacidad`, `/terminos` y `/eliminar-datos`.

---

## 6.sexies. Mejora de diseño — Ola 1 (2026-10-16)

Pedido del coach: más dinamismo y aspecto profesional, **siempre responsive**
(escritorio + celular). Ola 1 hecha (commit propio, se puede revertir con
`git revert`). Código en `styles.css` (sección "OLA 1") y `script.js` (bloque
"OLA 1"):
- Hero: el título entra palabra por palabra y el resto escalonado; parallax
  suave de la foto solo en escritorio con mouse (en celular no hay parallax).
- Franja animada (marquee) bajo el hero con frases ya presentes en el sitio
  (sin números inventados; en `index.html`). Se pausa con hover; con
  `prefers-reduced-motion` queda estática.
- Tarjetas de planes: luz que sigue al mouse (solo con mouse), entradas
  escalonadas por fila, feedback táctil al tocar.
- Barra de progreso de scroll arriba, botón "volver arriba" (izquierda, sobre
  la barra legal; el de WhatsApp sigue a la derecha), sección activa marcada
  en el menú, foco visible para teclado, selección de texto con la marca.
- Todo el movimiento respeta `prefers-reduced-motion`.

**Ideas acordadas para después:** Ola 2 (resultados antes/después, testimonios,
preguntas frecuentes, video del método) y Ola 3 (comparador de planes,
recomendador, barra de compra en celular, capturas de la app). **Pendiente
anotado por el coach:** el botón "Instalar app" del hero lleva a una página de
instalación de la app; la idea es que al tocarlo aparezca un video/animación de
cómo es y cómo se instala (excusa: en Chrome hay que apretar más de una vez).
La animación vieja quedó obsoleta (la app cambió estética y funciones): hay que
rehacerla con capturas nuevas de la app. Franja de números/contadores: no se
hizo porque faltan datos reales del coach.

---

## 6.septies. Franja fuera, versión en inglés, 404 e impresión (2026-10-16)

- **Franja animada (marquee) ELIMINADA** del inicio por pedido del coach (no se
  entendía qué era). Quedó el resto de la Ola 1.
- **Versión en inglés** (`/en/`): `en/index.html`, `en/plans/anti-flakardo.html`,
  `en/mentoring/basic.html`, `en/mentoring/vip.html`. Se generó traduciendo las
  páginas en español con un script (los textos están en el historial de este
  commit). Botón de idioma **ES / EN** (globo + código) siempre visible arriba a la derecha, también en celular junto al menú, etiquetas `hreflang` en ambos
  idiomas y las 4 URLs nuevas en `sitemap.xml`. Las páginas **legales siguen
  solo en español** (son las que tienen validez en Argentina; en inglés los
  links dicen "(Spanish)") y la barra legal conserva los nombres obligatorios
  "Botón de arrepentimiento" / "Botón de baja de servicio". **Los checkouts y
  la app siguen en español.** Si se cambia texto de una página en español hay
  que repetirlo a mano en la de inglés. El video "Video coming soon" de
  Anti-Flakardo es el mismo placeholder que en español. Las 4 páginas pendientes
  (planes que van por WhatsApp) y los ebooks no tienen versión en inglés.
- **404 con la marca** (`404.html`, bilingüe, `noindex`).
- **Modo de impresión** (`@media print` en `styles.css`): al imprimir o guardar
  en PDF queda blanco y negro, sin menú ni barras, con los links visibles.

---

## 6.octies. KRAKEN Golden en el sitio (2026-10-17)

**Decisión del coach:** todo el cobro pasa por el sitio (la app deja de cobrar y de
mostrar precios) por las reglas/comisiones de Apple y Google al publicarla en
App Store / Play Store. Ecosistema: sitio = vitrina y cobro; app = producto.

- Página `planes/golden.html` (+ `en/plans/golden.html`), tarjeta "Membresía"
  en el inicio (ES y EN) y 2 URLs nuevas en el sitemap. Lógica del selector
  mensual/anual en `golden.js` (los precios están en un bloque JSON dentro de
  cada página: **si se cambian precios hay que editarlos ahí, en el HTML de la
  tarjeta del inicio y en la tabla `productos` de la app**). Acepta
  `?frecuencia=mensual|anual` en la URL (para campañas).
- Precios actuales (confirmados por el coach el 2026-10-17; "quizá los
  modifiquemos para campañas"): mensual **US$12,99 / ARS 19.500**; anual
  **US$99 / ARS 150.000** (equivale a US$8,25/mes; "ahorrás ~35%" real = ~36%).
  Mercado Pago cobra en ARS y PayPal en USD (verificado en el código de la app).
- Botones (pestaña nueva): `https://appfit.krakenbrand.com/api/checkout/golden/{mercadopago|paypal}?frecuencia={mensual|anual}`.
  Requieren cuenta e inicio de sesión en la app (la app manda a /login y vuelve):
  la página lo avisa y enlaza a `https://appfit.krakenbrand.com/registro`.
- Texto legal junto al botón, copiado tal cual lo pidió el chat de la app
  (renovación automática, baja sin penalidad, 10 días legales + 14 de KRAKEN),
  con links a /baja, /arrepentimiento y /terminos.
- El hero usa el isotipo `kraken-mark.png` (no hay arte propio de Golden): si el
  coach quiere un ícono dorado como el de las mentorías, hay que crearlo.
- Contenido ("qué incluye", cómo empezar, FAQ) redactado a partir de la lista que
  mostraba la app; revisar con el coach.

---

## 6.nonies. Inicio como vidriera — propuesta A (2026-10-17)

Auditoría de UX del coach (celular): el inicio medía **10 pantallas** (7,3 en
escritorio); 6,4 eran ofertas (8 tarjetas de ~590 px con precio y puntos
repetidos). Decisión del coach: propuesta **A** y **sin precios en el inicio**
(celular y escritorio; los precios viven en la página de cada producto).
Resultado: ~5,7 pantallas en celular y ~5,5 en escritorio.

Estructura nueva del inicio (ES `index.html` y EN `en/index.html`):
1. Hero con botones más chicos: "Planes autoguiados" (antes "Ver Planes"),
   "Mentoría 1:1" e "Instalar app". El menú suma "Mentorías".
2. "Elegí cómo querés entrenar": 3 caminos (autoguiados / mentoría / Golden).
3. `#autoguiados`: carrusel horizontal (scroll-snap; flechas solo en escritorio
   con mouse) con 5 tarjetas sin precio ni lista de puntos. Anti-Flakardo →
   su página; los otros 4 siguen yendo a WhatsApp ("Lo quiero") **sin cambios**,
   el coach los trabaja esta semana. Se mantuvo la nota "se compran por
   WhatsApp mientras terminamos de activar el pago automático".
4. `#mentorias`: 2 tarjetas compactas sin precio → sus páginas.
5. `#golden`: banner compacto → `planes/golden.html`.
6. "Sobre mí": primer párrafo + "Leer más" (`<details>`); abierto por defecto
   en escritorio.
Los textos de las tarjetas son los que ya existían (sin cambios de copy);
el nuevo texto de Anti-Flakardo fue **aprobado por el coach el 2026-10-17** (frase «Soy flaco y no puedo subir de peso.» + "Sos flaco, comés, entrenás y no crecés. Con mi método dejás de abandonar y empezás a ver resultados, sin vivir en el gym."; ya aplicado)
(frase en tono más terrenal). Los textos de los 3 caminos y el subtítulo de la
sección son nuevos y cortos; el coach los revisa.
Ideas anotadas para después: selector por objetivo (opción C), sacar el
recuadro "Video próximamente" de Anti-Flakardo hasta que haya video.

---

## 6.decies. Ajustes al inicio y página de la app (2026-10-17, tarde)

Feedback del coach sobre la propuesta A:
- **Se sacaron los 3 caminos** del inicio (redundantes con los botones del hero).
  Ahora "Planes autoguiados" lleva directo al carrusel (`#autoguiados`),
  "Mentoría 1:1" a las mentorías (`#mentorias`). Cada bloque tiene un subtítulo
  nuevo: autoguiados "Entrenás por tu cuenta, según tu objetivo: cada plan trae
  un método claro y la rutina lista para empezar. Elegí el tuyo." / mentorías
  "Te acompaño yo, paso a paso: un plan hecho para vos y seguimiento real por
  WhatsApp y la app. Elegí tu nivel." Inicio: ~5 pantallas en celular.
- **"Instalar app" ya no abre el login de la app** (era una página externa, otra
  pestaña, con email/contraseña). Ahora abre **`/app.html`** (`/en/app.html`) dentro
  del sitio, misma pestaña: "La KRAKEN App" con pasos de instalación
  (Android/iPhone), botón "Abrir la app" (→ `appfit.krakenbrand.com/login`, ahí sí
  es la app) y la **membresía Golden** (qué incluye + selector mensual/anual +
  pago). Se sacó el cartel de pasos del hero. El linktree también apunta a
  `/app.html`. **No se prometió "pronto en Play Store / App Store"** (por la
  situación de comisiones). Cuando haya video de la app, va en esta página.
- Texto de Anti-Flakardo aprobado (ver arriba) ya aplicado.

---

## 6.undecies. Planes desplegables y nombres nuevos (2026-10-17, noche)

- **Autoguiados como cuadros desplegables** (`<details class="plan-acc" name="autoguiados">`)
  en vez del carrusel: cerrado muestra nombre + frase del problema; abierto,
  descripción, 4 puntos y botón ("Ver plan" para Anti-Flakardo; "Lo quiero" →
  WhatsApp para los otros 4, sin cambios hasta que existan sus páginas). Un solo
  plan abierto a la vez; Anti-Flakardo abierto por defecto. Sin precios en el
  inicio. Se sacó la frase "Los planes autoguiados se compran por WhatsApp
  mientras terminamos de activar el pago automático".
- **Nombres sin el prefijo "KRAKEN"** (orden y nombres dados por el coach):
  Anti-Flakardo, Grasa Sub-Cero, **Mínimo Letal** (antes Minimalista),
  **Hybrid Build** (antes Híbrido), **Modo Búnker** (antes En Casa). El mapeo se
  hizo por contenido (mínimo tiempo / otro deporte / en casa). Los mensajes
  prearmados de WhatsApp usan los nombres nuevos. La página de Anti-Flakardo
  todavía dice "KRAKEN Anti-Flakardo" en su título (pendiente de confirmar).
- **La membresía Golden salió del inicio**: vive solo en `/app.html` (Instalar
  app) y en `planes/golden.html` (link directo para campañas).
- **Escritorio**: botones del hero apilados con el mismo ancho (280 px) y altura;
  autoguiados, mentorías y bloques alineados al mismo ancho de contenedor.
- **Pendiente:** rediseño de `/app.html` (al coach no le gusta cómo se ve).

---

## 6.duodecies. Rediseño de /app.html (2026-10-17)

`app.html` y `en/app.html` rehechas (orden aprobado por el coach): hero con el
isotipo (sin maqueta de celular hasta que haya capturas de la app) →
**Golden** (2 tarjetas Mensual / Anual con precio en USD, equivalente en ARS por
Mercado Pago y botones de pago; el anual con cinta "Ahorrás ~35%"; aviso de
cuenta y texto legal debajo) → "Qué incluye" en 6 recuadros con ícono → "Cómo
instalarla" en 3 pasos + botón "Abrir la app" → preguntas frecuentes. Ya no usa
el selector de `golden.js` (ese sigue solo en `planes/golden.html`). Si cambian
los precios: tabla `productos` de la app, `planes/golden.html` (+ EN) y
`app.html` (+ EN). Cuando haya capturas/video de la app, van en el hero.

---

## 6.terdecies. Pendiente: animación de la app en /app.html (2026-10-17)

El coach está rehaciendo la animación/video que muestra la KRAKEN App (la vieja
quedó obsoleta: la app cambió estética y funciones) y avisará cuando esté. Va en
el hero de `app.html` y `en/app.html` (hoy el pulpo `kraken-mark.png` ocupa ese
lugar). Hay que pedirle: archivo (MP4 liviano; si pesa se comprime), formato
(vertical u horizontal), si tiene sonido y duración. Reproducción sugerida: en
silencio, bucle, `autoplay muted playsinline`, con imagen de portada (`poster`)
y sin descargar el video completo en celular hasta que se vea. Agregar los
dominios de hosting del video a la CSP (`media-src` en `vercel.json`) si no se
sirve desde el propio sitio.

---

## 6.quaterdecies. Video de la app en /app (2026-10-17, noche)

El coach entregó `D:\PROYECTO FITNESS\VIDEOS\MP4 EXPORTADOS\kraken_entrena_app_demo.mp4`
(1080x1920, 30 s, 24,7 MB). Se comprimió a `video/kraken-app-demo.mp4`
(720x1280, H.264, ~2,1 MB) + portada `video/kraken-app-demo-poster.jpg`. Está en el
hero de `app.html` y `en/app.html` (reproductor vertical con bordes redondeados,
debajo del texto en celular). `appvideo.js`: arranca en silencio y en bucle, se
pausa cuando sale de pantalla, botón para activar el sonido, y con
`prefers-reduced-motion` no se reproduce solo (muestra controles). El original
queda en la carpeta del coach; si se rehace el video, repetir la compresión
(ffmpeg: `scale=720:1280`, `libx264 -crf 28 -preset slow -movflags +faststart`,
`aac 80k`) y reemplazar los dos archivos de `video/`.
Mismo día: botones del hero centrados en celular (se había roto al apilarlos),
primer plan autoguiado ya NO viene desplegado por defecto. Se mantiene el título
"KRAKEN Anti-Flakardo" en la página del plan (decisión del coach).
Barra legal inferior (Botón de arrepentimiento / baja): se mantiene visible por
la Disp. 954/2025 (arts. 1 y 4: "a la vista, en lugar destacado y desde el primer
acceso"); ver 6.ter.

---

## 6.quindecies. Barra legal más discreta (2026-10-17)

A pedido del coach la barra fija de "Botón de arrepentimiento" / "Botón de baja de
servicio" pasó de 40 a **30 px** de alto, letra 0,64 rem (0,6 en celular) en peso
normal, color gris claro y un punto separador. **Sigue visible en todas las
páginas, en el primer acceso y sin registro** (Disp. 954/2025 arts. 1 y 4); no
reducirla más ni esconderla en el pie. La altura vive en `--legal-bar-h` (de ahí
cuelgan el botón de WhatsApp, "volver arriba" y el padding del pie).

---

## 6.sexdecies. Video de la app más grande (2026-10-18)

Pedido del coach: el video se veía chico en celular. Ahora en celular (<= 480 px)
ocupa **todo el ancho de la pantalla** (sin bordes laterales, ~390x693) con el
truco de ancho completo `margin: calc(50% - 50vw)`; en tablet queda centrado
(máx. 480 px) y en escritorio mide 390 px de ancho (antes 340). El botón de
sonido pasó arriba a la derecha del video para no chocar con el botón flotante
de WhatsApp.

---

## 6.septendecies. Revisión de seguridad (2026-10-19)

Hallazgo: `BITACORA-PROYECTO.md` se estaba sirviendo públicamente
(`fit.krakenbrand.com/BITACORA-PROYECTO.md`) con notas internas. Corregido con
`.vercelignore` (excluye bitácora, README, fotos originales y carpetas de
herramientas del deploy; **no borrar ese archivo**). Se agregó
`.well-known/security.txt` (contacto; renovar el `Expires` antes de 2027-10-19).
Verificado OK: HTTPS forzado, HSTS, CSP, X-Frame-Options, nosniff,
Referrer/Permissions-Policy, COOP; sin secretos en el repo; `.git`, `.env`,
`vercel.json` y carpetas internas dan 404; el endpoint de la app rechaza
orígenes ajenos (403).

---

## 7. Dónde está todo (resumen rápido)

```
NUEVO SITIO WEB/
├── index.html                         # Home
├── styles.css                         # Todos los estilos del sitio
├── script.js                          # Nav, animaciones, dropdowns
├── vercel.json                        # Redirects, rewrites, headers de seguridad/CSP
├── BITACORA-PROYECTO.md               # Este archivo
├── README.md                          # Instrucciones de dev/deploy (estructura al día, precios no)
├── link/index.html                    # Link-in-bio
├── mentorias/
│   ├── basic.html
│   └── vip.html
├── planes/
│   └── anti-flakardo.html
├── herramientas/
│   └── calculadora-calorias.html      # Oculta del nav, no borrada
└── img/                                # Fotos, íconos, logos de pago
```
