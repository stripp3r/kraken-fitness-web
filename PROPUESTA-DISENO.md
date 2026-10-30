# Propuesta de diseño — KRAKEN FITNESS

Rama: `rediseno-opus` · **Actualización 2026-10-30:** P1 aplicada. P2 y P3 quedaron reemplazadas por el rediseño estilo digital que pidió el dueño (ver `BITACORA-PROYECTO.md`, sección 6.unvicies).

Se mantiene el carácter actual (negro, blanco, tipografía condensada, sobrio). No se toca copy, precios, enlaces de pago/WhatsApp/app, la barra legal, el formulario de arrepentimiento/baja, `vercel.json`, ni la estructura aprobada del inicio. No se agregan colores nuevos ni recursos externos.

## Lo que vi (celular 390 px, inicio)
- Sin desborde horizontal; el hero se ve bien y tiene buena foto.
- Los títulos de bloque ("Planes autoguiados", "Con acompañamiento") son chicos, grises y en mayúsculas de texto: el sitio usa Bebas Neue para el hero pero **la jerarquía se pierde después**, y las secciones se leen todas con el mismo peso.
- El botón "Instalar app" es el único elemento con tinte verde (borde y ícono); el resto del sitio es blanco/negro/gris. Desentona con la paleta (regla: evitar verde menta).
- `styles.css` tiene 2.153 líneas, apendadas por tandas, con reglas repetidas y sobrescritas.

## Prioridades

### P1 — Arreglos chicos y obvios (los hago directo, un commit cada uno)
1. **Tokens de espaciado y tamaño**: definir en `:root` una escala (`--space-*`, `--fs-*`) y usarla donde hoy hay valores sueltos, para que ritmo vertical y alineaciones sean iguales en todas las páginas.
2. **Foco visible y áreas táctiles**: mínimo 44 px en botones, acordeones y menú; anillo de foco consistente.
3. **Alineaciones/tamaños inconsistentes** que encuentre al recorrer las páginas ES y EN a 390 y 1280 px.
4. **Consistencia ES/EN**: toda mejora se replica a mano en `/en/`.

### P2 — Cambios medianos (pido OK antes)
1. **Jerarquía de secciones**: títulos de bloque en Bebas Neue, más grandes, con una línea fina de marca y número/eyebrow discreto; subtítulo con ancho de lectura cómodo. Mismo componente en inicio, planes, mentorías y app.
2. **Acordeones de planes**: más aire, contraste del título, transición suave de apertura (respetando `prefers-reduced-motion`), indicador +/− más claro.
3. **Tarjetas de mentoría (Basic / VIP)**: misma altura y alineación del botón abajo; el dorado queda solo en VIP.
4. **Botón "Instalar app"**: pasarlo a la paleta neutra (blanco/gris, ícono blanco) para coherencia. *Es un cambio de color visible: pregunto antes.*
5. **Header**: separar mejor wordmark / navegación / selector ES-EN; menú móvil con transición más prolija.
6. **Fotos**: tratamiento uniforme (blanco y negro, mismo borde/gradiente a negro) en hero, "Sobre mí" y heroes de planes.

### P3 — Orden y rendimiento (sin cambio visual)
1. **Consolidar `styles.css`**: ordenar por componentes (base → layout → componentes → páginas → utilidades), eliminar reglas duplicadas. Comparación de capturas antes/después en cada página para no romper nada. Se hace en commits chicos.
2. Imágenes con `width`/`height` y `loading="lazy"` donde falte (evita saltos de layout); revisar pesos de `hero.jpg`, `sobre-mi.jpg`, `link-bg.jpg`.
3. Revisar que `script.js` no dispare trabajo innecesario en scroll (usar `IntersectionObserver`/`passive`).

## Qué cambiaría por página
| Página | Cambios |
|---|---|
| `index` / `en/index` | Jerarquía de títulos, acordeones, tarjetas de mentoría, botón "Instalar app", ritmo vertical, "Sobre mí" |
| `app` / `en/app` | Mismo componente de títulos, tarjetas Golden alineadas, video a todo el ancho en celular (se conserva), pasos de instalación |
| `planes/*` (3) y EN | Hero uniforme, bloques "qué incluye"/FAQ con el mismo estilo, botones de pago alineados (colores de MP y PayPal intactos) |
| `mentorias/*` y EN | Listas (`steps-list`, `includes-list`) pulidas, dorado solo en VIP |
| `link/` | Solo ajustes de alineación y táctil; sin cambios de contenido |
| Legales, `404` | Solo tipografía/espaciado de lectura; contenido intacto |

## Cómo voy a trabajar
- Un commit por cambio, en `rediseno-opus`; push solo a esa rama (link de prueba en Vercel).
- Antes de cada push: todas las páginas ES/EN a 390 y 1280 px, sin desbordes ni superposiciones (WhatsApp, "volver arriba", barra legal), menú, idioma, acordeones, "Leer más", links de pago, video, consola sin errores/CSP.

## Dudas de contenido detectadas (no las resolví)
- La bitácora dice que el botón "Instalar app" del hero tenía acento verde apagado a propósito; pregunto antes de neutralizarlo.
- La página de Anti-Flakardo mantiene el título "KRAKEN Anti-Flakardo" mientras el inicio dice "Anti-Flakardo" (el dueño lo decidió así; lo dejo).

## Qué necesito de vos
Aprobar o ajustar P1–P3 (en especial los puntos P2.4 y P2.1). Aplico P1 de inmediato; P2 y P3 después de tu OK.
