# VÉRANO: secuencia de movimiento

La secuencia completa, de la primera carga al footer. Para cada momento se indican los tiempos, la transición, el disparador y el comportamiento en móvil. La implementación está en `js/motion.js` (GSAP 3.15 con ScrollTrigger y SplitText) y en `css/styles.css` (microinteracciones).

## Principios

1. **Cada movimiento revela algo.** No hay ninguna animación decorativa en bucle. La única excepción es el indicador de scroll, que se pausa cuando sale de pantalla y queda estático con movimiento reducido.
2. **Entradas lentas, salidas rápidas.** Las entradas duran entre 0,8 y 1,3 s (`expo.out`) y las salidas entre 0,2 y 0,45 s (`power2.in`).
3. **Una sola vez.** Ningún revelado se repite al volver a subir.
4. **Solo `transform` y `opacity`.** Hay dos excepciones puntuales: `clip-path` en las máscaras de imagen (una vez por imagen, con limpieza al terminar) y `height` en el cambio de categoría de la carta (una vez por clic, nunca ligado al scroll).
5. **Scroll nativo.** No hay Lenis, *pin* ni *scroll-jacking*. Las anclas, el teclado, los lectores de pantalla y el gesto de desplazamiento de Android funcionan como en cualquier web.
6. **El contenido nunca depende de la animación.** Sin JavaScript, sin GSAP o con movimiento reducido, todo queda visible desde el primer pintado.

## Curvas y duraciones

| Token | Curva | Uso |
|---|---|---|
| `reveal` | `expo.out` | Titulares por líneas, máscaras, intro, menú móvil |
| `soft` | `power3.out` | Textos secundarios, apariciones |
| `wipe` | `power4.inOut` | Máscaras de fotografía (`clip-path`) |
| `curtain` | `expo.inOut` | Telón de la intro y ranura del proceso |
| `exit` | `power2.in` | Salidas, siempre más cortas que la entrada |
| CSS `--ease-out` | `cubic-bezier(.16,1,.3,1)` | Botones, enlaces, navegación |

| Duración | Uso |
|---|---|
| 0,2 s | Estados de campo, foco, color |
| 0,45 a 0,55 s | Navegación, indicador de la carta, botón flotante |
| 0,8 a 1,15 s | Revelados de texto |
| 1,3 a 1,8 s | Máscaras de imagen y escala interior |
| 2,8 s | Escalado lento del fondo del hero |

---

## 0 · Antes del primer pintado (0 ms)

Un script en línea en `<head>`:

- Añade `.motion` si el usuario no pide movimiento reducido.
- Añade `.has-intro` si es la primera visita de la sesión **y** la URL no lleva `#ancla`.
- Arma una **red de seguridad de 3,5 s**: si el sistema de movimiento no arranca, quita esas clases y todo queda visible.

El CSS deja ocultos de antemano solo los elementos de la intro y del hero, para evitar un parpadeo antes de que llegue el JS.

## 1 · Intro (0 a 2,35 s)

Solo aparece en la primera visita de cada sesión (`sessionStorage`). No se repite al recargar ni con enlaces internos.

| t (s) | Elemento | Transición | Curva |
|---|---|---|---|
| 0,10 → 1,20 | Letras **V É R A N O** | `yPercent 115 → 0` dentro de su máscara, escalonado 0,05 | `expo.out` |
| 0,25 → 0,65 | «Omitir intro» | `opacity 0 → 1` | lineal |
| 0,45 → 1,20 | Línea dorada | `scaleX 0 → 1` desde el centro | `power3.inOut` |
| 0,80 → 1,40 | CUCINA D'AUTORE | `opacity 0 → 1`, `y 10 → 0` | `power3.out` |
| **1,35 → 2,35** | **Telón** | el panel sube (`yPercent 0 → -100`) mientras su contenido baja y se funde (`yPercent 0 → 40`, `opacity → 0`); el hero aparece detrás, como a través de una máscara | `expo.inOut` |
| 1,47 | Hero | arranca su línea de tiempo bajo el telón | — |

- **Omitir:** el botón, cualquier tecla salvo Tab, la rueda del ratón, un toque o un clic saltan al telón y lo aceleran ×2,4. El sitio queda disponible en unos 0,4 s.
- **Móvil:** mismos tiempos. El logotipo escala con `clamp()` y el botón «Omitir» respeta el área segura.
- **Movimiento reducido:** el logotipo y la línea aparecen estáticos y la capa se funde en 0,45 s tras 0,7 s.

## 2 · Hero

El tiempo t0 corresponde al inicio del telón o, sin intro, a la carga de las fuentes (como máximo 500 ms).

