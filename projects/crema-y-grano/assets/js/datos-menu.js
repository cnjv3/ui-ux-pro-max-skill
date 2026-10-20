/*
 * CREMA & GRANO · Carta, precios, combos y promociones
 * ------------------------------------------------------------
 * DATOS DE DEMOSTRACIÓN: productos, descripciones y precios son de ejemplo.
 * Cambia lo que quieras aquí y el sitio se actualiza solo: la carta, la lista
 * de precios, los combos y las promociones salen de este archivo.
 *
 * precio: número en pesos chilenos, sin puntos (3500 se muestra como $3.500).
 * imagen: ruta a la foto (720 × 540 px, formato 4:3, idealmente .webp).
 * Para quitar un producto, borra su bloque { … }. Para agregar uno, copia otro.
 *
 * mascota y burbuja: cómo reacciona la tazita al elegir cada categoría.
 *   mascota: 'espresso' | 'leche' | 'especial' | 'frio' | 'te' | 'dulce' | 'desayuno'
 */
window.CG_MENU = {
  categorias: [
    {
      id: 'clasicos',
      nombre: 'Espresso y café clásico',
      corto: 'Clásicos',
      bajada: 'Café puro, sin rodeos. La base de todo lo que preparamos.',
      mascota: 'espresso',
      burbuja: '¡Un espresso al tiro!',
      productos: [
        { id: 'espresso', nombre: 'Espresso', precio: 2200, imagen: 'assets/img/menu/espresso.webp', alt: 'Espresso con crema dorada en taza blanca',
          descripcion: 'Un shot corto e intenso, con su crema dorada encima.' },
        { id: 'doble-espresso', nombre: 'Doble espresso', precio: 2900, imagen: 'assets/img/menu/doble-espresso.webp', alt: 'Dos tazas de espresso vistas desde arriba sobre una mesa de madera',
          descripcion: 'Doble carga de café para cuando el día lo pide.' },
        { id: 'americano', nombre: 'Americano', precio: 2600, imagen: 'assets/img/menu/americano.webp', alt: 'Taza de café negro sobre su plato, con cuchara',
          descripcion: 'Espresso alargado con agua caliente: suave y de taza larga.' },
        { id: 'cortado', nombre: 'Cortado', precio: 2700, imagen: 'assets/img/menu/cortado.webp', alt: 'Cortado en vaso de vidrio con dibujo de espuma',
          descripcion: 'Espresso «cortado» con un toque de leche vaporizada.' },
      ],
    },
    {
      id: 'con-leche',
      nombre: 'Cafés con leche',
      corto: 'Con leche',
      bajada: 'Espresso y leche cremosa en distintas proporciones.',
      mascota: 'leche',
      burbuja: 'Con harta espumita, porfa',
      productos: [
        { id: 'cappuccino', nombre: 'Cappuccino', precio: 3400, imagen: 'assets/img/menu/cappuccino.webp', alt: 'Cappuccino con espuma alta y cacao espolvoreado',
          descripcion: 'Espresso, leche vaporizada y una nube de espuma con cacao.' },
        { id: 'cafe-latte', nombre: 'Café latte', precio: 3500, imagen: 'assets/img/menu/cafe-latte.webp', alt: 'Café latte con dibujo de hoja en la espuma',
          descripcion: 'Más leche y más suavidad, con arte latte en la espuma.' },
        { id: 'flat-white', nombre: 'Flat white', precio: 3600, imagen: 'assets/img/menu/flat-white.webp', alt: 'Flat white en taza blanca con corazón de espuma',
          descripcion: 'Doble ristretto y leche microespumada de textura sedosa.' },
        { id: 'latte-macchiato', nombre: 'Latte macchiato', precio: 3600, imagen: 'assets/img/menu/latte-macchiato.webp', alt: 'Latte macchiato en vaso, con capas de leche, café y espuma',
          descripcion: 'Leche vaporizada «manchada» con espresso, servida en capas.' },
      ],
    },
    {
      id: 'especiales',
      nombre: 'Cafés especiales',
      corto: 'Especiales',
      bajada: 'Para darse un gusto: chocolate, caramelo y vainilla.',
      mascota: 'especial',
      burbuja: 'Hoy me doy un gustito',
      productos: [
        { id: 'mocha', nombre: 'Mocha', precio: 3900, imagen: 'assets/img/menu/mocha.webp', alt: 'Mocha con crema y espiral de salsa de chocolate',
          descripcion: 'Espresso, chocolate y leche, con crema y salsa de cacao.' },
        { id: 'caramel-latte', nombre: 'Caramel latte', precio: 3900, imagen: 'assets/img/menu/caramel-latte.webp', alt: 'Latte en vaso con hilos de salsa de caramelo encima',
          descripcion: 'Latte con salsa de caramelo y un hilo de caramelo arriba.' },
        { id: 'vainilla-latte', nombre: 'Vainilla latte', precio: 3800, imagen: 'assets/img/menu/vainilla-latte.webp', alt: 'Café con leche coronado con crema y canela',
          descripcion: 'Latte con jarabe de vainilla y canela espolvoreada.' },
        { id: 'chocolate-espresso', nombre: 'Chocolate espresso', precio: 3500, imagen: 'assets/img/menu/chocolate-espresso.webp', alt: 'Espresso con chocolate en taza oscura sobre plato blanco',
          descripcion: 'Espresso con chocolate amargo fundido. Corto e intenso.' },
      ],
    },
    {
      id: 'frios',
      nombre: 'Cafés fríos',
      corto: 'Fríos',
      bajada: 'Con hielo y sin apuro, para los días de calor.',
      mascota: 'frio',
      burbuja: '¡Bien heladito!',
      productos: [
        { id: 'iced-latte', nombre: 'Iced latte', precio: 3800, imagen: 'assets/img/menu/iced-latte.webp', alt: 'Café frío con hielo en vaso junto a un café con leche',
          descripcion: 'Espresso, leche fría y mucho hielo.' },
        { id: 'cold-brew', nombre: 'Cold brew', precio: 3900, imagen: 'assets/img/menu/cold-brew.webp', alt: 'Vaso de café negro con hielo y bombilla',
          descripcion: 'Café extraído en frío durante horas: suave y sin amargor.' },
        { id: 'iced-mocha', nombre: 'Iced mocha', precio: 4200, imagen: 'assets/img/menu/iced-mocha.webp', alt: 'Mocha helado en copa alta con crema batida y cereza',
          descripcion: 'Chocolate, espresso y leche fría, con crema batida.' },
        { id: 'caramelo-frio', nombre: 'Café con caramelo frío', precio: 4200, imagen: 'assets/img/menu/caramelo-frio.webp', alt: 'Café helado con leche y hielo en vaso de vidrio',
          descripcion: 'Café helado con leche y salsa de caramelo.' },
      ],
    },
    {
      id: 'tes',
      nombre: 'Tés e infusiones',
      corto: 'Tés',
      bajada: 'Hebras e infusiones para una pausa más tranquila.',
      mascota: 'te',
      burbuja: 'Una tacita de té',
      productos: [
        { id: 'te-negro', nombre: 'Té negro', precio: 2200, imagen: 'assets/img/menu/te-negro.webp', alt: 'Té negro sirviéndose desde una tetera en taza blanca con limón',
          descripcion: 'En hebras, con limón o un chorrito de leche.' },
        { id: 'te-verde', nombre: 'Té verde', precio: 2200, imagen: 'assets/img/menu/te-verde.webp', alt: 'Taza de té verde junto a una tetera blanca y azul',
          descripcion: 'Suave y fragante, de infusión corta.' },
        { id: 'manzanilla', nombre: 'Manzanilla', precio: 2000, imagen: 'assets/img/menu/manzanilla.webp', alt: 'Infusión clara en taza blanca con un pocillo de miel',
          descripcion: 'Infusión de manzanilla con un toque de miel.' },
        { id: 'chai-latte', nombre: 'Chai latte', precio: 3600, imagen: 'assets/img/menu/chai-latte.webp', alt: 'Vasos de chai con leche, canela y anís estrellado',
          descripcion: 'Té negro especiado con canela, cardamomo y leche.' },
      ],
    },
    {
      id: 'pasteleria',
      nombre: 'Pastelería y bollería',
      corto: 'Pastelería',
      bajada: 'Lo dulce que acompaña a la taza.',
      mascota: 'dulce',
      burbuja: '¿Y algo dulce?',
      productos: [
        { id: 'croissant', nombre: 'Croissant', precio: 2500, imagen: 'assets/img/menu/croissant.webp', alt: 'Cuatro croissants dorados',
          descripcion: 'Hojaldrado y de mantequilla, crujiente por fuera.' },
        { id: 'brownie', nombre: 'Brownie de chocolate', precio: 2800, imagen: 'assets/img/menu/brownie.webp', alt: 'Dos trozos de brownie de chocolate en un plato',
          descripcion: 'Húmedo por dentro, con costra crujiente.' },
        { id: 'cheesecake', nombre: 'Cheesecake', precio: 3900, imagen: 'assets/img/menu/cheesecake.webp', alt: 'Porción de cheesecake con arándanos',
          descripcion: 'Cremoso, sobre base de galleta y con berries.' },
        { id: 'muffin', nombre: 'Muffin', precio: 2600, imagen: 'assets/img/menu/muffin.webp', alt: 'Muffin con crumble de avena junto a una taza de café',
          descripcion: 'Esponjoso, con crumble de avena. Pregunta el sabor del día.' },
        { id: 'galletas', nombre: 'Galletas artesanales', precio: 1800, imagen: 'assets/img/menu/galletas.webp', alt: 'Galletas con chips de chocolate apiladas con papel mantequilla',
          descripcion: 'Con chips de chocolate, blanditas al centro.' },
      ],
    },
    {
      id: 'desayunos',
      nombre: 'Desayunos y acompañamientos',
      corto: 'Desayunos',
      bajada: 'Para empezar el día (o la once) con algo rico.',
      mascota: 'desayuno',
      burbuja: '¡A desayunar!',
      productos: [
        { id: 'tostadas-palta', nombre: 'Tostadas con palta', precio: 4500, imagen: 'assets/img/menu/tostadas-palta.webp', alt: 'Tostada con palta, huevo pochado y tocino',
          descripcion: 'Pan tostado con palta, huevo pochado y tocino crocante.' },
        { id: 'sandwich-queso', nombre: 'Sándwich de queso', precio: 3900, imagen: 'assets/img/menu/sandwich-queso.webp', alt: 'Sándwich caliente de queso derretido y jamón',
          descripcion: 'Pan tostado con queso derretido. Agrega jamón si quieres.' },
        { id: 'tostadas-mermelada', nombre: 'Tostadas con mermelada', precio: 3200, imagen: 'assets/img/menu/tostadas-mermelada.webp', alt: 'Tostada con mermelada roja en un plato',
          descripcion: 'Pan tostado, mantequilla y mermelada casera.' },
        { id: 'combo-cafe-bolleria', nombre: 'Combo de café y bollería', precio: 4500, imagen: 'assets/img/menu/combo-cafe-bolleria.webp', alt: 'Café con leche junto a un croissant en un plato',
          descripcion: 'Un café latte o americano con un croissant.' },
      ],
    },
  ],

  // Combos de desayuno. «incluye» usa los id de los productos de arriba: el sitio
  // suma sus precios y muestra cuánto se ahorra.
  combos: [
    { id: 'clasico', nombre: 'Desayuno clásico', incluye: ['americano', 'tostadas-mermelada'], precio: 5200,
      nota: 'Todos los días hasta las 12:00.' },
    { id: 'dulce', nombre: 'Desayuno dulce', incluye: ['cappuccino', 'croissant'], precio: 5400,
      nota: 'Cambia el croissant por un muffin sin costo.' },
    { id: 'completo', nombre: 'Desayuno completo', incluye: ['cafe-latte', 'tostadas-palta', 'galletas'], precio: 8900,
      nota: 'El más pedido para empezar con todo.' },
    { id: 'once', nombre: 'Once para dos', incluye: ['flat-white', 'flat-white', 'cheesecake', 'brownie'], precio: 12900,
      nota: 'De lunes a viernes, desde las 16:00.' },
  ],

  // Promociones de café y pastelería.
  promociones: [
    { titulo: 'Café + galleta', detalle: 'Cualquier café clásico con una galleta artesanal.', precio: 3900 },
    { titulo: 'Tarde dulce', detalle: 'De lunes a viernes, entre 16:00 y 18:00: 20 % de descuento en pastelería pidiendo cualquier café.' },
    { titulo: 'Tarjeta de sellos', detalle: 'Junta 9 sellos y el décimo café va por la casa.' },
  ],
};
