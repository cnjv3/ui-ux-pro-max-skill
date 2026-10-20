# CREMA & GRANO · Sitio web de la cafetería

> «Un pequeño momento, una gran taza».

Sitio de una sola página en HTML, CSS y JavaScript, sin dependencias ni paso de compilación. La única
dependencia externa son las tipografías de Google Fonts. Funciona abriendo `index.html` directamente o
desde cualquier hosting estático.

**Estado: demostración.** Productos, precios, equipo, horario y promociones son **datos de ejemplo**,
marcados como tales en el sitio. Dirección, WhatsApp, Instagram, correo y formularios están **sin
configurar**: el sitio lo indica y no inventa nada. Revisa la [lista antes de publicar](#antes-de-publicar).

## Qué incluye

| Sección | Qué hace |
| --- | --- |
| Inicio | Logotipo que sube desde una línea, tazita que se asoma detrás del logotipo, eslogan, «Explorar menú», «Encuéntranos» y estado «Abierto ahora» según el horario. |
| Menú | 7 categorías en pestañas (teclado incluido), tarjetas con foto, descripción, precio y botón «Pedir». La tazita reacciona a cada categoría. |
| Precios | Lista completa con precios, combos de desayuno (calcula cuánto se ahorra) y promociones. |
| ¿Quiénes somos? | Texto conceptual editable y fotografías de café, granos y ambiente. |
| Nuestro equipo | Tarjetas de perfil reemplazables, con retrato provisional mientras no haya fotos. |
| Ubicación | Dirección, mapa (aparece al configurar la dirección), horario con el día de hoy destacado, «Cómo llegar» y Google Maps. |
| Reservas | Formulario validado (nombre, contacto, fecha, hora según el horario, personas, comentarios). |
| Contáctanos | WhatsApp, Instagram, correo, teléfono, dirección, horario y formulario de contacto. |
| Pie de página | Logotipo, tazita, eslogan, enlaces, redes, contacto y créditos de las fotos. |

## Estructura

```
crema-y-grano/
├── index.html
├── README.md                ← este archivo
├── CREDITOS.md              ← autoría y licencia de cada foto
└── assets/
    ├── css/styles.css       ← estilos; colores de la marca al inicio, como variables CSS
    ├── js/config.js         ← DATOS DEL NEGOCIO (contacto, dirección, horario, formularios, mascota)
    ├── js/datos-menu.js     ← CARTA, PRECIOS, COMBOS Y PROMOCIONES
    ├── js/datos-equipo.js   ← EQUIPO
    ├── js/creditos.js       ← créditos de las fotos (los muestra el pie de página)
    ├── js/mascota.js        ← animaciones de la tazita
    ├── js/app.js            ← carta, pestañas, formularios, navegación
    └── img/
        ├── mascota/         ← tazita.png (mascota), tazita-provisional.svg, favicon.svg
        ├── menu/            ← una foto por producto (720 × 540 px, .webp)
        ├── nosotros/        ← fotos de «¿Quiénes somos?»
        └── equipo/          ← aquí van las fotos del equipo
```

## Probarlo

- Doble clic en `index.html`, o
- desde esta carpeta: `python3 -m http.server 8000` y abre <http://localhost:8000>.

Para ver la capa del café marcada sobre la mascota, agrega `#ajustar-mascota` al final de la URL.

## Editar el contenido

Todo se edita en archivos de datos; no hace falta tocar el HTML.

### Datos del negocio · `assets/js/config.js`

- `contacto`: `whatsapp` (solo números con código de país, p. ej. `56912345678`), `instagram` (sin @),
  `email`, `telefono`. Al completarlos se activan los botones de WhatsApp, Instagram y correo, y el
  botón «Pedir» de cada producto, que abre WhatsApp con el producto ya escrito.
- `ubicacion`: con `direccion` (y `comuna`) aparecen el mapa integrado, «Cómo llegar» y «Ver en
  Google Maps». Si prefieres el mapa exacto de tu ficha de Google, pega en `mapaEmbedUrl` el `src`
  del iframe de *Compartir → Insertar un mapa* y en `googleMapsUrl` el enlace de *Compartir*.
- `horario`: días (0 = domingo … 6 = sábado) con hora de apertura y cierre. De aquí salen la tabla
  de horario, el estado «Abierto ahora», el pie de página y las horas que ofrece el formulario de
  reservas. La hora se calcula en `zonaHoraria` (`America/Santiago`).
- `demo`: ponlo en `false` cuando los datos sean reales; desaparecen las etiquetas «Ejemplo» y los
  avisos para quien edita.

### Carta y precios · `assets/js/datos-menu.js`

Cada categoría tiene `nombre`, `corto` (texto de la pestaña), `bajada`, la reacción de la mascota
(`mascota` y `burbuja`) y sus `productos`. Cada producto:

```js
{ id: 'cappuccino', nombre: 'Cappuccino', precio: 3400,
  imagen: 'assets/img/menu/cappuccino.webp', alt: 'Cappuccino con espuma y cacao',
  descripcion: 'Espresso, leche vaporizada y una nube de espuma con cacao.' },
```

- `precio` va en pesos, sin puntos: `3400` se muestra como **$3.400**.
- La carta, la lista de precios, los combos y las promociones se generan desde este archivo: cambias
  un precio una vez y se actualiza en todas partes.
- `combos.incluye` usa los `id` de los productos; el sitio suma sus precios y muestra «Ahorras $…».
- Para agregar un producto, copia uno y cambia sus datos; para quitarlo, borra su bloque.

### Equipo · `assets/js/datos-equipo.js`

Cambia `nombre`, `cargo` y `descripcion`. Para la foto, guárdala en `assets/img/equipo/` en formato
vertical (4:5, por ejemplo 640 × 800 px), escribe su ruta en `foto` y pon `ejemplo: false`.

### Fotos

Las fotos actuales son **de referencia** (ver [CREDITOS.md](CREDITOS.md)): no muestran productos, local ni
personas de CREMA & GRANO. Para usar las tuyas, reemplaza el archivo con el mismo nombre (720 × 540 px,
4:3, `.webp` o `.jpg`) o cambia la ruta en `datos-menu.js`, y borra su entrada en
`assets/js/creditos.js` y en `CREDITOS.md`.

### Colores y tipografía

Están al inicio de `assets/css/styles.css` como variables CSS:

| Variable | Color | Uso |
| --- | --- | --- |
| `--crema` | `#FFF7EA` | Fondos principales |
| `--marfil` | `#F5E8D3` | Fondos alternos |
| `--cafe` | `#4A281B` | Títulos, textos y pie de página |
| `--chocolate` | `#6B3F2A` | Botones y navegación destacada |
| `--caramelo` | `#B98250` | Detalles, *hover* y acentos |
| `--beige` | `#DCC2A1` | Superficies cálidas, mantel de la carta |
| `--blanco` | `#FFFFFF` | Tarjetas y formularios |
| `--rosa` | `#F2A18E` | Solo detalles de la mascota |

Tipografías: **Fraunces** (logotipo y títulos) y **Figtree** (textos), de Google Fonts.

## Mascota

> **Importante:** la imagen de la tazita oficial no llegó junto con el encargo (solo llegaron los dos
> vídeos de referencia). `assets/img/mascota/tazita.png` es una **tazita provisional** dibujada para
> que el sitio funcione mientras tanto. Reemplázala por la ilustración oficial.

1. Guarda tu ilustración como `assets/img/mascota/tazita.png` (PNG con fondo transparente, unos
   800 px de ancho), reemplazando la provisional. No hace falta cambiar nada más: el sitio toma la
   proporción real de la imagen y nunca la deforma ni la recorta.
2. Abre el sitio con `#ajustar-mascota` al final de la URL. Verás marcada con línea punteada la capa
   del café animado. Ajusta en `config.js → mascota.boca` el centro (`x`, `y`) y el tamaño (`ancho`,
   `alto`), en porcentajes de la imagen, hasta que calce con la superficie del café de tu dibujo.
3. Si tu ilustración no muestra el café por arriba, pon `capaLiquido: false`: la tazita seguirá
   flotando, viajando y mostrando vapor y burbujas, sin capa de café.
4. `asomarse` define cuánto de la parte inferior queda oculto tras el logotipo en la portada
   (0.3 = 30 %).

La imagen original no se modifica nunca: el café, el vapor, los cubos de hielo, la bolsita de té y
los corazones son capas SVG independientes, encima de la ilustración.

### Cómo se mueve

- **Al cargar:** la línea se dibuja, el logotipo sube desde ella y la tazita se asoma por detrás de la
  última letra («¿Un cafecito?»).
- **Siempre:** flota suavemente; el vapor sube y se desvanece; el café se mece con un pequeño muelle.
- **Cursor (computador):** se inclina levemente hacia el puntero.
- **Scroll (computador):** se desprende del logotipo, baja por el borde libre derecho de la página, se
  achica un poco y se acomoda junto a la carta, donde se queda fija mientras eliges. Su café se inclina
  con el movimiento y el vapor se aquieta durante el viaje. Al final de la página reaparece asomándose
  tras el logotipo del pie («¡Vuelve pronto!»).
- **Carta:** cada categoría cambia el café (espresso, arte latte, salsa de caramelo, hielo sin vapor,
  bolsita de té, corazones para la pastelería, americano para el desayuno) y lo que dice la burbuja.
- **Móvil:** no viaja sobre el contenido. Se desprende y se inclina en la portada, vuelve a aparecer en
  la cabecera de la carta y termina en el pie.
- **«Reducir movimiento» activado en el dispositivo:** todo queda quieto y visible, sin viajes ni
  flotación.

## Conectar formularios

Sin conexión, los formularios validan los datos pero **no envían nada ni confirman reservas**: lo dicen
claramente y ofrecen los canales configurados (WhatsApp o correo). Para conectarlos, pon una URL en:

- `config.js → reservas.endpoint`
- `config.js → formularioContacto.endpoint`

El sitio envía un `POST` (`application/x-www-form-urlencoded`) con estos campos y considera recibido el
envío si la respuesta es 2xx:

- Reserva: `tipo=reserva`, `nombre`, `contacto`, `fecha` (AAAA-MM-DD), `hora` (HH:MM), `personas`,
  `comentarios`, `enviado` (fecha ISO).
- Contacto: `tipo=contacto`, `nombre`, `contacto`, `mensaje`, `enviado`.

Al conectarse, el mensaje dice «Recibimos tu solicitud… te contactaremos para confirmarla»: la reserva
queda confirmada solo cuando el local responde.

Opciones sencillas:

- **Formspree** (o similar): crea un formulario y pega su URL (`https://formspree.io/f/…`) como endpoint.
- **Google Sheets con Apps Script**: en una hoja de cálculo, *Extensiones → Apps Script*, pega lo
  siguiente, publícalo como *Aplicación web* (acceso: cualquier persona) y usa su URL como endpoint.

  ```js
  function doPost(e) {
    var p = e.parameter;
    SpreadsheetApp.getActive().getSheets()[0].appendRow([
      new Date(), p.tipo, p.nombre, p.contacto, p.fecha || '', p.hora || '',
      p.personas || '', p.comentarios || p.mensaje || ''
    ]);
    return ContentService.createTextOutput('{"ok":true}').setMimeType(ContentService.MimeType.JSON);
  }
  ```
- **API propia o sistema de reservas:** cualquier URL que acepte ese `POST`.

Si el formulario de contacto no tiene endpoint pero sí hay `contacto.email`, abre el programa de correo
de la persona con el mensaje ya escrito.

## Publicar

No hay compilación: sube la carpeta completa a cualquier hosting estático (Netlify, Vercel, Cloudflare
Pages, GitHub Pages o tu propio servidor). Al tener dominio, agrega en `<head>` una imagen para compartir
en redes, con URL absoluta: `<meta property="og:image" content="https://tu-dominio.cl/assets/img/mascota/tazita.png">`.

## Antes de publicar

- [ ] Reemplazar `assets/img/mascota/tazita.png` por la tazita oficial y ajustar `mascota.boca`.
- [ ] Completar contacto, dirección y horario reales en `config.js`.
- [ ] Revisar productos, descripciones y precios en `datos-menu.js`.
- [ ] Reemplazar los perfiles de ejemplo del equipo.
- [ ] Reemplazar el texto de «¿Quiénes somos?» (en `index.html`) por la historia real.
- [ ] Cambiar las fotos de referencia por fotos propias cuando las tengas (y actualizar los créditos).
- [ ] Conectar `reservas.endpoint` y `formularioContacto.endpoint`, o dejar solo WhatsApp y correo.
- [ ] Poner `demo: false`.
- [ ] Probar en un teléfono: menú, pestañas, reserva, WhatsApp y «Cómo llegar».

## Accesibilidad y rendimiento

- Contraste AA en textos, foco visible, navegación por teclado (pestañas con flechas, Inicio y Fin;
  menú móvil con Escape), etiquetas y errores asociados a cada campo, resumen de errores con enlaces.
- Respeta `prefers-reduced-motion`.
- Fotos en WebP (unos 25 KB cada una) con carga diferida: solo se descargan las de la categoría visible.
- Sin librerías: las animaciones usan `transform` y `opacity`, y el bucle de animación se detiene
  cuando no hay nada que mover.
