/* =========================================================================
   VÉRANO — Configuración central
   -------------------------------------------------------------------------
   Todo el contenido editable del sitio vive en este archivo:
   contacto, horarios, reservas, carta, especialidades, galería,
   experiencias y el registro de fotografías.

   Marca ficticia de demostración. Los campos marcados con
   «PENDIENTE» deben reemplazarse con datos reales antes de publicar
   (ver README.md → «Datos pendientes»).
   ========================================================================= */
window.VERANO_CONFIG = {
  /* Con demoMode activo se muestran avisos discretos de «dato de
     demostración» junto a los datos pendientes. Ponlo en false cuando
     todos los datos sean reales. */
  demoMode: true,

  brand: {
    name: 'VÉRANO',
    descriptor: "Cucina d'Autore",
    tagline: 'La tradición italiana, reinterpretada a través de los sentidos.'
  },

  contact: {
    /* PENDIENTE — número real en formato internacional, solo dígitos
       (código de país + número, sin «+», espacios ni guiones). */
    whatsapp: {
      number: '56900000000',
      display: '+56 9 0000 0000',
      isPlaceholder: true
    },
    /* PENDIENTE — teléfono fijo o móvil del restaurante. */
    phone: {
      href: '+56900000000',
      display: '+56 9 0000 0000',
      isPlaceholder: true
    },
    /* PENDIENTE — deja handle y url vacíos hasta confirmar la cuenta.
       Ejemplo: handle: '@verano.cucina', url: 'https://www.instagram.com/verano.cucina/' */
    instagram: {
      handle: '',
      url: ''
    },
    /* PENDIENTE — dirección verificada. Mientras isPlaceholder sea true
       no se genera enlace de mapas ni mapa incrustado. */
    address: {
      line1: 'Dirección por confirmar',
      line2: 'Comuna y ciudad por confirmar',
      isPlaceholder: true,
      /* Texto que se envía al servicio de mapas (por defecto, line1 + line2). */
      mapsQuery: '',
      /* URL de inserción (iframe) de Google Maps u otro servicio.
         Solo para una ubicación real y verificada. */
      mapEmbedUrl: ''
    },
    /* PENDIENTE — horarios reales. */
    hoursAreDemo: true,
    hours: [
      { days: 'Martes a jueves', time: '13:00 – 16:00 · 19:30 – 23:00' },
      { days: 'Viernes y sábado', time: '13:00 – 16:30 · 19:30 – 00:00' },
      { days: 'Domingo', time: '13:00 – 17:00' },
      { days: 'Lunes', time: 'Cerrado' }
    ]
  },

  reservations: {
    minGuests: 1,
    maxGuests: 12,
    defaultGuests: 2,
    /* Días hacia adelante en que se aceptan solicitudes. */
    maxDaysAhead: 90,
    /* Si la fecha es hoy, la hora debe estar al menos a estos minutos. */
    leadTimeMinutes: 60,
    /* 0 = domingo … 6 = sábado. Días sin servicio (no seleccionables). */
    closedWeekdays: [1],
    /* Turnos disponibles por día (opcional). Si un día no aparece,
       se ofrecen todos los turnos. Ejemplo: domingo solo almuerzo. */
    servicesByWeekday: { 0: ['Almuerzo'] },
    /* PENDIENTE — ajustar a los turnos reales. */
    timeSlots: [
      { label: 'Almuerzo', times: ['13:00', '13:30', '14:00', '14:30', '15:00'] },
      { label: 'Cena', times: ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00'] }
    ]
  },

  /* -----------------------------------------------------------------------
     Registro de fotografías
     -----------------------------------------------------------------------
     src:       ruta local (p. ej. 'img/hero.webp') o URL con licencia.
                Vacío = se muestra un marcador de posición diseñado
                (no se hace ninguna petición de red).
     srcMobile: (opcional) encuadre vertical para pantallas < 720 px.
     alt:       texto alternativo útil (describe la fotografía real).
     brief:     indicación de dirección de arte para el fotógrafo.
     tone:      paleta del marcador de posición (ver TONES en app.js).
     position:  object-position del encuadre.
     width/height: dimensiones reales del archivo (reservan espacio).
     ----------------------------------------------------------------------- */
  images: {
    hero: {
      src: '', srcMobile: '',
      alt: 'Manos estirando una lámina de pasta fresca sobre una mesa enharinada, con luz cálida lateral',
      brief: 'Pasta fresca estirada a mano · contraluz cálido · 16:9 y 4:5',
      tone: 'amber', position: '50% 45%', width: 2400, height: 1350
    },
    philosophy: {
      src: '',
      alt: 'Tomates maduros, albahaca fresca y una aceitera sobre mármol claro',
      brief: 'Ingredientes sobre mármol · luz natural · vertical 3:4',
      tone: 'herbs', position: '50% 50%', width: 1200, height: 1600
    },
    'sp-ravioli': {
      src: '',
      alt: 'Ravioli artesanales con mantequilla avellanada y hojas de salvia crocante en plato de cerámica',
      brief: 'Ravioli, mantequilla y salvia · cenital · vertical 4:5',
      tone: 'pasta', position: '50% 50%', width: 1200, height: 1500
    },
    'sp-burrata': {
      src: '',
      alt: 'Burrata abierta sobre tomates de temporada cortados, con albahaca y aceite de oliva',
      brief: 'Burrata y tomates de temporada · 45° · horizontal 3:2',
      tone: 'tomato', position: '50% 50%', width: 1500, height: 1000
    },
    'sp-tiramisu': {
      src: '',
      alt: 'Porción de tiramisú con capas de mascarpone y cacao amargo',
      brief: 'Tiramisú, corte lateral con capas visibles · cuadrado 1:1',
      tone: 'cocoa', position: '50% 50%', width: 1200, height: 1200
    },
    'cat-antipasti': {
      src: '', alt: 'Mesa con antipasti para compartir: focaccia, vitello tonnato y arancini',
      brief: 'Antipasti para compartir · cenital · 4:5', tone: 'tomato', width: 1200, height: 1500
    },
    'cat-pasta': {
      src: '', alt: 'Nido de tagliatelle frescas espolvoreadas con sémola',
      brief: 'Pasta fresca cruda, nidos y harina · 4:5', tone: 'flour', width: 1200, height: 1500
    },
    'cat-pizza': {
      src: '', alt: 'Pizza recién salida del horno con bordes inflados y albahaca',
      brief: 'Pizza de autor saliendo del horno · 4:5', tone: 'ember', width: 1200, height: 1500
    },
    'cat-principales': {
      src: '', alt: 'Ossobuco servido sobre risotto al azafrán',
      brief: 'Plato principal emplatado · luz lateral · 4:5', tone: 'meat', width: 1200, height: 1500
    },
    'cat-dolci': {
      src: '', alt: 'Panna cotta con frutos rojos y cannoli sobre mesa de piedra',
      brief: 'Postres en mesa de piedra · 4:5', tone: 'berry', width: 1200, height: 1500
    },
    'cat-bebidas': {
      src: '', alt: 'Negroni y copa de vino tinto sobre la barra',
      brief: 'Cócteles y vino en la barra · contraluz · 4:5', tone: 'wine', width: 1200, height: 1500
    },
    'process-main': {
      src: '',
      alt: 'Cocinero cortando a cuchillo una lámina de pasta fresca',
      brief: 'Corte a cuchillo de la sfoglia · manos en primer plano · vertical 3:4',
      tone: 'flour', position: '50% 40%', width: 1200, height: 1600
    },
    'process-detail': {
      src: '',
      alt: 'Huevos y harina formando un volcán sobre la mesa de trabajo',
      brief: 'Volcán de harina y huevo · detalle · 1:1',
      tone: 'pasta', width: 900, height: 900
    },
    'exp-romantic': {
      src: '', alt: 'Mesa para dos con velas encendidas y copas de vino',
      brief: 'Mesa para dos, velas y vino · 4:5', tone: 'wine', width: 1200, height: 1500
    },
    'exp-private': {
      src: '', alt: 'Mesa larga preparada para una celebración privada',
      brief: 'Mesa larga para un grupo · 4:5', tone: 'table', width: 1200, height: 1500
    },
    'exp-special': {
      src: '', alt: 'Chef terminando un plato frente a los comensales',
      brief: 'Chef emplatando · luz de sala · 4:5', tone: 'amber', width: 1200, height: 1500
    }
  },

  /* -----------------------------------------------------------------------
     Carta — precios de DEMOSTRACIÓN en pesos chilenos (CLP).
     Para añadir un plato, copia un objeto y cambia sus datos.
     category: id de una categoría de la lista `categories`.
     signature: true marca el plato como «Firma del chef».
     image / imageAlt: fotografía propia del plato (opcional).
     ----------------------------------------------------------------------- */
  menu: {
    locale: 'es-CL',
    currency: 'CLP',
    categories: [
      { id: 'antipasti', name: 'Antipasti', subtitle: 'Para abrir la mesa', image: 'cat-antipasti',
        description: 'Pequeños platos para compartir mientras llega la conversación.' },
      { id: 'pasta', name: 'Pasta fresca', subtitle: 'Hecha a mano cada día', image: 'cat-pasta',
        description: 'Masa estirada con rodillo, cortes a cuchillo y salsas de cocción lenta.' },
      { id: 'pizza', name: 'Pizza de autor', subtitle: 'Masa de larga fermentación', image: 'cat-pizza',
        description: 'Bordes altos y ligeros, ingredientes contados y horno muy caliente.' },
      { id: 'principales', name: 'Principales', subtitle: 'Fuego lento', image: 'cat-principales',
        description: 'Cocciones pacientes, fondos propios y guarniciones de temporada.' },
      { id: 'dolci', name: 'Dolci', subtitle: 'Para terminar', image: 'cat-dolci',
        description: 'Postres clásicos italianos, hechos en casa y servidos sin artificio.' },
      { id: 'bebidas', name: 'Vinos y cócteles', subtitle: 'Bar e cantina', image: 'cat-bebidas',
        description: 'Aperitivos italianos, coctelería de autor y vinos por copa.' }
    ],
    items: [
      /* Antipasti */
      { id: 'burrata', category: 'antipasti', signature: true,
        name: 'Burrata con tomates de temporada y albahaca',
        description: 'Burrata cremosa, tomates en su mejor momento, albahaca fresca y aceite de oliva extra virgen.',
        price: 14900, image: '', imageAlt: '' },
      { id: 'vitello', category: 'antipasti',
        name: 'Vitello tonnato',
        description: 'Finas láminas de ternera, salsa suave de atún, alcaparras y limón.',
        price: 13900, image: '', imageAlt: '' },
      { id: 'carpaccio', category: 'antipasti',
        name: 'Carpaccio di manzo',
        description: 'Lomo laminado, rúcula, lascas de parmesano y aceite de oliva.',
        price: 13500, image: '', imageAlt: '' },
      { id: 'arancini', category: 'antipasti',
        name: 'Arancini al tartufo',
        description: 'Croquetas de risotto con corazón de mozzarella y aroma de trufa.',
        price: 11900, image: '', imageAlt: '' },
      { id: 'focaccia', category: 'antipasti',
        name: 'Focaccia della casa',
        description: 'Horneada en casa, con romero, sal en escamas y aceite de oliva.',
        price: 6900, image: '', imageAlt: '' },

      /* Pasta fresca */
      { id: 'ravioli', category: 'pasta', signature: true,
        name: 'Ravioli artesanales con mantequilla y salvia',
        description: 'Rellenos de ricotta y limón, mantequilla avellanada, salvia crocante y parmesano.',
        price: 18900, image: '', imageAlt: '' },
      { id: 'tagliatelle', category: 'pasta',
        name: 'Tagliatelle al ragù',
        description: 'Ragú de vacuno y cerdo cocinado a fuego lento durante horas.',
        price: 17900, image: '', imageAlt: '' },
      { id: 'cacio', category: 'pasta',
        name: 'Tonnarelli cacio e pepe',
        description: 'Pecorino romano, pimienta negra recién molida y agua de cocción.',
        price: 15900, image: '', imageAlt: '' },
      { id: 'pappardelle', category: 'pasta',
        name: 'Pappardelle ai funghi',
        description: 'Hongos salteados, mantequilla, tomillo y parmesano.',
        price: 17500, image: '', imageAlt: '' },
      { id: 'vongole', category: 'pasta',
        name: 'Linguine alle vongole',
        description: 'Almejas, ajo, vino blanco, perejil y un toque de ají.',
        price: 19900, image: '', imageAlt: '' },

      /* Pizza de autor */
      { id: 'margherita', category: 'pizza',
        name: 'Margherita',
        description: 'Tomate, fior di latte, albahaca fresca y aceite de oliva.',
        price: 12900, image: '', imageAlt: '' },
      { id: 'tartufo', category: 'pizza',
        name: 'Tartufo e funghi',
        description: 'Crema de trufa, hongos, fior di latte y tomillo.',
        price: 17900, image: '', imageAlt: '' },
      { id: 'crudo', category: 'pizza',
        name: 'Crudo e rucola',
        description: 'Prosciutto crudo, rúcula, tomates confitados y lascas de parmesano.',
        price: 16900, image: '', imageAlt: '' },
      { id: 'diavola', category: 'pizza',
        name: 'Diavola',
        description: 'Tomate, mozzarella, salame picante y aceite de ají.',
        price: 14900, image: '', imageAlt: '' },

      /* Principales */
      { id: 'ossobuco', category: 'principales',
        name: 'Ossobuco alla milanese',
        description: 'Estofado lentamente, con risotto al azafrán y gremolata.',
        price: 28900, image: '', imageAlt: '' },
      { id: 'pesca', category: 'principales',
        name: 'Pesca del día all’acqua pazza',
        description: 'Pescado de temporada en caldo ligero de tomate, alcaparras y hierbas.',
        price: 26900, image: '', imageAlt: '' },
      { id: 'risotto', category: 'principales',
        name: 'Risotto ai funghi',
        description: 'Arroz carnaroli, hongos, mantequilla y parmesano.',
        price: 21900, image: '', imageAlt: '' },
      { id: 'filetto', category: 'principales',
        name: 'Filetto al vino rosso',
        description: 'Filete de vacuno, reducción de vino tinto y puré de papas trufado.',
        price: 32900, image: '', imageAlt: '' },

      /* Dolci */
      { id: 'tiramisu', category: 'dolci', signature: true,
        name: 'Tiramisú clásico de la casa',
        description: 'Savoiardi bañados en espresso, crema de mascarpone y cacao amargo.',
        price: 8900, image: '', imageAlt: '' },
      { id: 'pannacotta', category: 'dolci',
        name: 'Panna cotta ai frutti rossi',
        description: 'Crema cocida de vainilla con compota de frutos rojos.',
        price: 7500, image: '', imageAlt: '' },
      { id: 'cannoli', category: 'dolci',
        name: 'Cannoli siciliani',
        description: 'Masa crocante rellena de ricotta dulce, pistacho y naranja confitada.',
        price: 7900, image: '', imageAlt: '' },
      { id: 'affogato', category: 'dolci',
        name: 'Affogato al caffè',
        description: 'Helado de vainilla bañado en un espresso recién extraído.',
        price: 5900, image: '', imageAlt: '' },

      /* Vinos y cócteles */
      { id: 'negroni', category: 'bebidas',
        name: 'Negroni VÉRANO',
        description: 'Gin, vermut rosso y bitter, con piel de naranja.',
        price: 8900, image: '', imageAlt: '' },
      { id: 'spritz', category: 'bebidas',
        name: 'Aperol spritz',
        description: 'Aperol, espumante y un toque de soda.',
        price: 7900, image: '', imageAlt: '' },
      { id: 'limoncello', category: 'bebidas',
        name: 'Limoncello sour',
        description: 'Limoncello, limón fresco y espuma ligera.',
        price: 7900, image: '', imageAlt: '' },
      { id: 'rosso', category: 'bebidas',
        name: 'Copa de vino tinto',
        description: 'Selección de la casa, a sugerencia de nuestro equipo de sala.',
        price: 6900, image: '', imageAlt: '' },
      { id: 'bollicine', category: 'bebidas',
        name: 'Copa de espumante',
        description: 'Espumante seco para el aperitivo o para brindar.',
        price: 7500, image: '', imageAlt: '' }
    ]
  },

  /* Especialidades del chef: referencias a platos de la carta (itemId).
     El nombre y el precio salen de la carta para no duplicar datos. */
  specialties: [
    { itemId: 'ravioli', image: 'sp-ravioli', layout: 'portrait',
      note: 'Cada pieza se cierra a mano y se termina en la sartén, frente al fuego.' },
    { itemId: 'burrata', image: 'sp-burrata', layout: 'landscape',
      note: 'Un plato que depende del tomate: cambia con la temporada.' },
    { itemId: 'tiramisu', image: 'sp-tiramisu', layout: 'square',
      note: 'La receta de siempre, armada capa por capa.' }
  ],

  /* Galería: mínimo ocho fotografías distintas (no repetir las de otras secciones). */
  gallery: [
    { src: '', layout: 'portrait', tone: 'pasta', kind: 'Plato',
      caption: 'Tagliatelle al ragù, recién servidas',
      alt: 'Plato de tagliatelle al ragù recién servido sobre mantel de lino' },
    { src: '', layout: 'landscape', tone: 'herbs', kind: 'Ingredientes',
      caption: 'Tomates, albahaca y aceite de oliva',
      alt: 'Tomates, albahaca y aceite de oliva sobre una tabla de madera' },
    { src: '', layout: 'square', tone: 'flour', kind: 'Preparación',
      caption: 'Sfoglia estirada a mano',
      alt: 'Rodillo estirando una lámina de pasta fresca' },
    { src: '', layout: 'landscape', tone: 'amber', kind: 'Interior',
      caption: 'El salón al caer la tarde',
      alt: 'Salón del restaurante con luz cálida y mesas preparadas' },
    { src: '', layout: 'portrait', tone: 'citrus', kind: 'Barra',
      caption: 'Barra y coctelería de autor',
      alt: 'Bartender sirviendo un spritz en la barra' },
    { src: '', layout: 'landscape', tone: 'table', kind: 'Mesa',
      caption: 'Mesa preparada para la cena',
      alt: 'Mesa con mantel blanco, copas y cubiertos preparada para la cena' },
    { src: '', layout: 'portrait', tone: 'stone', kind: 'Arquitectura',
      caption: 'Arcos, piedra y sombra',
      alt: 'Detalle arquitectónico de arcos de piedra con luz rasante' },
    { src: '', layout: 'square', tone: 'berry', kind: 'Postre',
      caption: 'Panna cotta y frutos rojos',
      alt: 'Panna cotta con compota de frutos rojos en plato de cerámica' },
    { src: '', layout: 'landscape', tone: 'wine', kind: 'Vino',
      caption: 'Tinto servido en la mesa',
      alt: 'Copas de vino tinto sobre la mesa a la luz de las velas' },
    { src: '', layout: 'portrait', tone: 'ember', kind: 'Cocina',
      caption: 'Fuego, sartén y oficio',
      alt: 'Cocinero salteando pasta en una sartén sobre el fuego' }
  ],

  /* Experiencias: propuestas de ejemplo. confirmed: false muestra un aviso
     de «sujeto a confirmación» hasta que el propietario valide el servicio. */
  experiences: {
    confirmed: false,
    items: [
      { image: 'exp-romantic', title: 'Cenas románticas',
        description: 'Una mesa tranquila, luz baja y un menú pensado para dos. Coordinamos contigo los detalles de la velada.' },
      { image: 'exp-private', title: 'Celebraciones privadas',
        description: 'Cumpleaños, aniversarios o encuentros familiares, con un menú a medida y un espacio reservado para tu grupo.' },
      { image: 'exp-special', title: 'Experiencias gastronómicas',
        description: 'Cenas de autor, maridajes y encuentros alrededor de la pasta hecha a mano. Escríbenos para conocer las próximas fechas.' }
    ]
  }
};
