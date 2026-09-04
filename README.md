# KRAKEN FITNESS — Sitio Web

Sitio de una página para la marca de fitness **KRAKEN FITNESS** (hipertrofia natural).
HTML + CSS + JavaScript puro, sin build. Se abre directo en el navegador.

## Estructura

```
NUEVO SITIO WEB/
├── index.html            # Home: estructura y contenido
├── styles.css            # Estilos (estética oscura / premium)
├── script.js             # Navegación y animaciones
├── Kraken icon.png       # Logo / icono original (fondo no transparente)
├── img/
│   ├── hero.jpg          # Foto del Hero (byn)
│   ├── sobre-mi.jpg      # Foto de Sobre Mí (byn)
│   └── kraken-mark.png   # Icono KRAKEN, versión blanca con fondo transparente (footer)
├── planes/
│   └── anti-flakardo.html  # Página propia del plan KRAKEN Anti-Flakardo (ver abajo)
├── Fotos sitio web/      # Fotos originales (no se publican, quedan de respaldo)
└── README.md
```

## Secciones (home)

1. **Header** — nav fija (Inicio, Planes, Sobre Mí, Contacto) + menú mobile.
2. **Hero** — título, tagline, botones "Ver Planes" / "Mentoría 1:1" y foto.
3. **Planes**
   - Autoguiados: **KRAKEN Anti-Flakardo** (destacado, con página propia — ver abajo), **Grasa Sub-Cero**, **Híbrido**, **En Casa**, **Minimalista** — US$29,99 pago único c/u.
   - Con acompañamiento: **Mentoría Basic** (US$49 + US$39/mes) y **Mentoría VIP** (US$149 + US$100/mes).
4. **Ebooks** — sección oculta, lista para activar (ver abajo).
5. **Sobre Mí** — foto + descripción.
6. **Contacto** — WhatsApp, Instagram, Facebook, TikTok, YouTube, email. Además, botón flotante de WhatsApp en todas las páginas.

> La biblioteca de ejercicios no va en el sitio: los videos viven en Google Drive y se
> enlazan dentro de cada plan / asesoría.

## Página de producto (`planes/anti-flakardo.html`)

En vez de pagar directo desde la tarjeta del home, el botón **"Ver plan completo"** lleva a una
página dedicada del plan: descripción larga, qué incluye, un espacio para video, a quién está
dirigido, y ahí sí los dos botones de pago (Mercado Pago / PayPal).

Para agregar el video de Ezequiel, hay instrucciones en un comentario dentro del archivo
(sección "VIDEO (PENDIENTE)"): soporta YouTube, Vimeo o un archivo de video propio.

Cuando se arme la página de otro plan (Grasa Sub-Cero, Híbrido, etc.), se puede duplicar este
archivo dentro de `planes/` como base — ya comparte los estilos (`../styles.css`) y la
estructura con el resto del sitio.

### Botones de pago del Anti-Flakardo

- **Pagar con Mercado Pago** → link de DropyFile.
- **Pagar con PayPal** → link de Payhip, con ventana de pago embebida sobre el sitio (widget
  oficial de Payhip, `payhip.js`, cargado al final de `planes/anti-flakardo.html`).

> Se descartó Hotmart para este plan: en el checkout, Mercado Pago le sumaba a AFIP un ~20-24%
> de impuestos por ser una plataforma extranjera, encareciendo el precio final para el
> comprador. Por eso se volvió al esquema dividido Payhip + DropyFile.

---

## Estado actual: qué funciona y qué falta

| Elemento | Estado |
|---|---|
| Redes y WhatsApp | ✅ Cargados (WhatsApp `5493413441070`, IG/FB/TikTok/YT reales) |
| Fotos | ✅ Cargadas (byn) |
| Precios de planes | ✅ Cargados |
| Botones de compra de los planes | ⏳ Van a **WhatsApp** por ahora (venta manual). Falta cambiarlos por links de pago |
| Sección Ebooks | ⏳ Oculta. Falta título/precio/link de cada ebook y activarla |

### Cambiar los botones de compra por links de pago

En `index.html`, en cada tarjeta de plan autoguiado, el botón es:

```html
<a href="https://wa.me/5493413441070?text=..." ...>Lo quiero</a>
```

Cuando tengas el link de checkout de **Payhip** o **Hotmart** de ese plan, reemplazá el `href`
por ese link (dejá el resto igual). Ejemplo:

```html
<a href="https://payhip.com/b/XXXXX" class="btn btn-primary plan-btn" target="_blank" rel="noopener">Lo quiero</a>
```

### Activar la sección Ebooks

En `index.html`:
1. Quitá el atributo `hidden` de `<section class="section ebooks" id="ebooks" hidden>`.
2. Agregá en el `<nav>` del header: `<a href="#ebooks" class="nav-link">Ebooks</a>`.
3. Reemplazá títulos, textos, precios (`US$XX`) y los `href="#EBOOK_LINK_..."` por los links reales.

---

## Probar en local

Doble clic en `index.html`. (O `npx serve` dentro de la carpeta.)

---

## Subir a GitHub

El repo ya está inicializado y con commits. Para conectarlo con tu cuenta de GitHub:

1. Creá un repositorio **vacío** en <https://github.com/new> llamado `kraken-fitness-web`
   (sin README, sin .gitignore, sin licencia).
2. En la carpeta del proyecto, corré:

```bash
git remote add origin https://github.com/TU_USUARIO/kraken-fitness-web.git
git branch -M main
git push -u origin main
```

Para cambios futuros:

```bash
git add .
git commit -m "Actualizo contenido"
git push
```

---

## Publicar en Vercel

1. Entrá a <https://vercel.com> con tu cuenta de GitHub.
2. **Add New… → Project** → importá `kraken-fitness-web`.
3. Framework Preset: **Other**. Build Command: vacío. Output Directory: vacío. Root Directory: `./`.
4. **Deploy**. Queda online en `https://kraken-fitness-web.vercel.app`.
5. Cada `git push` a `main` redeploya solo.

### Dominio propio (opcional)

Proyecto en Vercel → **Settings → Domains → Add**.
