/*
 * CREMA & GRANO · Lógica del sitio
 * ------------------------------------------------------------
 * Dibuja la carta, los precios, el equipo, el horario y los canales a partir de
 * config.js, datos-menu.js y datos-equipo.js, y maneja la navegación y los
 * formularios. No inventa integraciones: si un dato o un servicio no está
 * configurado, lo dice y no simula envíos ni confirmaciones.
 */
(function () {
  'use strict';

  var C = window.CG_CONFIG || {};
  var MENU = window.CG_MENU || { categorias: [], combos: [], promociones: [] };
  var TEAM = window.CG_EQUIPO || [];
  var CREDITS = window.CG_CREDITOS || [];
  var CONTACT = C.contacto || {};
  var PLACE = C.ubicacion || {};
  var BOOKING = C.reservas || {};
  var TZ = C.zonaHoraria || 'America/Santiago';
  var DEMO = !!C.demo;
  var DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var MASCOT_SRC = (C.mascota && C.mascota.imagen) || 'assets/img/mascota/tazita.png';

  if (DEMO) document.documentElement.classList.add('is-demo');

  /* Utilidades ----------------------------------------------------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(id) { return '<svg class="icon" aria-hidden="true"><use href="#i-' + id + '"/></svg>'; }
  var money = new Intl.NumberFormat((C.moneda && C.moneda.locale) || 'es-CL', {
    style: 'currency', currency: (C.moneda && C.moneda.codigo) || 'CLP', maximumFractionDigits: 0,
  });
  function price(n) { return money.format(n || 0).replace(/\s/g, ''); }
  function digits(s) { return String(s || '').replace(/\D/g, ''); }
  function waLink(text) {
    var n = digits(CONTACT.whatsapp);
    return n ? 'https://wa.me/' + n + '?text=' + encodeURIComponent(text || CONTACT.whatsappMensaje || '') : '';
  }
  function mailLink(subject, body) {
    return CONTACT.email ? 'mailto:' + CONTACT.email + '?subject=' + encodeURIComponent(subject || '') + '&body=' + encodeURIComponent(body || '') : '';
  }
  function igLink() {
    var u = String(CONTACT.instagram || '').replace(/^@/, '').trim();
    return u ? 'https://www.instagram.com/' + encodeURIComponent(u) + '/' : '';
  }
  function prettyPhone(n) {
    var d = digits(n);
    if (/^569\d{8}$/.test(d)) return '+56 9 ' + d.slice(3, 7) + ' ' + d.slice(7);
    return d ? '+' + d : '';
  }
  function fullAddress() {
    return [PLACE.direccion, PLACE.comuna, PLACE.ciudad, PLACE.pais].filter(Boolean).join(', ');
  }

  var toastEl = $('[data-toast]'), toastTimer = 0;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 4600);
  }

  /* Horario -------------------------------------------------------------- */
  function toMin(hhmm) { var p = String(hhmm).split(':'); return (+p[0]) * 60 + (+p[1] || 0); }
  function hoursFor(day) {
    var list = C.horario || [];
    for (var i = 0; i < list.length; i++) if (list[i].dias.indexOf(day) !== -1) return list[i];
    return null;
  }
  function nowHere() {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: TZ, weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(new Date());
    var get = function (t) { for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value; return ''; };
    var h = +get('hour') % 24;
    return {
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')),
      minutes: h * 60 + (+get('minute')),
      ymd: get('year') + '-' + get('month') + '-' + get('day'),
    };
  }
  function openStatus() {
    var n = nowHere(), h = hoursFor(n.day);
    if (h && n.minutes >= toMin(h.abre) && n.minutes < toMin(h.cierra)) {
      return { open: true, text: 'Abierto ahora · cerramos a las ' + h.cierra };
    }
    if (h && n.minutes < toMin(h.abre)) return { open: false, text: 'Cerrado ahora · abrimos hoy a las ' + h.abre };
    for (var k = 1; k <= 7; k++) {
      var d = (n.day + k) % 7, hh = hoursFor(d);
      if (hh) return { open: false, text: 'Cerrado ahora · abrimos ' + (k === 1 ? 'mañana' : 'el ' + DAYS[d].toLowerCase()) + ' a las ' + hh.abre };
    }
    return { open: false, text: 'Horario por confirmar' };
  }
  function renderOpenStatus() {
    var s = openStatus();
    $$('[data-open-status]').forEach(function (el) {
      el.dataset.open = String(s.open);
      el.innerHTML = esc(s.text) + (DEMO ? ' <span class="chip">horario de ejemplo</span>' : '');
    });
  }
  function renderHours() {
    var table = $('[data-hours]');
    if (!table) return;
    var today = nowHere().day;
    var order = [1, 2, 3, 4, 5, 6, 0];
    table.innerHTML = '<caption class="visually-hidden">Horario por día</caption><tbody>' + order.map(function (d) {
      var h = hoursFor(d);
      return '<tr' + (d === today ? ' class="is-today"' : '') + '><th scope="row">' + DAYS[d] +
        (d === today ? ' <span class="visually-hidden">(hoy)</span>' : '') + '</th><td>' +
        (h ? h.abre + ' – ' + h.cierra : 'Cerrado') + '</td></tr>';
    }).join('') + '</tbody>';
  }
  function todayHoursText() {
    var h = hoursFor(nowHere().day);
    return h ? 'Hoy de ' + h.abre + ' a ' + h.cierra : 'Hoy cerrado';
  }

  /* Carta ---------------------------------------------------------------- */
  var productsById = {};
  MENU.categorias.forEach(function (c) { c.productos.forEach(function (p) { productsById[p.id] = p; }); });

  function orderButton(p) {
    var label = 'Pedir ' + p.nombre + (CONTACT.whatsapp ? ' por WhatsApp' : '');
    if (CONTACT.whatsapp && (!C.pedidos || C.pedidos.porWhatsapp !== false)) {
      var msg = 'Hola, CREMA & GRANO. Quiero pedir: ' + p.nombre + ' (' + price(p.precio) + ').';
      return '<a class="product__order" href="' + esc(waLink(msg)) + '" target="_blank" rel="noopener" aria-label="' + esc(label) + '">Pedir ' + icon('whatsapp') + '</a>';
    }
    if (DEMO) {
      return '<button class="product__order" type="button" data-demo-order aria-label="' + esc(label) + '">Pedir ' + icon('arrow-right') + '</button>';
    }
    return '';
  }

  function renderMenu() {
    var tabs = $('[data-menu-tabs]'), panels = $('[data-menu-panels]');
    if (!tabs || !panels || !MENU.categorias.length) return;
    tabs.innerHTML = MENU.categorias.map(function (c, i) {
      return '<button class="menu-tab" type="button" role="tab" id="tab-' + c.id + '" aria-controls="panel-' + c.id +
        '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-cat="' + c.id + '">' +
        esc(c.corto || c.nombre) + '</button>';
    }).join('');
    panels.innerHTML = MENU.categorias.map(function (c, i) {
      return '<div class="menu-panel" role="tabpanel" id="panel-' + c.id + '" aria-labelledby="tab-' + c.id + '" tabindex="0"' + (i ? ' hidden' : '') + '>' +
        '<div class="menu-panel__head"><h3 class="menu-panel__title">' + esc(c.nombre) + '</h3>' +
        (c.bajada ? '<p class="menu-panel__lead">' + esc(c.bajada) + '</p>' : '') + '</div>' +
        '<ul class="product-grid">' + c.productos.map(function (p, j) {
          return '<li class="product" style="--i:' + j + '">' +
            '<div class="product__media"><img src="' + esc(p.imagen) + '" alt="' + esc(p.alt || p.nombre) + '" width="720" height="540" loading="lazy" decoding="async"></div>' +
            '<div class="product__body"><div class="product__top"><h4 class="product__name">' + esc(p.nombre) + '</h4>' +
            '<span class="product__price">' + price(p.precio) + '</span></div>' +
            '<p class="product__desc">' + esc(p.descripcion) + '</p>' + orderButton(p) + '</div></li>';
        }).join('') + '</ul></div>';
    }).join('');

    tabs.addEventListener('click', function (e) {
      var t = e.target.closest('[role="tab"]');
      if (t) selectTab(t, true);
    });
    tabs.addEventListener('keydown', function (e) {
      var all = $$('[role="tab"]', tabs), i = all.indexOf(document.activeElement);
      if (i < 0) return;
      var next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: all.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      next = (next + all.length) % all.length;
      all[next].focus();
      selectTab(all[next], true);
    });
    panels.addEventListener('click', function (e) {
      if (e.target.closest('[data-demo-order]')) {
        toast('Los pedidos se activan al agregar el WhatsApp del local en assets/js/config.js.');
      }
    });
  }

  function selectTab(tab, userAction) {
    var tabs = tab.parentElement;
    var cat = null;
    MENU.categorias.forEach(function (c) { if (c.id === tab.dataset.cat) cat = c; });
    if (!cat || tab.getAttribute('aria-selected') === 'true') return;
    $$('[role="tab"]', tabs).forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    var panel = document.getElementById(tab.getAttribute('aria-controls'));
    $$('.menu-panel', panel.parentElement).forEach(function (p) { p.hidden = p !== panel; p.classList.remove('is-entering'); });
    void panel.offsetWidth;
    panel.classList.add('is-entering');
    // Mantener visible la pestaña elegida en la tira desplazable (móvil).
    var left = tab.offsetLeft - (tabs.clientWidth - tab.offsetWidth) / 2;
    if (tabs.scrollWidth > tabs.clientWidth) tabs.scrollTo({ left: left, behavior: 'smooth' });
    if (userAction) {
      var head = panel.getBoundingClientRect().top;
      var limit = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 68) + tabs.offsetHeight;
      if (head < limit) window.scrollBy({ top: head - limit - 12, behavior: 'smooth' });
    }
    if (window.CGMascota) window.CGMascota.setMood(cat.mascota, cat.burbuja);
  }

  /* Precios, combos y promociones --------------------------------------- */
  function renderPrices() {
    var list = $('[data-price-list]');
    if (list) {
      list.innerHTML = MENU.categorias.map(function (c) {
        return '<section class="price-group" aria-labelledby="pl-' + c.id + '"><h4 class="price-group__title" id="pl-' + c.id + '">' +
          icon('bean') + esc(c.nombre) + '</h4><ul>' + c.productos.map(function (p) {
            return '<li class="price-row"><span class="price-row__name">' + esc(p.nombre) +
              '</span><span class="price-row__dots" aria-hidden="true"></span><span class="price-row__price">' + price(p.precio) + '</span></li>';
          }).join('') + '</ul></section>';
      }).join('');
    }
    var combos = $('[data-combos]');
    if (combos) {
      combos.innerHTML = (MENU.combos || []).map(function (cb) {
        var items = cb.incluye.map(function (id) { return productsById[id]; }).filter(Boolean);
        var regular = items.reduce(function (s, p) { return s + p.precio; }, 0);
        var counts = {};
        items.forEach(function (p) { counts[p.nombre] = (counts[p.nombre] || 0) + 1; });
        var names = Object.keys(counts).map(function (n) { return (counts[n] > 1 ? counts[n] + ' × ' : '') + n; });
        var save = regular - cb.precio;
        return '<li class="combo"><div class="combo__head"><h4 class="combo__name">' + esc(cb.nombre) +
          '</h4><span class="combo__price">' + price(cb.precio) + '</span></div>' +
          '<p class="combo__items">' + esc(names.join(' + ')) + '</p><div class="combo__foot">' +
          (save > 0 ? '<span class="chip combo__save">Ahorras ' + price(save) + '</span>' : '') +
          (cb.nota ? '<span>' + esc(cb.nota) + '</span>' : '') + '</div></li>';
      }).join('');
    }
    var promos = $('[data-promos]');
    if (promos) {
      promos.innerHTML = (MENU.promociones || []).map(function (p) {
        return '<li class="promo"><span class="promo__icon" aria-hidden="true">' + icon('bean') + '</span>' +
          '<h4 class="promo__title">' + esc(p.titulo) + '</h4><p class="promo__detail">' + esc(p.detalle) + '</p>' +
          (p.precio ? '<span class="promo__price">' + price(p.precio) + '</span>' : '') +
          (DEMO ? '<span class="chip">Promoción de ejemplo</span>' : '') + '</li>';
      }).join('');
    }
  }

  /* Equipo --------------------------------------------------------------- */
  function renderTeam() {
    var list = $('[data-team]');
    if (!list) return;
    list.innerHTML = TEAM.map(function (m, i) {
      var photo = m.foto
        ? '<img src="' + esc(m.foto) + '" alt="' + esc(m.nombre + ', ' + m.cargo) + '" width="640" height="800" loading="lazy" decoding="async">'
        : '<span class="member__initial" aria-hidden="true">' + esc(String(m.nombre || '?').trim().charAt(0)) + '</span>' +
          '<span class="member__badge"><img src="' + esc(MASCOT_SRC) + '" alt="" width="26" height="23">Foto por agregar</span>';
      return '<li class="member" data-reveal style="--reveal-delay:' + (i * 90) + 'ms"><div class="member__photo">' + photo + '</div>' +
        '<div class="member__body"><h3 class="member__name">' + esc(m.nombre) + '</h3><p class="member__role">' + esc(m.cargo) + '</p>' +
        '<p class="member__desc">' + esc(m.descripcion) + '</p>' + (m.ejemplo ? '<span class="chip">Perfil de ejemplo</span>' : '') + '</div></li>';
    }).join('');
  }

  /* Ubicación ------------------------------------------------------------ */
  var MAP_ART = '' +
    '<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<rect width="800" height="600" fill="#DCC2A1"/>' +
      '<g fill="#E9D6BB">' +
        '<rect x="-20" y="-20" width="230" height="170" rx="18"/><rect x="250" y="-20" width="200" height="170" rx="18"/>' +
        '<rect x="490" y="-20" width="330" height="170" rx="18"/><rect x="-20" y="190" width="230" height="190" rx="18"/>' +
        '<rect x="490" y="190" width="160" height="190" rx="18"/><rect x="690" y="190" width="130" height="190" rx="18"/>' +
        '<rect x="-20" y="420" width="230" height="200" rx="18"/><rect x="250" y="420" width="200" height="200" rx="18"/>' +
        '<rect x="490" y="420" width="330" height="200" rx="18"/></g>' +
      '<rect x="250" y="190" width="200" height="190" rx="18" fill="#F5E8D3"/>' +
      '<g fill="#B98250" opacity="0.35"><circle cx="300" cy="240" r="16"/><circle cx="352" cy="300" r="20"/><circle cx="410" cy="246" r="14"/><circle cx="296" cy="336" r="12"/></g>' +
      '<g stroke="#FFF7EA" stroke-width="26" stroke-linecap="round" fill="none">' +
        '<path d="M0 170H800M0 400H800M230 0V600M470 0V600"/><path d="M670 170V400" stroke-width="16"/></g>' +
      '<path d="M90 600C120 520 180 470 240 440S420 420 470 400 600 300 640 250" fill="none" stroke="#6B3F2A" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round"/>' +
    '</svg>';

  function renderLocation() {
    var hasAddress = !!PLACE.direccion;
    var addr = $('[data-address]');
    if (addr) {
      var line2 = [PLACE.comuna, PLACE.ciudad].filter(Boolean).join(', ');
      addr.innerHTML = hasAddress
        ? '<strong>' + esc(PLACE.direccion) + '</strong>' + (line2 ? '<span>' + esc(line2) + '</span>' : '') +
          (PLACE.referencia ? '<span>' + esc(PLACE.referencia) + '</span>' : '')
        : '<strong>Dirección por confirmar</strong><span>' + esc([PLACE.ciudad, PLACE.pais].filter(Boolean).join(', ')) + '</span>' +
          (DEMO ? '<span class="chip">Agrega la dirección real en config.js</span>' : '');
    }

    var map = $('[data-map]');
    if (map) {
      var src = PLACE.mapaEmbedUrl || (hasAddress ? 'https://www.google.com/maps?q=' + encodeURIComponent(fullAddress()) + '&output=embed' : '');
      map.innerHTML = src
        ? '<iframe title="Mapa con la ubicación de CREMA & GRANO" src="' + esc(src) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>'
        : '<div class="map-placeholder" role="img" aria-label="Ilustración de mapa: la ubicación se mostrará al configurar la dirección">' + MAP_ART +
          '<span class="map-placeholder__pin"><img src="' + esc(MASCOT_SRC) + '" alt="" width="124" height="109"></span>' +
          '<p class="map-placeholder__note">El mapa aparecerá aquí en cuanto se configure la dirección del local.</p></div>';
    }

    var actions = $('[data-location-actions]');
    if (actions) {
      if (hasAddress) {
        var q = encodeURIComponent(fullAddress());
        actions.innerHTML =
          '<a class="btn btn--primary" href="https://www.google.com/maps/dir/?api=1&destination=' + q + '" target="_blank" rel="noopener">Cómo llegar ' + icon('arrow-right') + '</a>' +
          '<a class="btn btn--ghost" href="' + esc(PLACE.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=' + q) + '" target="_blank" rel="noopener">Ver en Google Maps ' + icon('external') + '</a>';
      } else {
        actions.innerHTML =
          '<a class="btn btn--primary" aria-disabled="true" role="link" data-pending="dirección">Cómo llegar ' + icon('arrow-right') + '</a>' +
          '<a class="btn btn--ghost" aria-disabled="true" role="link" data-pending="dirección">Ver en Google Maps ' + icon('external') + '</a>' +
          '<p class="hint">Los botones se activan al configurar la dirección real del local.</p>';
      }
    }
  }

  /* Contacto y pie de página -------------------------------------------- */
  function channel(opts) {
    var inner = '<span class="channel__icon">' + icon(opts.icon) + '</span><span class="channel__text"><span class="channel__label">' +
      esc(opts.label) + '</span><span class="channel__value">' + esc(opts.value) + '</span></span>';
    if (opts.href) {
      var ext = /^https?:/.test(opts.href);
      return '<li><a class="channel ' + (opts.cls || '') + '" href="' + esc(opts.href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' +
        inner + '<span class="channel__go">' + icon('arrow-right') + '</span></a></li>';
    }
    return '<li><div class="channel is-pending ' + (opts.cls || '') + '">' + inner +
      (DEMO && opts.pending ? '<span class="chip">' + esc(opts.pending) + '</span>' : '') + '</div></li>';
  }

  function renderContact() {
    var wa = waLink();
    var ig = igLink();
    var list = $('[data-channels]');
    if (list) {
      list.innerHTML = [
        channel({ icon: 'whatsapp', label: 'WhatsApp', cls: 'channel--whatsapp', href: wa,
          value: wa ? 'Escríbenos al ' + prettyPhone(CONTACT.whatsapp) : 'Número por configurar', pending: 'Por configurar' }),
        channel({ icon: 'instagram', label: 'Instagram', href: ig,
          value: ig ? '@' + String(CONTACT.instagram).replace(/^@/, '') : 'Cuenta por configurar', pending: 'Por configurar' }),
        channel({ icon: 'mail', label: 'Correo', href: CONTACT.email ? 'mailto:' + CONTACT.email : '',
          value: CONTACT.email || 'Correo por configurar', pending: 'Por configurar' }),
        CONTACT.telefono || DEMO ? channel({ icon: 'phone', label: 'Teléfono', href: CONTACT.telefono ? 'tel:' + CONTACT.telefono.replace(/[^\d+]/g, '') : '',
          value: CONTACT.telefono || 'Teléfono por configurar', pending: 'Por configurar' }) : '',
        channel({ icon: 'pin', label: 'Dirección', href: '#ubicacion',
          value: PLACE.direccion ? [PLACE.direccion, PLACE.comuna].filter(Boolean).join(', ') : 'Por confirmar · ver ubicación' }),
        channel({ icon: 'clock', label: 'Horario', href: '#ubicacion', value: todayHoursText() + ' · ver todos los días' }),
      ].join('');
    }

    var visit = $('[data-footer-visit]');
    if (visit) {
      var rows = (C.horario || []).map(function (h) {
        var d = h.dias.slice().sort(function (a, b) { return ((a + 6) % 7) - ((b + 6) % 7); });
        var label = d.length > 2 ? DAYS[d[0]] + ' a ' + DAYS[d[d.length - 1]].toLowerCase() : d.map(function (x) { return DAYS[x]; }).join(' y ');
        return '<span>' + esc(label) + ': ' + h.abre + '–' + h.cierra + '</span>';
      });
      visit.innerHTML = '<p><strong>' + esc(PLACE.direccion || 'Dirección por confirmar') + '</strong><br>' +
        esc([PLACE.comuna, PLACE.ciudad].filter(Boolean).join(', ')) + '</p><p>' + rows.join('<br>') + '</p>';
    }
    var fc = $('[data-footer-contact]');
    if (fc) {
      var items = [];
      if (CONTACT.telefono) items.push('<li>' + icon('phone') + '<a href="tel:' + esc(CONTACT.telefono.replace(/[^\d+]/g, '')) + '">' + esc(CONTACT.telefono) + '</a></li>');
      if (CONTACT.email) items.push('<li>' + icon('mail') + '<a href="mailto:' + esc(CONTACT.email) + '">' + esc(CONTACT.email) + '</a></li>');
      if (wa) items.push('<li>' + icon('whatsapp') + '<a href="' + esc(wa) + '" target="_blank" rel="noopener">WhatsApp</a></li>');
      if (!items.length) items.push('<li>' + icon('mail') + '<span>Datos de contacto por configurar</span></li>');
      items.push('<li>' + icon('calendar') + '<a href="#reservas">Reservar una mesa</a></li>');
      fc.innerHTML = items.join('');
    }
    var social = $('[data-footer-social]');
    if (social) {
      var s = function (href, id, label) {
        return href
          ? '<a class="social-btn" href="' + esc(href) + '" target="_blank" rel="noopener" aria-label="' + label + '">' + icon(id) + '</a>'
          : '<span class="social-btn is-pending" role="img" aria-label="' + label + ' (por configurar)" title="Por configurar">' + icon(id) + '</span>';
      };
      social.innerHTML = s(ig, 'instagram', 'Instagram') + s(wa, 'whatsapp', 'WhatsApp');
    }
  }

  /* Créditos ------------------------------------------------------------- */
  function renderCredits() {
    var dlg = $('#creditos'), list = $('[data-credits]');
    if (!dlg || !list) return;
    list.innerHTML = CREDITS.map(function (c) {
      return '<li><img src="' + esc(c.archivo) + '" alt="" width="64" height="48" loading="lazy" decoding="async"><span>«' + esc(c.titulo) + '», de ' +
        '<a href="' + esc(c.autorUrl) + '" target="_blank" rel="noopener">' + esc(c.autor) + '</a> · ' +
        '<a href="' + esc(c.licenciaUrl) + '" target="_blank" rel="noopener">' + esc(c.licencia) + '</a> · ' +
        '<a href="' + esc(c.fuente) + '" target="_blank" rel="noopener">original</a></span></li>';
    }).join('');
    $('[data-open-credits]').addEventListener('click', function () {
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    });
    $('[data-close-credits]').addEventListener('click', function () { dlg.close ? dlg.close() : dlg.removeAttribute('open'); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg && dlg.close) dlg.close(); });
  }

  /* Formularios ---------------------------------------------------------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validContact(v) {
    var t = v.trim();
    if (!t) return false;
    if (EMAIL.test(t)) return true;
    var d = digits(t);
    if (/^[+\d\s().-]+$/.test(t) && d.length >= 8 && d.length <= 15) return true;
    return /^@?[A-Za-z0-9._]{2,30}$/.test(t) && /[A-Za-z]/.test(t);
  }

  function setError(form, name, msg) {
    var field = form.elements[name];
    var box = form.querySelector('[data-error-for="' + name + '"]');
    if (field) field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (box) { box.textContent = msg || ''; box.classList.toggle('is-visible', !!msg); }
  }

  function wireForm(form, rules, onValid) {
    var touched = {};
    function check(name) {
      var msg = rules[name] ? rules[name](form.elements[name].value, form) : '';
      setError(form, name, msg);
      return msg;
    }
    Object.keys(rules).forEach(function (name) {
      var f = form.elements[name];
      if (!f) return;
      f.addEventListener('blur', function () { touched[name] = true; check(name); });
      f.addEventListener('input', function () { if (touched[name]) check(name); });
      f.addEventListener('change', function () { if (touched[name]) check(name); });
    });
    $$('[data-count-for]', form).forEach(function (out) {
      var ta = document.getElementById(out.dataset.countFor);
      var upd = function () { out.textContent = ta.value.length + ' / ' + ta.maxLength; };
      ta.addEventListener('input', upd);
      upd();
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errors = [];
      Object.keys(rules).forEach(function (name) {
        touched[name] = true;
        var msg = check(name);
        if (msg) errors.push({ name: name, msg: msg });
      });
      var summary = form.querySelector('[data-error-summary]');
      if (errors.length) {
        summary.innerHTML = '<strong>Revisa ' + (errors.length === 1 ? 'este dato' : 'estos ' + errors.length + ' datos') + ':</strong><ul>' +
          errors.map(function (er) {
            return '<li><a href="#' + form.elements[er.name].id + '">' + esc(er.msg) + '</a></li>';
          }).join('') + '</ul>';
        summary.hidden = false;
        summary.focus();
        status(form, null);
        return;
      }
      summary.hidden = true;
      onValid(form);
    });
    form.addEventListener('click', function (e) {
      var a = e.target.closest('[data-error-summary] a');
      if (a) { e.preventDefault(); var f = document.querySelector(a.getAttribute('href')); if (f) f.focus(); }
    });
  }

  function status(form, html, tone) {
    var box = form.querySelector('[data-form-status]');
    if (!html) { box.hidden = true; box.innerHTML = ''; return; }
    box.dataset.tone = tone || '';
    box.innerHTML = html;
    box.hidden = false;
  }

  function busy(form, on, label) {
    var btn = form.querySelector('[data-submit]');
    var txt = form.querySelector('[data-submit-label]');
    if (!btn.dataset.label) btn.dataset.label = txt.textContent;
    btn.disabled = on;
    btn.setAttribute('aria-busy', String(on));
    txt.textContent = on ? (label || 'Enviando…') : btn.dataset.label;
  }

  function send(endpoint, data) {
    var body = new URLSearchParams();
    Object.keys(data).forEach(function (k) { body.append(k, data[k]); });
    return fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: body }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res;
    });
  }

  function longDate(ymd) {
    var p = ymd.split('-');
    var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], 12));
    return new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(d);
  }
  function addDays(ymd, n) {
    var p = ymd.split('-');
    var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + n, 12));
    return d.toISOString().slice(0, 10);
  }
  function weekday(ymd) {
    var p = ymd.split('-');
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], 12)).getUTCDay();
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function setupBooking() {
    var form = $('[data-booking-form]');
    if (!form) return;
    var max = BOOKING.maxPersonas || 12;
    var step = BOOKING.intervaloMinutos || 30;
    var lastCall = BOOKING.ultimaReservaAntesDelCierre == null ? 60 : BOOKING.ultimaReservaAntesDelCierre;
    var ahead = BOOKING.diasDeAnticipacion || 60;
    var dateIn = form.elements.fecha, hourIn = form.elements.hora, people = form.elements.personas;
    var hint = $('[data-hour-hint]', form);
    var win = $('[data-booking-window]');
    if (win) win.textContent = 'Reservas dentro del horario de atención, hasta ' + ahead + ' días antes.';

    function today() { return nowHere().ymd; }
    dateIn.min = today();
    dateIn.max = addDays(today(), ahead);
    people.max = String(max);

    function slots(ymd) {
      var h = hoursFor(weekday(ymd));
      if (!h) return { closed: true, list: [] };
      var from = toMin(h.abre), to = toMin(h.cierra) - lastCall, list = [];
      var n = nowHere();
      for (var m = from; m <= to; m += step) {
        if (ymd === n.ymd && m < n.minutes + 30) continue;
        list.push(pad(Math.floor(m / 60)) + ':' + pad(m % 60));
      }
      return { closed: false, list: list };
    }
    function fillHours() {
      var v = dateIn.value, prev = hourIn.value;
      if (!v) {
        hourIn.innerHTML = '<option value="">Elige primero la fecha</option>';
        hint.textContent = '';
        return;
      }
      var s = slots(v);
      if (s.closed || !s.list.length) {
        hourIn.innerHTML = '<option value="">Sin horarios disponibles</option>';
        hint.textContent = s.closed ? 'Ese día no abrimos. Prueba con otra fecha.' : 'Ya no quedan horarios para hoy.';
        return;
      }
      hourIn.innerHTML = '<option value="">Elige una hora</option>' + s.list.map(function (t) {
        return '<option value="' + t + '"' + (t === prev ? ' selected' : '') + '>' + t + '</option>';
      }).join('');
      var h = hoursFor(weekday(v));
      hint.textContent = 'Ese día atendemos de ' + h.abre + ' a ' + h.cierra + '.';
    }
    dateIn.addEventListener('change', fillHours);

    $$('[data-step]', form).forEach(function (b) {
      b.addEventListener('click', function () {
        var n = clampInt(+people.value + (+b.dataset.step));
        people.value = String(n);
        people.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    function clampInt(n) { return Math.max(1, Math.min(max, Math.round(n) || 1)); }

    wireForm(form, {
      nombre: function (v) { return v.trim().length < 2 ? 'Escribe tu nombre (al menos 2 letras).' : ''; },
      contacto: function (v) {
        if (!v.trim()) return 'Déjanos un teléfono, correo o Instagram para confirmar tu reserva.';
        return validContact(v) ? '' : 'Revisa el dato: un teléfono (+56 9 1234 5678), un correo o un @usuario.';
      },
      fecha: function (v) {
        if (!v) return 'Elige la fecha de tu reserva.';
        if (v < today()) return 'La fecha ya pasó. Elige hoy o un día posterior.';
        if (v > addDays(today(), ahead)) return 'Tomamos reservas hasta ' + ahead + ' días antes.';
        if (!hoursFor(weekday(v))) return 'Ese día no abrimos. Elige otra fecha.';
        return '';
      },
      hora: function (v) { return v ? '' : (dateIn.value ? 'Elige una de las horas disponibles.' : 'Primero elige la fecha y luego la hora.'); },
      personas: function (v) {
        var n = Number(v);
        if (!v || !Number.isInteger(n) || n < 1) return 'Indica cuántas personas vienen.';
        if (n > max) return 'Para más de ' + max + ' personas, escríbenos y lo coordinamos.';
        return '';
      },
    }, function (f) {
      var data = {
        tipo: 'reserva',
        nombre: f.elements.nombre.value.trim(),
        contacto: f.elements.contacto.value.trim(),
        fecha: f.elements.fecha.value,
        hora: f.elements.hora.value,
        personas: f.elements.personas.value,
        comentarios: f.elements.comentarios.value.trim(),
        enviado: new Date().toISOString(),
      };
      var when = longDate(data.fecha) + ' a las ' + data.hora;
      var people = data.personas + (data.personas === '1' ? ' persona' : ' personas');
      var text = 'Hola, CREMA & GRANO. Quiero reservar una mesa:\n• Nombre: ' + data.nombre + '\n• Contacto: ' + data.contacto +
        '\n• Día y hora: ' + when + '\n• Personas: ' + data.personas + (data.comentarios ? '\n• Comentarios: ' + data.comentarios : '');

      if (BOOKING.endpoint) {
        busy(f, true, 'Enviando solicitud…');
        status(f, null);
        send(BOOKING.endpoint, data).then(function () {
          status(f, '<p class="form-status__title">' + icon('check') + ' ¡Gracias, ' + esc(data.nombre) + '! Recibimos tu solicitud.</p>' +
            '<p>Pediste mesa para ' + esc(people) + ' el ' + esc(when) + '. Te contactaremos a ' + esc(data.contacto) +
            ' para confirmarla: la reserva queda lista cuando te respondamos.</p>', 'ok');
          f.reset();
          fillHours();
        }).catch(function () {
          status(f, '<p class="form-status__title">' + icon('alert') + ' No pudimos enviar tu solicitud.</p>' +
            '<p>Revisa tu conexión e inténtalo de nuevo' + (waLink() ? ', o envíala por WhatsApp.' : '.') + '</p>' +
            (waLink() ? '<div class="form-status__actions"><a class="btn btn--primary btn--sm" href="' + esc(waLink(text)) + '" target="_blank" rel="noopener">Enviar por WhatsApp</a></div>' : ''));
        }).then(function () { busy(f, false); });
        return;
      }

      // Sin sistema de reservas conectado: no se envía ni se confirma nada.
      var alt = [];
      if (waLink()) alt.push('<a class="btn btn--primary btn--sm" href="' + esc(waLink(text)) + '" target="_blank" rel="noopener">' + icon('whatsapp') + ' Enviar la solicitud por WhatsApp</a>');
      if (CONTACT.email) alt.push('<a class="btn btn--ghost btn--sm" href="' + esc(mailLink('Solicitud de reserva · ' + data.nombre, text)) + '">' + icon('mail') + ' Enviar por correo</a>');
      status(f, '<p class="form-status__title">' + icon('alert') + ' Tu solicitud todavía no se ha enviado.</p>' +
        '<p>Los datos están completos, pero las reservas en línea aún no están conectadas: no hemos recibido ni confirmado ninguna reserva.</p>' +
        (alt.length ? '<p>Puedes enviárnosla tú mismo:</p><div class="form-status__actions">' + alt.join('') + '</div>'
          : '<p>Por ahora, reserva escribiéndonos o pasando por el local. <a href="#contacto">Ver contacto</a>.</p>') +
        (DEMO ? '<p>Para activarlas, agrega la URL de tu servicio en <code>assets/js/config.js</code> → <code>reservas.endpoint</code>.</p>' : ''));
    });
  }

  function setupContactForm() {
    var form = $('[data-contact-form]');
    if (!form) return;
    var endpoint = C.formularioContacto && C.formularioContacto.endpoint;
    wireForm(form, {
      nombre: function (v) { return v.trim().length < 2 ? 'Escribe tu nombre (al menos 2 letras).' : ''; },
      contacto: function (v) {
        if (!v.trim()) return 'Déjanos un correo o teléfono para responderte.';
        var t = v.trim(), d = digits(t);
        return EMAIL.test(t) || (/^[+\d\s().-]+$/.test(t) && d.length >= 8 && d.length <= 15) ? '' : 'Escribe un correo válido o un teléfono con al menos 8 dígitos.';
      },
      mensaje: function (v) { return v.trim().length < 10 ? 'Cuéntanos un poco más (al menos 10 caracteres).' : ''; },
    }, function (f) {
      var data = {
        tipo: 'contacto',
        nombre: f.elements.nombre.value.trim(),
        contacto: f.elements.contacto.value.trim(),
        mensaje: f.elements.mensaje.value.trim(),
        enviado: new Date().toISOString(),
      };
      if (endpoint) {
        busy(f, true);
        status(f, null);
        send(endpoint, data).then(function () {
          status(f, '<p class="form-status__title">' + icon('check') + ' ¡Mensaje enviado!</p><p>Gracias, ' + esc(data.nombre) +
            '. Te responderemos a ' + esc(data.contacto) + ' lo antes posible.</p>', 'ok');
          f.reset();
        }).catch(function () {
          status(f, '<p class="form-status__title">' + icon('alert') + ' No pudimos enviar tu mensaje.</p><p>Revisa tu conexión e inténtalo de nuevo' +
            (CONTACT.email ? ', o escríbenos a <a href="mailto:' + esc(CONTACT.email) + '">' + esc(CONTACT.email) + '</a>.' : '.') + '</p>');
        }).then(function () { busy(f, false); });
        return;
      }
      if (CONTACT.email) {
        var body = data.mensaje + '\n\n— ' + data.nombre + ' (' + data.contacto + ')';
        window.location.href = mailLink('Mensaje desde la web · ' + data.nombre, body);
        status(f, '<p class="form-status__title">' + icon('mail') + ' Abrimos tu programa de correo con el mensaje listo.</p>' +
          '<p>Solo falta que lo envíes desde ahí. Si no se abrió, escríbenos a <a href="mailto:' + esc(CONTACT.email) + '">' + esc(CONTACT.email) + '</a>.</p>');
        return;
      }
      status(f, '<p class="form-status__title">' + icon('alert') + ' Tu mensaje no se ha enviado.</p>' +
        '<p>El formulario todavía no tiene un destino conectado, así que no podemos recibirlo.' +
        (waLink() ? ' Escríbenos por WhatsApp mientras tanto.' : '') + '</p>' +
        (waLink() ? '<div class="form-status__actions"><a class="btn btn--primary btn--sm" href="' + esc(waLink(data.mensaje)) + '" target="_blank" rel="noopener">' + icon('whatsapp') + ' Abrir WhatsApp</a></div>' : '') +
        (DEMO ? '<p>Para activarlo, agrega un correo en <code>contacto.email</code> o una URL en <code>formularioContacto.endpoint</code> (config.js).</p>' : ''));
    });
  }

  /* Navegación ----------------------------------------------------------- */
  function setupNav() {
    var header = $('[data-header]');
    var hero = $('.hero .wordmark');
    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
      header.classList.toggle('show-brand', !hero || hero.getBoundingClientRect().bottom < header.offsetHeight + 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var sheet = $('[data-mobile-nav]');
    var openBtn = $('[data-nav-toggle]');
    var closeBtn = $('[data-nav-close]');
    var lastFocus = null;
    function open() {
      lastFocus = document.activeElement;
      sheet.hidden = false;
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      closeBtn.focus();
    }
    function close(focusBack) {
      sheet.hidden = true;
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      if (focusBack !== false && lastFocus) lastFocus.focus();
    }
    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', function () { close(); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) close(false); });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        var f = $$('a, button', sheet);
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Sección activa en la navegación: la última cuyo inicio ya pasó la mitad de la pantalla.
    var links = $$('.site-nav a');
    var sections = $$('main section[id]');
    var spyQueued = false;
    function spy() {
      spyQueued = false;
      var mid = window.innerHeight * 0.5, current = sections[0];
      sections.forEach(function (sec) { if (sec.getBoundingClientRect().top <= mid) current = sec; });
      links.forEach(function (a) {
        if (a.getAttribute('href') === '#' + current.id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
    window.addEventListener('scroll', function () {
      if (!spyQueued) { spyQueued = true; requestAnimationFrame(spy); }
    }, { passive: true });
    window.addEventListener('resize', spy);
    spy();

    // Botones aún sin destino (dirección, etc.): explican qué falta.
    document.addEventListener('click', function (e) {
      var p = e.target.closest('[data-pending]');
      if (!p) return;
      e.preventDefault();
      toast('Este botón se activa cuando configures la ' + p.dataset.pending + ' en assets/js/config.js.');
    });
  }

  /* Aparición progresiva ------------------------------------------------ */
  function setupReveal() {
    var items = $$('[data-reveal]');
    if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (!e.target.style.getPropertyValue('--reveal-delay')) e.target.style.setProperty('--reveal-delay', (batch++ * 90) + 'ms');
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Arranque --------------------------------------------------------------- */
  renderMenu();
  renderPrices();
  renderTeam();
  renderLocation();
  renderHours();
  renderOpenStatus();
  renderContact();
  renderCredits();
  setupBooking();
  setupContactForm();
  setupNav();
  setupReveal();
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  setInterval(renderOpenStatus, 60000);

  var first = MENU.categorias[0];
  if (first && window.CGMascota) window.CGMascota.setMood(first.mascota, first.burbuja);
  if (window.CGMascota) window.CGMascota.refresh();
})();
