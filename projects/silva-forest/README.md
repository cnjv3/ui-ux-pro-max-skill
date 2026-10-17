# SILVA — Guardians of the Forest

A cinematic single-page site for a forest-conservation organisation, built with
Next.js 14 (App Router), React 18, TypeScript and Tailwind CSS 3.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck && npm run lint
```

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Address used by every "Contact" / "Email us" link and the footer. Falls back to the non-deliverable placeholder `hello@silva.example` until set (see `.env.example`). |

There are no social links, forms or language switcher yet: nothing is shown
that would pretend to work.

## Structure

- `app/` — layout (fonts, metadata), global styles and the page.
- `components/Hero.tsx` + `HeroBackdrop.tsx` + `SiteNav.tsx` — the framed hero over the aerial photograph, parallax and the accessible mobile menu.
- `components/Mission`, `ActionAreas`, `Projects`, `WhyForests` (journal), `Participate`, `Footer` — the remaining sections.
- `components/ForestImage.tsx` — `next/image` wrapper that falls back to a forest-toned surface if a photo fails to load.
- `components/RevealObserver.tsx` — one IntersectionObserver for every `data-reveal` element.

Motion is plain CSS plus two tiny effects (parallax, scroll reveal); no animation
library is installed. Everything is static and visible under
`prefers-reduced-motion: reduce` or with JavaScript disabled.

## Content notes

- The projects section is explicitly **illustrative**: names, regions and statuses are placeholders, and no results are claimed.
- Figures in the journal section are cited: FAO *Global Forest Resources Assessment 2020* (forests cover 31% of land area) and FAO & UNEP *The State of the World's Forests 2020* (habitat for 80% of amphibian, 75% of bird and 68% of mammal species). The remaining statements are qualitative.

## Photography

All photos are from [Unsplash](https://unsplash.com) (Unsplash License: free to
use, attribution appreciated but not required), taken from the curated
[ServiceStack/images](https://github.com/ServiceStack/images) collection and
re-encoded locally. The Unsplash photo id is the original file name:

| File | Unsplash id |
| --- | --- |
| `hero-forest-aerial.jpg` | `photo-1488489153583-89ce18dd4968` |
| `mission-misty-forest.jpg` | `photo-1503435980610-a51f3ddfee50` |
| `action-conservation.jpg` | `photo-1455656678494-4d1b5f3e7ad4` |
| `action-restoration.jpg` | `photo-1421789665209-c9b2a435e3dc` |
| `action-biodiversity.jpg` | `photo-1497010905071-cba70e163811` |
| `project-canopy.jpg` | `photo-1510382739061-d3f7bb547302` |
| `project-highlands.jpg` | `photo-1476362555312-ab9e108a0b7e` |
| `project-understory.jpg` | `photo-1487525219605-eadb39ae229c` |
| `participate-trees.jpg` | `photo-1506268919522-a927511962a9` |

The source files are 2560×1000 panoramas, so the hero is slightly soft on large
high-DPI portrait screens; swap in a taller, higher-resolution aerial for
production.