| t0 + (s) | Elemento | Transición | Curva |
|---|---|---|---|
| 0,00 → 2,80 | Imagen de fondo | `scale 1.16 → 1` (escalado lento) | `power2.out` |
| 0,20 → 1,10 | VÉRANO — CUCINA D'AUTORE | `opacity`, `y 14 → 0` | `expo.out` |
| 0,30 → ≈1,8 | Titular «Italia, servida con otra mirada» | por líneas: `yPercent 112 → 0`, escalonado 0,12. Al terminar se deshace el split y el texto vuelve a ser fluido | `expo.out` |
| 0,45 → 1,35 | Navegación | `opacity`, `y -18 → 0` | `expo.out` |
| 0,80 → 1,80 | Texto | `opacity`, `y 18 → 0` | `power3.out` |
| 1,00 → 1,90 | Botones | `opacity`, `y 18 → 0`, escalonado 0,10 | `power3.out` |
| 1,50 → 2,30 | Indicador de scroll | `opacity`; después, un punto que recorre la línea en un ciclo CSS de 2,2 s | — |

**Ligado al scroll** (`scrub`, desde *top top* hasta *bottom top* del hero):

- La imagen hace `yPercent 0 → 12`, que equivale a un parallax moderado. En móvil: 6.
- El texto hace `y 0 → -70` y `opacity 1 → 0,25`. En móvil: -30.

**Móvil:** el indicador de scroll se oculta por debajo de 600 px, los botones ocupan todo el ancho y el hero mide `100svh` (la altura real, sin saltos cuando aparece o desaparece la barra del navegador).

## 3 · Navegación (siempre activa)

- **Transparente → sólida** al salir del hero: fondo carbón al 96 %, en 0,45 s por CSS.
- **Se oculta al bajar y reaparece al subir** (umbral de 6 px por fotograma), con `transform` en 0,55 s. Nunca se oculta con el menú abierto ni con el foco dentro.
- La barra de categorías de la carta se coloca bajo la navegación cuando esta es visible y en el borde superior cuando no lo es.
- **Enlace activo:** subrayado dorado que crece de izquierda a derecha (0,5 s) según la sección visible.

**Menú móvil**

| Acción | Secuencia |
|---|---|
| Abrir (0,75 s) | panel `yPercent -100 → 0` (`expo.out`); enlaces `yPercent 110 → 0`, escalonado 0,06, desde 0,15 s; pie desde 0,35 s |
| Cerrar (≈0,55 s) | enlaces salen hacia arriba (0,22 s), panel `yPercent → -100` (0,45 s, `power3.in`) |
| Teclado | Esc cierra y devuelve el foco al botón. El resto de la página queda `inert` y el scroll bloqueado |

## 4 · Filosofía (Olfatto)

| Disparador | Elemento | Transición |
|---|---|---|
| `top 84%` | Foto vertical | máscara `inset(100% 0 0 0) → inset(0)` 1,3 s (`power4.inOut`) + escala interior `1.22 → 1` 1,8 s |
| `top 92%` | Sello de marca | `scale 0.8 → 1` y `opacity`; además **gira con el scroll** (−25° → 70°) mientras la sección cruza la pantalla. No gira por su cuenta |
| `top 90%` | Etiqueta | `opacity`, `y 16 → 0` |
| `top 86%` | Titular | por líneas, `yPercent 110 → 0`, 1,15 s, escalonado 0,10 |
| `top 88%` | Entradilla | por líneas, `yPercent 100 → 0` + `opacity`, escalonado 0,08 |
| `top 88%` | Cuerpo | párrafos escalonados 0,10 |
| `top 86%` de la fila | Principios | desde la izquierda (`x -48`), desde abajo (`y 48`) y desde la derecha (`x 48`), con un desfase de 0,12 s |
| `top 92%` | Líneas de los principios | `scaleX 0 → 1` desde la izquierda, 1,4 s |

**Móvil:** el texto va antes que la foto. Los desplazamientos horizontales se reducen a la mitad y cada principio tiene su propio disparador (en móvil van apilados).

## 5 · Especialidades del chef (Gusto)

- **Foto de cada plato:** máscara de 1,3 s. El 01 y el 03 se revelan desde abajo y el 02 desde la derecha, para variar el ritmo.
- **Texto** (`top 72%`): número, categoría, nombre, descripción, nota y precio, escalonados 0,08 (0,9 s).
- **Escritorio:** el bloque de texto se desplaza `y 70 → -70` ligado al scroll (`scrub 0.8`). Es el «movimiento de texto controlado por scroll».
- **Hover** (solo con puntero fino): la imagen pasa a `scale 1.045` en 1,2 s.
- **Móvil:** sin *scrub* ni hover. El plato 02 ocupa todo el ancho y el 03 queda desplazado a la derecha.

