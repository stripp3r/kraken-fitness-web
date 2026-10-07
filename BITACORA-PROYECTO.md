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
  Contacto usado: email del sitio + WhatsApp **3412672887** (decidido por el usuario el 2026-10-07; es distinto del número de checkout del sitio, 5493413441070). Si la
  app cambia los datos que guarda o suma un proveedor, actualizar
  `privacidad.html` (lista de datos y de proveedores).

---

## 6. Pendientes conocidos (no son bugs, son trabajo a futuro)

- Completar "Cancelaciones y reembolsos" en `terminos.html` (hoy dice A DEFINIR
  POR EL COACH).
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

## 7. Dónde está todo (resumen rápido)

```
NUEVO SITIO WEB/
├── index.html                         # Home
├── styles.css                         # Todos los estilos del sitio
├── script.js                          # Nav, animaciones, dropdowns
├── vercel.json                        # Redirect /l -> /link/
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
