# KRAKEN FITNESS — Sitio Web

Sitio de una página para la marca de fitness **KRAKEN FITNESS** (hipertrofia natural).
HTML + CSS + JavaScript puro, sin build. Se abre directo en el navegador.

## Estructura

```
NUEVO SITIO WEB/
├── index.html          # Estructura y contenido
├── styles.css          # Estilos (estética oscura / premium)
├── script.js           # Navegación, animaciones y modal de video
├── Kraken icon.png      # Logo
├── img/
│   ├── hero.jpg         # Foto del Hero (byn)
│   └── sobre-mi.jpg     # Foto de Sobre Mí (byn)
├── Fotos sitio web/     # Fotos originales (no se publican, quedan de respaldo)
└── README.md
```

## Secciones

1. **Header** — nav fija (Inicio, Planes, Sobre Mí, Ejercicios, Contacto) + menú mobile.
2. **Hero** — título, tagline, botón "Ver Planes" y foto.
3. **Planes**
   - Autoguiados: **KRAKEN Antiflaco** (destacado), **Grasa Cero**, **Híbrido** — US$25 pago único c/u.
   - Con acompañamiento: **Mentoría Basic** (US$39 + US$25/mes) y **Mentoría VIP** (US$149 + US$100/mes).
4. **Ebooks** — sección oculta, lista para activar (ver abajo).
5. **Sobre Mí** — foto + descripción.
6. **Biblioteca de Ejercicios** — grilla; cada tarjeta abre un modal con el video de Google Drive.
7. **Contacto** — WhatsApp, Instagram, Facebook, TikTok, YouTube, email.

---

## Estado actual: qué funciona y qué falta

| Elemento | Estado |
|---|---|
| Redes y WhatsApp | ✅ Cargados (WhatsApp `5493413441070`, IG/FB/TikTok/YT reales) |
| Fotos | ✅ Cargadas (byn) |
| Precios de planes | ✅ Cargados |
| Botones de compra de los planes | ⏳ Van a **WhatsApp** por ahora (venta manual). Falta cambiarlos por links de pago |
| Videos de ejercicios | ⏳ Placeholder (`data-video="#"`). Falta cargar links de Google Drive |
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

### Cargar los videos de ejercicios

Cada tarjeta tiene `data-video="#"`. Reemplazá el `#` por el link de Google Drive
(`https://drive.google.com/file/d/EL_ID/view?usp=sharing`). El script lo convierte solo
a la URL de reproducción. Cada video debe estar compartido como **"Cualquier persona con el enlace"**.

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