## 6 · Carta interactiva

- **Entrada** (`top 82%` / `top 90%`): las pestañas se escalonan cada 0,05 s. En el primer panel, la foto entra con máscara (1,2 s), después los textos (0,8 s, escalonados 0,08) y por último los platos (0,7 s, escalonados 0,06).
- **Cambio de categoría** (clic, toque, ←/→, Inicio, Fin):

| t (s) | Paso |
|---|---|
| 0,00 → ≈0,30 | salen los platos actuales (`opacity → 0`, `y -10`, `power2.in`, escalonado 0,01) |
| ≈0,30 | intercambio de panel |
| 0,30 → 0,80 | el contenedor anima su altura de h0 a h1 **una vez**, sin saltos bruscos de lo que viene después |
| 0,30 → 1,20 | la foto de la categoría entra con máscara |
| 0,35 → 1,02 | título y descripción, escalonados 0,06 |
| 0,40 → 1,13 | platos, escalonados 0,045 |
| fin | `ScrollTrigger.refresh()`, nunca a mitad de la animación |

- El indicador bajo la pestaña activa se desliza con `transform` (0,55 s).
- **Clics rápidos:** la transición anterior se completa al instante antes de empezar la nueva, y el estado final siempre es consistente (verificado).
- **Móvil:** la fila de pestañas se desplaza en horizontal con un fundido que indica que hay más. Si el usuario estaba abajo en una lista larga, vuelve al inicio del panel.
- **Movimiento reducido:** el cambio es instantáneo.

## 7 · Proceso artesanal (Tatto)

| Disparador | Elemento | Transición |
|---|---|---|
| `top 80%` | Foto vertical | **clip-path desde una ranura** `inset(46% 6%) → inset(0)`, 1,5 s (`expo.inOut`) + escala `1.3 → 1`, 2 s |
| misma línea de tiempo, 1,10 / 1,26 / 1,42 s | Etiquetas «Sfoglia a mano», «Corte a cuchillo», «Cocción al momento» | `opacity`, `y 12 → 0`, sincronizadas con la apertura |
| `top 84%` | Foto de detalle | máscara desde la derecha |
| scroll | Foto vertical | parallax `yPercent ±6` (`scrub 0.6`) |
| `top 86%` | Entradilla | **desde el lateral** (`x 56`) |
| `top 88%` (cada uno) | Pasos 01–04 | `x 40 → 0` + `opacity` |
| scroll | Línea de progreso | `scaleY 0 → 1` entre `top 72%` y `bottom 62%`, sincronizada con los pasos |
| scroll (escritorio) | **Transición a la galería** | el contenido se retira (`y -50`, `opacity 0,45`) desde `bottom 65%` hasta `bottom top` |

**Móvil:** la foto va primero, los pasos suben (`y 20`) en vez de entrar de lado, el parallax baja a ±3 % y no hay retirada.

## 8 · Galería (Vista)

- **Entrada** (`top 86%`): las cuatro primeras piezas entran de lado (`x 140 → 0`; en móvil, 60), 1,3 s, escalonadas 0,09.
- **Carrusel nativo** con `scroll-snap`. Funciona con los botones anterior y siguiente (desplazamiento suave), con el teclado (←/→/Inicio/Fin con la región enfocada), arrastrando con el ratón y con el gesto táctil nativo.
- **Indicador:** número y barra dorada (`scaleX`, 0,4 s). Los lectores de pantalla oyen la posición cuando termina el desplazamiento.
- **Hover:** escala 1,04 (1,1 s) y aparece el icono de ampliar. En táctil el icono es siempre visible.
- **Vista ampliada** (`<dialog>`): fundido de 0,45 s. Se navega con ←/→ o deslizando, se cierra con Esc o tocando fuera, y el foco vuelve a la miniatura.

## 9 · Experiencias (Udito)

- **Imagen:** máscara con una **transición de filtro** de `grayscale(1) brightness(.72)` a color en 1,6 s, una sola vez.
- **Texto:** escalonado 0,07. En escritorio, cada columna se desfasa 0,12 s.
- **Hover/foco** (puntero fino): saturación de 0,6 a 1 y escala 1,04. En táctil las fotos se ven siempre a color.
- **Enlaces:** el subrayado se contrae al 35 % y la flecha avanza 5 px.

## 10 · Reservas

