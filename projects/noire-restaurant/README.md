# NOIRÉ Restaurant & Wine Bar — demo site

A cinematic, single-page frontend for **NOIRÉ**, a *fictional* fine-dining
restaurant and wine bar. It is a commercial demonstration project: there is no
backend, booking system, newsletter provider or payment flow.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, Cache Components) + TypeScript |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`) |
| Scroll motion | GSAP 3 + ScrollTrigger via `@gsap/react` (`useGSAP`, `gsap.matchMedia`) |
| Smooth scroll | Lenis, driven by the GSAP ticker and synced to ScrollTrigger |
| UI motion | Framer Motion (cursor, dialogs, carousel, tabs, lightbox) |
| Images | `next/image` with a local fallback panel (`SafeImage`) |
| Icons | Lucide React |
| Fonts | Playfair Display + Inter, self-hosted via `@fontsource-variable` |

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build && npm start
```

## Where to edit things

| What | File |
| --- | --- |
| Brand name, nav, contact, socials, WhatsApp number, "connected" flags | `src/config/site.ts` |
| Signature dishes, full menu, prices, currency, tasting chapters | `src/content/menu.ts` |
| Sample testimonials, experience themes, gallery layout | `src/content/editorial.ts` |
| Every image/video URL, alt text and fallback label | `src/content/media.ts` |
| Colours, fonts, fluid type scale, glass/eyebrow utilities | `src/app/globals.css` |
| Allowed remote image hosts | `next.config.ts` → `images.remotePatterns` |

Sections live in `src/components/sections/`, layout chrome in
`src/components/layout/`, and shared pieces (Dialog, SafeImage, Button,
Cursor, SectionHeading) in `src/components/ui/`.

## Illustrative content — replace before launch

Everything below is placeholder copy written for the demo and is labelled as
such in the UI:

- **Dishes, descriptions and prices** (all CLP figures) in `src/content/menu.ts`.
  The menu modal carries a note that dishes and prices must be confirmed with
  the restaurant. Set a price to `null` to show "On request".
- **Seven-course tasting** — only the three illustrative chapter descriptions;
  no fixed course list is claimed.
- **Chef Alexander Thorne** is a fictional character. No awards, stars, press
  or credentials are claimed anywhere.
- **Testimonials** are sample quotes, captioned "not a genuine review".
- **Private dining and the wine experience** are presented as concepts, not
  confirmed facilities.
- **Location** reads "Location to be announced"; no address is invented.
- **Contact details and social links** are `null`/empty and the footer says so.

## Forms (honest by design)

- **Reservation form** validates name, email format, a non-past date, time and
  party size. On a valid submission it shows a message stating that the demo is
  *not* connected to a booking system and that nothing was sent or stored. No
  data leaves the browser and nothing is persisted.
- **WhatsApp button** only appears once `siteConfig.whatsappNumber` is set. It
  opens a prefilled message in the guest's own WhatsApp; nothing is sent
  automatically.
- **Newsletter form** validates the email and states that it is a demo and the
  address was not sent or saved. Flip `newsletterConnected` /
  `reservationsConnected` only after wiring a real provider.

## Asset status

The brief supplied these candidate assets:

| Slot | Source | Used for |
| --- | --- | --- |
| `heroBackground` | `strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/restaurant_bg.png` | Hero, dining-room theme, gallery |
| `heroVideo` | `strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/hero_food_video.mp4` | Floating hero card |
| `candidateA` | Unsplash `photo-1506377247377-2a5b3b417ebb` | Risotto card, hero-card still, story inset, finale |
| `candidateB` | Unsplash `photo-1544148103-0773bf10d330` | Butterfish card, wine theme, gallery |
| `candidateC` | Unsplash `photo-1559339352-11d035aa65de` | Crémeux card, story image, private-dining theme |
| `candidateD` | Unsplash `photo-1600891964092-4316c288032e` | Wagyu card, expression chapter, gallery |

**None of these could be verified from the build environment** — outbound
requests to both hosts were blocked by its network policy — so availability and
subject matter (e.g. whether a given photo actually shows the dish it is paired
with) are **unconfirmed**. Review them in a browser before launch and reassign
slots in `src/content/media.ts` if a photo does not fit.

Three gallery/tasting themes (`chefPreparation`, `seasonalIngredients`,
`wineService`) have **no supplied photograph**; they render the local fallback
panel until you add a licensed image. No image URLs were invented.

How failure is handled:

- `SafeImage` swaps any missing or failed image for a local, art-directed panel
  (warm gradient + grain), so there are never broken-image icons.
- The hero video sits over a still image; if the video fails, the still (or its
  fallback panel) remains visible.
- To add a new host, append it to `images.remotePatterns` in `next.config.ts`.

## Motion & accessibility notes

- All GSAP work runs inside `useGSAP` + `gsap.matchMedia`, so it is reverted on
  unmount (Strict-Mode safe) and skipped under `prefers-reduced-motion`.
- An inline script adds `.js-motion` before first paint so hero elements can
  start hidden without a flash. It never applies for reduced motion, and a 4 s
  timeout reveals everything if scripts fail. Scroll reveals use opacity only, so
  content that has not been revealed yet can still be reached with the keyboard.
- Lenis smooths wheel input only (touch keeps native scrolling), is disabled
  for reduced motion and honours `scroll-margin-top` for the fixed header.
- Dialogs (menu, mobile nav, lightbox) render in a portal, mark the page
  `inert`, trap focus, close on Escape, lock scroll (native + Lenis) and return
  focus to the element that opened them.
- The custom cursor only mounts for fine pointers with motion allowed, ignores
  pointer events, and keeps the native cursor over text fields.

## Verified in this environment

- `npx tsc --noEmit`, `npm run lint` and `npm run build`: clean.
- Headless Chromium at 320, 360, 390, 430, 768, 1024, 1280 and 1440 px: no
  horizontal overflow, no runtime errors. The only console errors are the
  blocked remote assets described above.
- Checked by script: nav scroll and focus, menu modal (focus trap, Escape,
  scroll lock, focus restore), lightbox (arrow keys, focus restore), form
  validation and demo message, carousel controls, the mobile menu, and the
  reduced-motion path.
- **Not verified:** real image and video rendering, video autoplay, and
  manual testing on physical touch devices or screen readers.
