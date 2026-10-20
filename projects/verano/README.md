# VÉRANO · Cucina d'Autore (web de demostración)

Web completa para un restaurante italiano contemporáneo **ficticio**. Incluye intro cinematográfica, hero, filosofía, especialidades del chef, carta interactiva con filtros, proceso artesanal, galería arrastrable con vista ampliada, experiencias, reservas por WhatsApp, contacto y footer.

Está hecha con HTML, CSS y JavaScript sin compilación. Usa GSAP 3.15 (ScrollTrigger y SplitText) y las fuentes van alojadas en el propio proyecto, así que funciona sin conexión.

- La secuencia de movimiento completa, con tiempos, disparadores y comportamiento en móvil, está en **[MOTION.md](MOTION.md)**.
- Todo el contenido editable está en **`js/config.js`**.

---

## Cómo abrir el sitio

**Un solo archivo:** `verano-standalone.html` contiene la web completa (estilos, fuentes, GSAP y scripts incrustados, unos 456 KB). Ábrelo con doble clic, envíalo por correo o súbelo tal cual a cualquier hosting; no necesita carpetas ni conexión. Se genera a partir de las fuentes:

```bash
cd projects/verano
python3 tools/build-single.py      # vuelve a generar verano-standalone.html
```

Para cambiar contenido, edita `js/config.js` (o el CSS/JS) y vuelve a generar: no edites `verano-standalone.html` a mano.

**Versión de desarrollo:** doble clic en `index.html`. También funciona directamente desde el disco (`file://`) y sin conexión a internet.

**Opción recomendada** (así se comporta igual que publicado, con precarga de fuentes):

```bash
cd projects/verano
python3 -m http.server 8080        # o: npx http-server -p 8080
# abrir http://localhost:8080
```

La intro solo se muestra **una vez por sesión** y nunca cuando se entra con un ancla (`index.html#carta`). Para volver a verla, abre una pestaña nueva o una ventana privada.

## Estructura

```
projects/verano/
├── index.html          Estructura semántica, metadatos SEO/sociales, intro y secciones
├── css/styles.css      Tokens de marca, superficies claras y oscuras, layout mobile-first
├── js/config.js        ← DATOS EDITABLES: contacto, horarios, reservas, carta, galería, fotos
├── js/app.js           Renderizado desde config.js e interacciones (sin dependencias)
├── js/motion.js        Sistema de movimiento GSAP (intro, hero, revelados, limpieza)
├── vendor/gsap/        GSAP 3.15.0 + ScrollTrigger + SplitText (licencia estándar gratuita de GSAP)
├── fonts/              Cormorant Garamond y Manrope en woff2, subconjunto latino (licencia OFL)
├── favicon.svg
├── tools/build-single.py   Genera la versión de un solo archivo
├── verano-standalone.html  La web completa en un único HTML (generado)
├── MOTION.md           Secuencia de movimiento
└── README.md
```

## Editar el contenido (`js/config.js`)

| Qué | Dónde |
|---|---|
| Avisos de «dato de demostración» | `demoMode` (ponerlo en `false` cuando todo sea real) |
| WhatsApp, teléfono, Instagram | `contact.whatsapp`, `contact.phone`, `contact.instagram` |
| Dirección, enlace a mapas y mapa incrustado | `contact.address` (`isPlaceholder`, `mapsQuery`, `mapEmbedUrl`) |
| Horarios | `contact.hours` y `contact.hoursAreDemo` |
| Reglas de reserva | `reservations`: mínimo y máximo de personas, días de antelación, minutos mínimos para reservar el mismo día, días cerrados, turnos por día |
| Carta | `menu.categories` (orden, textos, foto) y `menu.items` (nombre, descripción, precio en CLP, categoría, `signature`, foto opcional) |
| Especialidades del chef | `specialties`, que referencia platos de la carta (`itemId`), así el nombre y el precio no se duplican |
| Galería | `gallery` (mínimo 8, sin repetir fotos de otras secciones) |
| Experiencias | `experiences` (`confirmed: false` muestra el aviso de «sujeto a confirmación») |
| Fotografías | `images` (ver la sección siguiente) |

Para añadir un plato, copia un objeto de `menu.items`, cambia `id`, `name`, `description`, `price` y `category`, y aparecerá en su pestaña con el contador actualizado.

## Fotografías: por qué hay marcadores de posición