- Titular por líneas, pasos escalonados y campos del formulario escalonados 0,07. Se usa `opacity`, nunca `visibility`, para que el tabulado no se salte campos todavía no revelados.
- **Microinteracciones:**
  - Foco dorado en 0,2 s.
  - Error en terracota con resumen enfocado.
  - Los botones − y + del selector de personas hacen `scale .96` al pulsarse.
  - Envío: estado de carga (spinner y «Preparando tu mensaje…»), se abre WhatsApp y, unos 650 ms después, aparece el panel de confirmación con el foco puesto en él.

## 11 · Contacto, footer y botón flotante

- **Contacto:** titular por líneas y bloques que aparecen con un fundido.
- **Footer:** el logotipo sube (`yPercent 30 → 0`, 1,3 s) y la línea dorada se dibuja (1,4 s).
- **WhatsApp flotante:** aparece al dejar el hero (`opacity` + `translateY(1rem) scale(.92) → none`, 0,45 s). Se oculta sobre reservas, contacto y footer, y con el menú, el lightbox o la intro abiertos. Respeta `env(safe-area-inset-*)`.

## Estados de botón (CSS)

| Estado | Comportamiento |
|---|---|
| normal | color base |
| hover (solo puntero fino) | un relleno barre de izquierda a derecha (0,55 s) y la flecha avanza 4 px |
| focus-visible | igual que hover, más un contorno de 2 px con separación de 3 px |
| active | `scale(.98)` |
| disabled | `opacity .45`, sin relleno, `cursor: not-allowed` |

## Resumen móvil frente a escritorio

| Elemento | Escritorio (≥ 900 px) | Móvil (< 900 px) |
|---|---|---|
| Parallax del hero | 12 % | 6 % |
| Texto de especialidades ligado al scroll | sí | no |
| Hover (escala y filtro) | sí | no (sin dependencias de hover) |
| Parallax del proceso | ±6 %, `scrub 0.6` | ±3 %, `scrub` directo |
| Retirada del proceso | sí | no |
| Desplazamientos laterales | 40 a 56 px | la mitad, o vertical |
| ScrollTriggers tras recorrer la página | 68 (9 con scrub) | 64 (5 con scrub) |
| Navegación | enlaces visibles | menú desplegable a pantalla completa |

## Movimiento reducido (`prefers-reduced-motion: reduce`)

- La intro es estática y se funde en 0,45 s.
- No hay revelados, parallax, *scrub* ni scroll suave.
- La carta y el menú móvil cambian al instante.
- El indicador de scroll queda estático.
- Las transiciones CSS duran 0,01 ms.
- Todo el contenido es visible y todas las funciones siguen activas (verificado).
- Si la preferencia cambia con la página abierta, el sistema se reconstruye solo.

## Arquitectura y limpieza

- `VERANO.motion.init()` es idempotente: destruye antes de crear. `VERANO.motion.destroy()` revierte animaciones, ScrollTriggers y SplitText.
- Todo vive dentro de `gsap.matchMedia()`. Al cruzar el breakpoint (por ejemplo, al girar una tablet) se reconstruye y **vuelve al mismo punto de lectura**. ScrollTrigger, por sí solo, devolvía la página al inicio.
- **Construcción diferida:** al cargar solo existen los disparadores del hero (15). Cada sección construye los suyos con un viewport de antelación, mediante `IntersectionObserver` dentro del mismo contexto, así que la limpieza sigue siendo total. Con CPU ×4, la inicialización bajó de unos 410 ms a unos 8 ms.
- **«Asentamiento»:** si una sección se construye con la página ya desplazada (enlace profundo, recarga o giro), lo que ya quedó atrás pasa a su estado final sin animar y lo visible se anima.
- Los revelados usan `toggleActions: 'play none play none'` en vez de `once: true`. Los `once` se autodestruyen durante un `refresh()` y rompían la reconstrucción a mitad de página.
- Las máscaras de SplitText son `inline-block` con holgura para tildes y descendentes, y no cambian la altura del texto al dividirlo (medido: 0 px).

## Cómo reutilizar (atributos)

```html
<h2 data-split="heading">…</h2>             <!-- titular por líneas -->
<p  data-split="lines">…</p>                <!-- párrafo por líneas -->
<p  data-reveal="fade">…</p>                <!-- aparición -->
<div data-reveal="stagger">…hijos…</div>    <!-- hijos escalonados -->
<li data-reveal="from-left|from-right|from-bottom|from-side">
<span data-reveal="draw"></span>            <!-- línea que se dibuja -->
<div class="frame" data-reveal="mask" data-reveal-dir="up|left|right">
<div class="frame" data-reveal="clip">      <!-- apertura desde ranura -->
<div class="frame__inner" data-parallax="6"> <!-- parallax ±6 % -->
```
