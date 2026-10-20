/*
 * CREMA & GRANO · Configuración del negocio
 * ------------------------------------------------------------
 * Este es el único archivo que necesitas tocar para dejar el sitio con
 * tus datos reales. Lo que queda vacío ("") no se inventa: el sitio lo
 * muestra como «por confirmar» y desactiva el botón correspondiente.
 *
 * La carta y los precios están en datos-menu.js; el equipo, en datos-equipo.js.
 */
window.CG_CONFIG = {
  marca: {
    nombre: 'CREMA & GRANO',
    eslogan: 'Un pequeño momento, una gran taza',
  },

  // true = muestra etiquetas «Ejemplo» y avisos para quien edita el sitio.
  // Pásalo a false cuando todos los datos sean reales.
  demo: true,

  moneda: { locale: 'es-CL', codigo: 'CLP' },
  zonaHoraria: 'America/Santiago',

  contacto: {
    whatsapp: '',        // solo números, con código de país. Ej.: '56912345678'
    whatsappMensaje: 'Hola, CREMA & GRANO. Quiero hacer una consulta.',
    instagram: '',       // usuario sin @. Ej.: 'cremaygrano'
    email: '',           // Ej.: 'hola@cremaygrano.cl'
    telefono: '',        // Ej.: '+56 2 2345 6789'
  },

  ubicacion: {
    direccion: '',       // Ej.: 'Av. Ejemplo 1234, local 5'
    comuna: '',          // Ej.: 'Providencia'
    ciudad: 'Santiago',
    pais: 'Chile',
    referencia: '',      // Ej.: 'A una cuadra del metro'
    googleMapsUrl: '',   // Opcional: enlace «Compartir» de tu ficha en Google Maps
    mapaEmbedUrl: '',    // Opcional: el src del iframe de «Insertar un mapa»
  },

  // Horario de EJEMPLO. dias: 0 = domingo, 1 = lunes … 6 = sábado.
  horario: [
    { dias: [1, 2, 3, 4, 5], abre: '08:00', cierra: '20:00' },
    { dias: [6], abre: '09:00', cierra: '20:00' },
    { dias: [0], abre: '10:00', cierra: '18:00' },
  ],

  pedidos: {
    // Con un WhatsApp configurado, cada producto muestra «Pedir» y abre el chat
    // con el nombre del producto ya escrito.
    porWhatsapp: true,
  },

  reservas: {
    // URL que recibe la reserva por POST en formato JSON (Formspree, Google Apps
    // Script, tu propia API…). Mientras esté vacía, el formulario valida los datos
    // pero NO envía ni confirma nada. Ver README.md → «Conectar formularios».
    endpoint: '',
    maxPersonas: 12,
    intervaloMinutos: 30,
    diasDeAnticipacion: 60,
    ultimaReservaAntesDelCierre: 60, // minutos
  },

  formularioContacto: {
    // Igual que reservas. Si está vacío pero hay email, el formulario abre tu
    // programa de correo con el mensaje escrito.
    endpoint: '',
  },

  mascota: {
    // Para usar la tazita oficial, reemplaza este archivo por tu imagen
    // (PNG con fondo transparente). No hace falta tocar nada más.
    imagen: 'assets/img/mascota/tazita.png',
    alt: 'Tazita, la mascota de CREMA & GRANO',
    // Dónde está la superficie del café dentro de la imagen, en %:
    // centro (x, y) y tamaño (ancho, alto). Sirve para la capa animada del café.
    // Abre el sitio con #ajustar-mascota al final de la URL para verla marcada.
    boca: { x: 48.7, y: 13.95, ancho: 62.6, alto: 15.1 },
    capaLiquido: true,   // false si tu ilustración no muestra el café por arriba
    asomarse: 0.3,       // parte inferior de la tazita que queda tras el logotipo
  },
};