El entorno donde se construyó la web tenía bloqueados los bancos de imágenes (Unsplash, Pexels, Wikimedia y otros) y los CDN. Por eso **no se pudo descargar ni verificar ninguna URL de fotografía**. En lugar de inventar rutas, cada hueco muestra un **marcador diseñado**: un estudio de color con los tonos del plato, grano fotográfico y la indicación de dirección de arte («Ravioli, mantequilla y salvia · cenital · vertical 4:5»). No se hace ninguna petición de red mientras `src` esté vacío.

Para poner las fotos:

1. Crea la carpeta `img/` y guarda ahí los archivos (WebP o AVIF; JPEG como alternativa).
2. Rellena `src` (y, si quieres un encuadre vertical para móvil en el hero, `srcMobile`), además de `alt`, `width`/`height` reales y `position` si hace falta ajustar el encuadre.
3. Si una URL externa falla, el sitio vuelve solo al marcador y no queda ningún hueco roto.

| Hueco (`images.*`) | Formato | Tamaño sugerido | Contenido |
|---|---|---|---|
| `hero` (+ `srcMobile`) | 16:9 (+ 4:5) | 2400 × 1350 (+ 1080 × 1350) | Pasta fresca estirada a mano, contraluz cálido |
| `philosophy` | 3:4 | 1200 × 1600 | Ingredientes sobre mármol |
| `sp-ravioli`, `sp-burrata`, `sp-tiramisu` | 4:5, 3:2 y 1:1 | 1200–1500 px | Los tres platos protagonistas |
| `cat-*` (6) | 4:5 | 1200 × 1500 | Una por categoría de la carta |
| `process-main`, `process-detail` | 3:4 y 1:1 | 1200 × 1600 y 900 × 900 | Corte a cuchillo y volcán de harina |
| `exp-*` (3) | 4:5 | 1200 × 1500 | Cena para dos, mesa larga, chef emplatando |
| `gallery[*].src` (10) | 4:5, 3:2 y 1:1 según `layout` | 1200–1600 px | Plato, ingredientes, preparación, interior, barra, mesa, arquitectura, postre, vino, cocina |
| `menu.items[*].image` | 1:1 | 400 × 400 | Opcional: si existe, el plato muestra miniatura |

Cuando el hero tenga foto real, conviene añadir en `<head>` la línea `<link rel="preload" as="image" href="img/hero.webp" fetchpriority="high">` para mejorar el LCP.

## Datos pendientes antes de publicar

- [ ] **Número de WhatsApp**: `contact.whatsapp.number` (solo dígitos, con código de país), `display` e `isPlaceholder: false`. Hoy apunta a `56900000000`, que es de demostración.
- [ ] **Teléfono**: `contact.phone`.
- [ ] **Dirección**: `contact.address` con `isPlaceholder: false`. Así se activa el botón «Cómo llegar». Añade `mapEmbedUrl` solo si la ubicación está verificada.
- [ ] **Horarios**: `contact.hours` y `hoursAreDemo: false`. Ajusta también `reservations.timeSlots`, `closedWeekdays` y `servicesByWeekday`.
- [ ] **Instagram**: `contact.instagram.handle` y `url`.
- [ ] **Carta definitiva**: `menu.items` (nombres y descripciones).
- [ ] **Precios reales** en CLP: `menu.items[*].price`.
- [ ] **Imágenes con licencia apropiada**: todos los huecos de `images`, `gallery` y, si se quiere, las miniaturas de la carta.
- [ ] **Experiencias**: confirmar que existen y poner `experiences.confirmed: true`.
- [ ] **Alérgenos**: la nota remite al restaurante. No añadas información de alérgenos sin validarla.
- [ ] `demoMode: false` y revisar el texto legal del footer (`index.html`, «Marca ficticia…»).
- [ ] **Metadatos**: `og:url`, `og:image` (1200 × 630, URL absoluta) y `<link rel="canonical">` con el dominio final. Completar el JSON-LD `Restaurant` con dirección, teléfono y horarios reales.
- [ ] Si se añade analítica o se guardan datos, publicar una política de privacidad. Hoy el formulario no guarda nada: solo compone el texto en el navegador.

## Decisiones técnicas

