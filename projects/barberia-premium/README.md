# Barbería premium: sitio web

Sitio web de una sola página para una barbería, pensado para reservar por WhatsApp.
Usa React 18, TypeScript, Vite, Tailwind CSS 4 y Lucide Icons. No tiene backend,
cuentas ni base de datos.

## Ejecutar en local

Requisitos: Node.js 20.19 o superior (o 22.12 o superior) y npm.

```bash
cd projects/barberia-premium
npm install
npm run dev        # servidor de desarrollo → http://localhost:5173
npm run build      # comprobación de tipos + build de producción en dist/
npm run preview    # sirve dist/ → http://localhost:4173
```

## Dónde se edita cada dato

Toda la información del negocio está en **`src/config/business.ts`**:

| Dato | Campo |
| --- | --- |
| Nombre y descriptor | `name`, `descriptor` |
| Logotipo propio | `logoSrc` (copiar el archivo a `public/` y poner p. ej. `'/logo.svg'`) |
| Dominio definitivo (SEO) | `siteUrl` |
| Teléfono y WhatsApp | `contact.phoneDisplay`, `contact.whatsapp` (solo dígitos, con código de país) |
| Instagram / Facebook | `contact.instagram`, `contact.facebook` (`null` los oculta) |
| Dirección y Google Maps | `address.*`, `address.mapsQuery`, `address.references` |
| Horario, zona horaria y festivos | `hours.weekly`, `hours.timeZone`, `hours.closedDates` |
| Servicios, precios y duraciones | `services`, `currency` |
| Fotografías | `images.*` |

Cuando un bloque de datos sea real, cambia su `isDemo` (o `servicesAreDemo`) a `false`
y desaparecerá la etiqueta «Dato de ejemplo». Los datos marcados como demo tampoco se
publican en los datos estructurados para Google.

### Fotografías

Por defecto se usan fotos de stock de Unsplash, servidas por su CDN en tamaños optimizados.
Si alguna no carga, se muestra un fondo de marca en su lugar, así que nunca aparece una
imagen rota. Para un cliente real conviene usar fotos propias del local:

1. Exporta las fotos en WebP o JPG, de unos 1600–2400 px de ancho y menos de 400 KB cada una.
2. Cópialas a `public/images/`.
3. Usa rutas como `'/images/interior.webp'` en `images.*`.

Si dejas de usar Unsplash, quita `https://images.unsplash.com` de `public/_headers` y el
`preconnect` de `index.html`.

## Publicar con HTTPS (hosting estático)

`npm run build` genera la carpeta `dist/`. Cualquier hosting estático sirve, y todos los de
abajo incluyen HTTPS gratis.

**Netlify**
1. Sube el repositorio a GitHub y en Netlify elige *Add new site → Import from Git*.
2. Base directory: `projects/barberia-premium`. Build command: `npm run build`. Publish directory: `dist`.
3. Netlify aplica automáticamente las cabeceras de seguridad de `public/_headers`.
4. En *Domain management* añade tu dominio. El certificado HTTPS se emite solo.

Alternativa sin Git: ejecuta `npm run build` y arrastra la carpeta `dist/` a https://app.netlify.com/drop.

**Cloudflare Pages**: misma configuración (root `projects/barberia-premium`, build `npm run build`,
output `dist`). También lee `public/_headers`.

**Vercel**: Root Directory `projects/barberia-premium`; detecta Vite por sí solo. Para las
cabeceras de seguridad, copia las de `public/_headers` en un `vercel.json` (`headers`).

Después de publicar:
- Actualiza `siteUrl` con el dominio definitivo y vuelve a publicar.
- Comprueba el sitio en https://pagespeed.web.dev y la vista previa al compartir en WhatsApp o Instagram.

## Estructura

```
src/
├── config/business.ts        ← datos del negocio (única fuente de verdad)
├── lib/                      ← lógica pura: horarios, WhatsApp, Maps, formato
├── hooks/                    ← estado abierto/cerrado, scroll, animaciones
├── components/
│   ├── Navbar · Hero · About · Services · Gallery
│   ├── BusinessHours · Location · Contact · Footer
│   ├── WhatsAppButton        ← botón reutilizable y botón flotante
│   └── ui/                   ← logo, imagen optimizada, etiquetas, iconos de marca
└── index.css                 ← tokens de diseño (colores, tipografías) y estilos base
```
