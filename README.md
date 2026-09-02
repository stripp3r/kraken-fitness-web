# KRAKEN — Sitio Web

Sitio web de una página para la marca personal de fitness **KRAKEN** (hipertrofia natural).
HTML + CSS + JavaScript puro, sin dependencias ni build. Se abre directo en el navegador.

## Estructura

```
NUEVO SITIO WEB/
├── index.html        # Estructura y contenido
├── styles.css        # Estilos (estética oscura / premium)
├── script.js         # Navegación, animaciones y modal de video
├── Kraken icon.png   # Logo de la marca
└── README.md
```

## Secciones

1. **Header** con navegación fija (Inicio, Planes, Sobre Mí, Ejercicios, Contacto) + menú mobile.
2. **Hero** con logo, tagline y botón "Ver Planes".
3. **Planes**: Básico, Intermedio, Avanzado y Mentoría 1:1.
4. **Sobre Mí**: descripción del entrenador y método.
5. **Biblioteca de Ejercicios**: grilla de tarjetas; cada una abre un modal con el video de Google Drive.
6. **Contacto**: WhatsApp, Instagram, Facebook, TikTok, YouTube y email.

---

## Placeholders que tenés que reemplazar

Abrí `index.html` y buscá cada uno:

| Placeholder | Dónde | Qué poner |
|---|---|---|
| `#MERCADOPAGO_LINK_BASICO` | Plan Básico | Link de pago de Mercado Pago |
| `#MERCADOPAGO_LINK_INTERMEDIO` | Plan Intermedio | Link de pago de Mercado Pago |
| `#MERCADOPAGO_LINK_AVANZADO` | Plan Avanzado | Link de pago de Mercado Pago |
| `WHATSAPP_NUMERO` | Mentoría 1:1 y Contacto | Número con código de país sin `+` ni espacios (ej: `5493511234567`) |
| `INSTAGRAM_USUARIO` | Contacto | Usuario de Instagram |
| `FACEBOOK_PAGINA` | Contacto | Nombre/ID de la página de Facebook |
| `TIKTOK_USUARIO` | Contacto | Usuario de TikTok (sin `@`) |
| `YOUTUBE_CANAL` | Contacto | Handle del canal (sin `@`) |
| Precios `$XX.XXX` | Sección Planes | Precio real de cada plan |

### Videos de la biblioteca de ejercicios

Cada tarjeta de ejercicio tiene un atributo `data-video="#"`. Reemplazá el `#` por el link
de Google Drive del video. Sirve cualquiera de estos formatos:

```
https://drive.google.com/file/d/EL_ID_DEL_ARCHIVO/view?usp=sharing
https://drive.google.com/open?id=EL_ID_DEL_ARCHIVO
```

El script lo convierte solo a la URL de reproducción embebida (`/preview`).

> **Importante:** cada video de Drive debe estar compartido como
> **"Cualquier persona con el enlace"** para que se vea en el sitio.
> Nota: Google Drive no siempre respeta el autoplay dentro de un iframe; el video se
> carga listo para reproducir y el usuario aprieta play si el navegador bloquea el autoplay.

---

## Probar en local

No necesitás servidor. Doble clic en `index.html`.
(Opcional, para evitar cualquier tema de rutas: `npx serve` dentro de la carpeta.)

---

## Subir a GitHub

Ya está inicializado el repo con el primer commit. Solo falta conectarlo con GitHub.

### Opción A — con GitHub CLI (`gh`), la más rápida

```bash
gh repo create kraken-web --public --source=. --remote=origin --push
```

### Opción B — manual

1. Entrá a <https://github.com/new> y creá un repo **vacío** llamado `kraken-web`
   (sin README, sin .gitignore, sin licencia).
2. En la carpeta del proyecto, corré:

```bash
git remote add origin https://github.com/TU_USUARIO/kraken-web.git
git branch -M main
git push -u origin main
```

Para futuros cambios:

```bash
git add .
git commit -m "Actualizo contenido"
git push
```

---

## Publicar en Vercel

### Opción A — Dashboard (recomendada)

1. Entrá a <https://vercel.com> e iniciá sesión con tu cuenta de GitHub.
2. **Add New… → Project**.
3. Elegí el repo `kraken-web` → **Import**.
4. Configuración:
   - **Framework Preset:** `Other`
   - **Build Command:** (vacío)
   - **Output Directory:** (vacío / raíz)
   - **Root Directory:** `./`
5. **Deploy**. En ~20 segundos tenés la URL `https://kraken-web.vercel.app`.
6. Cada `git push` a `main` genera un deploy nuevo automáticamente.

### Opción B — Vercel CLI

```bash
npm i -g vercel
vercel          # primer deploy (seguí las preguntas)
vercel --prod   # deploy a producción
```

### Dominio propio (opcional)

En el proyecto de Vercel: **Settings → Domains → Add** y seguí las instrucciones de DNS.

---

## Checklist antes de publicar

- [ ] Reemplacé todos los placeholders de la tabla de arriba
- [ ] Cargué los links de Google Drive de los 6 ejercicios
- [ ] Verifiqué que los videos de Drive están compartidos públicamente
- [ ] Puse los precios reales de los planes
- [ ] Cargué los links de pago de Mercado Pago
- [ ] Probé el sitio en el celular
