/**
 * ============================================================================
 *  CONFIGURACIÓN CENTRAL DEL NEGOCIO
 * ============================================================================
 *  Todo el contenido comercial del sitio se edita aquí: nombre, contacto,
 *  dirección, horarios, servicios, precios, redes sociales e imágenes.
 *
 *  Los campos marcados con `isDemo: true` (o con el comentario «DEMO») son
 *  DATOS DE DEMOSTRACIÓN: el sitio los muestra con una etiqueta visible
 *  «Dato de ejemplo» hasta que el propietario los confirme. Al reemplazarlos
 *  por los datos reales, cambia `isDemo` a `false` y la etiqueta desaparece.
 * ============================================================================
 */

export type DayKey = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo … 6 = sábado

/** Tramo horario en formato 24 h "HH:MM". */
export interface TimeRange {
  open: string
  close: string
}

export interface Service {
  id: string
  name: string
  description: string
  /** Precio en la moneda definida en `currency`. `null` = «Consultar». */
  price: number | null
  /** Duración estimada en minutos. `null` = no se muestra. */
  durationMin: number | null
  featured?: boolean
}

export interface GalleryImage {
  src: string
  alt: string
  category: string
}

export const business = {
  /* ------------------------------------------------------------------ */
  /*  Identidad                                                          */
  /* ------------------------------------------------------------------ */
  /** DEMO: nombre comercial de ejemplo. Reemplazar por el nombre real. */
  name: 'Atelier',
  /** Palabra pequeña que acompaña al nombre en el logotipo. */
  descriptor: 'Barbería',
  /**
   * Logotipo. Si se deja en `null` se usa el monograma SVG incluido.
   * Para usar un logo propio: copiar el archivo a /public (p. ej. /logo.svg)
   * y escribir aquí la ruta: '/logo.svg'.
   */
  logoSrc: null as string | null,

  /** URL pública definitiva del sitio (para SEO y metadatos al compartir). */
  siteUrl: 'https://www.tu-dominio.cl',
  locale: 'es-CL',

  /* ------------------------------------------------------------------ */
  /*  Contacto                                                           */
  /* ------------------------------------------------------------------ */
  contact: {
    /** DEMO: número visible en la web. */
    phoneDisplay: '+56 9 0000 0000',
    /**
     * DEMO: número de WhatsApp en formato internacional, SOLO dígitos,
     * sin "+", espacios ni guiones. Ej. Chile: 569XXXXXXXX.
     */
    whatsapp: '56900000000',
    /** Cuenta de Instagram sin "@". `null` si no tiene. */
    instagram: null as string | null,
    /** URL completa de Facebook. `null` si no tiene. */
    facebook: null as string | null,
    isDemo: true,
  },

  /* ------------------------------------------------------------------ */
  /*  Ubicación                                                          */
  /* ------------------------------------------------------------------ */
  address: {
    /** DEMO: dirección de ejemplo, NO corresponde a un local real. */
    street: 'Calle Ejemplo 123',
    district: 'Comuna',
    city: 'Ciudad',
    region: 'Región',
    country: 'Chile',
    /**
     * Texto que se envía a Google Maps. Lo ideal es el nombre del local tal
     * como aparece en Google Maps + la dirección, o un enlace de «Compartir».
     */
    mapsQuery: 'Calle Ejemplo 123, Comuna, Ciudad, Chile',
    /** Indicaciones para llegar (opcional). Dejar [] si no hay. */
    references: [] as string[],
    isDemo: true,
  },

  /* ------------------------------------------------------------------ */
  /*  Horario de atención                                                */
  /* ------------------------------------------------------------------ */
  hours: {
    /**
     * Zona horaria IANA del local. El indicador «Abierto ahora» se calcula
     * con la hora de la barbería, no con la del visitante.
     */
    timeZone: 'America/Santiago',
    /** DEMO: horario semanal. `null` = cerrado ese día. */
    weekly: {
      0: null,
      1: { open: '10:00', close: '20:00' },
      2: { open: '10:00', close: '20:00' },
      3: { open: '10:00', close: '20:00' },
      4: { open: '10:00', close: '20:00' },
      5: { open: '10:00', close: '20:00' },
      6: { open: '10:00', close: '18:00' },
    } as Record<DayKey, TimeRange | null>,
    /**
     * Días festivos o cierres especiales en formato "AAAA-MM-DD".
     * Ese día el indicador mostrará «Cerrado».
     */
    closedDates: [] as string[],
    isDemo: true,
  },

  /* ------------------------------------------------------------------ */
  /*  Servicios (precios y duraciones DEMO)                              */
  /* ------------------------------------------------------------------ */
  currency: 'CLP',
  servicesAreDemo: true,
  services: [
    {
      id: 'corte-clasico',
      name: 'Corte clásico',
      description: 'Tijera y máquina con terminación prolija. Incluye lavado y peinado.',
      price: 12000,
      durationMin: 40,
    },
    {
      id: 'fade',
      name: 'Fade / degradado',
      description: 'Degradado limpio y progresivo, adaptado a tu tipo de cabello.',
      price: 14000,
      durationMin: 45,
    },
    {
      id: 'corte-premium',
      name: 'Corte premium',
      description: 'Asesoría de estilo, corte detallado, lavado, toalla caliente y styling.',
      price: 20000,
      durationMin: 60,
      featured: true,
    },
    {
      id: 'barba',
      name: 'Arreglo de barba',
      description: 'Perfilado, rebaje y contorno a navaja con toalla caliente.',
      price: 10000,
      durationMin: 30,
    },
    {
      id: 'corte-barba',
      name: 'Corte + barba',
      description: 'El servicio completo: corte a elección y arreglo de barba.',
      price: 20000,
      durationMin: 70,
    },
    {
      id: 'cejas',
      name: 'Perfilado de cejas',
      description: 'Limpieza y definición natural para enmarcar la mirada.',
      price: 5000,
      durationMin: 15,
    },
  ] as Service[],

  /* ------------------------------------------------------------------ */
  /*  Imágenes                                                           */
  /* ------------------------------------------------------------------ */
  /**
   * Fotografías de stock de Unsplash (licencia Unsplash, uso comercial
   * permitido). Se recomienda reemplazarlas por fotos reales del local:
   * copiar los archivos a /public/images/ y usar rutas como
   * '/images/interior.webp'. Si una imagen no carga, el sitio muestra un
   * fondo elegante en su lugar (nunca una imagen rota).
   */
  images: {
    hero: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
    about: [
      {
        src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70',
        alt: 'Barbero realizando un corte a un cliente en el sillón',
      },
      {
        src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
        alt: 'Detalle de un corte con máquina y tijera',
      },
      {
        src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a',
        alt: 'Arreglo de barba con navaja',
      },
    ],
    services: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c',
    contact: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b',
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486',
        alt: 'Corte degradado recién terminado',
        category: 'Degradados',
      },
      {
        src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a',
        alt: 'Barbero perfilando una barba con navaja',
        category: 'Barbas',
      },
      {
        src: 'https://images.unsplash.com/photo-1532710093739-9470acff878f',
        alt: 'Interior de la barbería con sillones clásicos',
        category: 'Interior',
      },
      {
        src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
        alt: 'Corte clásico con tijera',
        category: 'Cortes clásicos',
      },
      {
        src: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186',
        alt: 'Herramientas de barbería sobre el mesón',
        category: 'Herramientas',
      },
      {
        src: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0',
        alt: 'Cliente durante un servicio de barbería',
        category: 'Cortes clásicos',
      },
      {
        src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c',
        alt: 'Afeitado tradicional con toalla caliente',
        category: 'Barbas',
      },
      {
        src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
        alt: 'Sillones de barbero en un ambiente cálido',
        category: 'Interior',
      },
    ] as GalleryImage[],
  },

  /* ------------------------------------------------------------------ */
  /*  Textos de marca                                                    */
  /* ------------------------------------------------------------------ */
  copy: {
    heroTitle: 'Tu estilo. Tu identidad.',
    heroSubtitle: 'Cortes precisos, atención personalizada y una experiencia diseñada para ti.',
    seoDescription:
      'Barbería premium: cortes clásicos, fade, arreglo de barba y atención personalizada. Reserva tu hora por WhatsApp en segundos.',
  },
}

export type Business = typeof business