- **Sin compilación.** Son scripts clásicos (no módulos), así que también funciona desde `file://`. Al no haber `fetch` de JSON, la configuración vive en un `.js`.
- **GSAP solo donde hace falta secuenciar:** intro, hero, revelados, carta y menú móvil. Los estados simples (hover, foco, botones, navegación sólida u oculta, botón flotante, lightbox) van en CSS.
- **Lenis no se usa.** El scroll nativo es más fluido en Android, respeta las anclas con `scroll-padding`, el teclado, los lectores de pantalla y el gesto de desplazamiento del sistema. Además, la experiencia no necesita *scroll-jacking*.
- **Rendimiento:**
  - Las animaciones de cada sección se construyen justo antes de que llegue (inicialización de unos 8 ms con CPU ×4, frente a unos 410 ms si se construía todo al cargar).
  - Solo se animan `transform` y `opacity`, más `clip-path` puntual que se limpia al terminar.
  - Las lecturas de layout van agrupadas en `requestAnimationFrame`.
  - Los huecos de imagen reservan espacio con `aspect-ratio` (CLS medido: 0,009).
  - Fuentes woff2 autoalojadas con `font-display: swap` y precarga de las dos principales.
  - Imágenes con `loading="lazy"` fuera de pantalla y `fetchpriority="high"` en el hero.
- **Accesibilidad:**
  - HTML semántico (un `h1`, `h2` por sección, `h3`/`h4` en tarjetas y platos) y enlace «Saltar al contenido».
  - Foco visible en todos los controles y pestañas ARIA con flechas, Inicio y Fin.
  - Menú móvil con `aria-expanded`, `inert` y Esc. Galería operable por teclado y lightbox en `<dialog>`.
  - Formulario con etiquetas visibles, errores junto al campo, `aria-invalid` y resumen enfocado.
  - Contraste AA verificado: se derivaron tonos de oliva, dorado y gris para texto pequeño sobre marfil, porque los originales no llegan a 4,5:1.
  - Soporte de `prefers-reduced-motion` y `forced-colors`.

## Pruebas realizadas

Se ejecutaron el 20/10/2026 en **Chromium 141 (headless, Playwright)**, abriendo el sitio desde `file://` y también por `http://`.

**37 de 37 comprobaciones automáticas superadas y consola sin errores ni avisos.** Incluyen:

- La intro se muestra, se puede omitir, no se repite en la sesión y no aparece con enlaces con ancla.
- Los enlaces de la navegación (Carta, Filosofía, Experiencia, Contacto, Reservar) llevan a su sección. La navegación se oculta al bajar y reaparece al subir.
- El menú móvil abre y cierra con foco, `inert`, Esc y bloqueo del scroll, y sus enlaces navegan.
- Los filtros de la carta muestran las 6 categorías (≥ 4 platos cada una) y un único panel visible. Funcionan con teclado y con clics rápidos sin estados rotos.
- Formulario vacío e inválido (nombre, teléfono, fecha pasada, personas por encima del máximo): muestra errores y no abre WhatsApp.
- Formulario válido: estado de carga y apertura de `https://wa.me/56900000000?text=…` con el mensaje estructurado y bien codificado (tildes, `&`, `#`, `?`). Después, el panel que pide enviar el mensaje y esperar la confirmación.
- Galería: botones, teclado, arrastre con ratón (sin abrir la vista ampliada) y vista ampliada con flechas, Esc y devolución del foco.
- `init()` repetido no duplica animaciones y `destroy()` limpia todo. Al cruzar el breakpoint a mitad de página (giro de tablet) no se pierde la posición ni queda contenido oculto.
- Movimiento reducido: sin ScrollTriggers, todo el contenido visible y filtros instantáneos.
- 320 px sin desplazamiento horizontal, ningún enlace interno roto y ninguna imagen rota.
- Revisión visual por capturas en 1440, 390, 360 y 320 px.

**Rendimiento aproximado** (390 px, CPU ×4, sin GPU, es decir, más pesimista que un teléfono real): scroll a unos 41 fps de media durante el recorrido completo, CLS de 0,009 y una inicialización del movimiento de unos 8 ms.

**No probado** (requiere dispositivos o servicios reales): Safari/iOS, Firefox, un Android físico, lectores de pantalla (VoiceOver, TalkBack), la apertura real de la app de WhatsApp (solo se verificó la URL generada) y fotografías reales.

## Publicar

Es un sitio estático: basta con subir la carpeta a Netlify, Vercel, Cloudflare Pages, GitHub Pages o cualquier hosting con HTTPS. Conviene servir `fonts/` y `vendor/` con caché larga.
