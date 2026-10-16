import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { business } from './src/config/business'

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Inyecta en index.html los metadatos SEO / Open Graph y los datos
 * estructurados (schema.org) a partir de src/config/business.ts, para que
 * exista una única fuente de verdad.
 */
function businessMeta(): Plugin {
  return {
    name: 'business-meta',
    transformIndexHtml(html) {
      const siteName = `${business.descriptor} ${business.name}`
      const title = `${siteName} | ${business.copy.heroTitle}`
      const ogImage = business.images.hero.startsWith('http')
        ? `${business.images.hero}?auto=format&fit=crop&w=1200&h=630&q=70`
        : new URL(business.images.hero, business.siteUrl).toString()

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const jsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'BarberShop',
        name: siteName,
        url: business.siteUrl,
        image: ogImage,
        description: business.copy.seoDescription,
        priceRange: '$$',
      }
      // Solo se publican datos confirmados (los marcados como demo se omiten).
      if (!business.contact.isDemo) jsonLd.telephone = `+${business.contact.whatsapp.replace(/\D/g, '')}`
      if (!business.address.isDemo) {
        jsonLd.address = {
          '@type': 'PostalAddress',
          streetAddress: business.address.street,
          addressLocality: business.address.city,
          addressRegion: business.address.region,
          addressCountry: business.address.country,
        }
      }
      if (!business.hours.isDemo) {
        jsonLd.openingHoursSpecification = Object.entries(business.hours.weekly)
          .filter(([, r]) => r)
          .map(([d, r]) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: days[Number(d)],
            opens: r!.open,
            closes: r!.close,
          }))
      }

      const replacements: Record<string, string> = {
        '%TITLE%': escapeHtml(title),
        '%DESCRIPTION%': escapeHtml(business.copy.seoDescription),
        '%SITE_NAME%': escapeHtml(siteName),
        '%SITE_URL%': escapeHtml(business.siteUrl),
        '%OG_IMAGE%': escapeHtml(ogImage),
        '%LOCALE%': business.locale.replace('-', '_'),
        '%LANG%': business.locale.split('-')[0],
        '%JSON_LD%': JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }
      return Object.entries(replacements).reduce((out, [k, v]) => out.split(k).join(v), html)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), businessMeta()],
  build: {
    target: 'es2020',
    cssMinify: true,
  },
})
