/* =========================================================================
   VÉRANO — Interfaz
   Renderiza el contenido desde js/config.js y gestiona las interacciones:
   navegación, menú móvil, carta, galería, lightbox, reservas y WhatsApp.
   Funciona sin GSAP: js/motion.js solo añade la capa de movimiento.
   ========================================================================= */
(function () {
  'use strict';

  var CFG = window.VERANO_CONFIG;
  if (!CFG) return;

  var html = document.documentElement;
  var V = window.VERANO = window.VERANO || {};
  V.config = CFG;

  /* ------------------------------------------------------------- Utilidades */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function prefersReducedMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  function motion() {
    var m = V.motion;
    return m && m.enabled ? m : null;
  }
  var priceFormat = (function () {
    try {
      var nf = new Intl.NumberFormat(CFG.menu.locale || 'es-CL', {
        style: 'currency', currency: CFG.menu.currency || 'CLP', maximumFractionDigits: 0
      });
      return function (n) { return nf.format(n); };
    } catch (e) {
      return function (n) { return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
    }
  })();
  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  function waLink(text) {
    var n = String(CFG.contact.whatsapp.number || '').replace(/\D/g, '');
    return 'https://wa.me/' + n + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  /* --------------------------------------------------- Fotografías / slots */
  /* Paletas de los marcadores de posición: [luz, acento, sombra, fondo]. */
  var TONES = {
    amber:  ['#c98a43', '#6b4426', '#1d1814', '#2b2119'],
    herbs:  ['#8e9b58', '#b5452f', '#1f2119', '#2d3121'],
    pasta:  ['#e3c27f', '#a7773b', '#2a2219', '#3a2d1f'],
    tomato: ['#c4472f', '#e8dcc6', '#231a16', '#3a2a1f'],
    cocoa:  ['#c39a6b', '#4d311f', '#191411', '#2a1f18'],
    flour:  ['#efe4cc', '#a88f6a', '#2a251e', '#4a4032'],
    ember:  ['#d9793a', '#7d2e1c', '#161210', '#2a1a12'],
    meat:   ['#a3533a', '#d9b06a', '#191311', '#2c1c16'],
    berry:  ['#a23646', '#efe3d0', '#1d1416', '#2e1d20'],
    wine:   ['#7d2633', '#c9a061', '#140f10', '#24171a'],
    citrus: ['#e48b35', '#b9c06e', '#1a1512', '#2a2016'],
    table:  ['#ece4d2', '#8b8371', '#1e1d19', '#3a382f'],
    stone:  ['#d2c8b4', '#7a7262', '#211f1b', '#3b372f']
  };

  function placeholder(img, key, opts) {
    var t = TONES[img.tone] || TONES.amber;
    var h = hash(key || img.alt || 'v');
    var ph = document.createElement('span');
    ph.className = 'ph';
    ph.setAttribute('role', 'img');
    ph.setAttribute('aria-label', 'Fotografía pendiente: ' + (img.alt || img.brief || ''));
    ph.style.cssText =
      '--t1:' + t[0] + ';--t2:' + t[1] + ';--t3:' + t[2] + ';--t4:' + t[3] +
      ';--x1:' + (22 + (h % 34)) + '%;--y1:' + (24 + ((h >> 3) % 30)) + '%' +
      ';--x2:' + (56 + ((h >> 5) % 26)) + '%;--y2:' + (54 + ((h >> 7) % 28)) + '%';
    if (!(opts && opts.compact)) {
      ph.innerHTML =
        '<span class="ph__cap" aria-hidden="true"><span class="ph__tag">Fotografía pendiente</span>' +
        (img.brief ? '<span class="ph__brief">' + esc(img.brief) + '</span>' : '') + '</span>';
    }
    return ph;
  }

  /* Rellena un contenedor .slot con la foto real o con su marcador. */
  function fillSlot(slot, img, key, opts) {
    opts = opts || {};
    slot.textContent = '';
    if (!img) return;
    if (img.position) slot.style.setProperty('--pos', img.position);
    if (!img.src) {
      slot.appendChild(placeholder(img, key, opts));
      return;
    }
    var el = document.createElement('img');
    el.alt = img.alt || '';
    if (img.width) el.width = img.width;
    if (img.height) el.height = img.height;
    el.decoding = 'async';
    if (opts.eager) {
      el.loading = 'eager';
      el.setAttribute('fetchpriority', 'high');
    } else {
      el.loading = 'lazy';
    }
    el.addEventListener('error', function () {
      /* Recurso caído: se sustituye por el marcador para no dejar huecos. */
      if (window.console) console.warn('[VÉRANO] No se pudo cargar la imagen:', img.src);
      slot.textContent = '';
      slot.appendChild(placeholder(img, key, opts));
    }, { once: true });
    if (img.srcMobile) {
      var pic = document.createElement('picture');
      var source = document.createElement('source');
      source.media = '(max-width: 719px)';
      source.srcset = img.srcMobile;
      pic.appendChild(source);
      el.src = img.src;
      pic.appendChild(el);
      slot.appendChild(pic);
    } else {
      el.src = img.src;
      slot.appendChild(el);
    }
  }

  function slotHTML(extraClass) {
    return '<span class="slot slot--cover' + (extraClass ? ' ' + extraClass : '') + '"></span>';
  }

  function renderStaticSlots() {
    $$('[data-slot]').forEach(function (slot) {
      var key = slot.getAttribute('data-slot');
      fillSlot(slot, CFG.images[key], key, { eager: slot.hasAttribute('data-slot-eager') });
    });
  }

  /* -------------------------------------------------------- Especialidades */
  function findItem(id) {
    for (var i = 0; i < CFG.menu.items.length; i++) if (CFG.menu.items[i].id === id) return CFG.menu.items[i];
    return null;
  }
  function findCategory(id) {
    for (var i = 0; i < CFG.menu.categories.length; i++) if (CFG.menu.categories[i].id === id) return CFG.menu.categories[i];
    return null;
  }

  function renderSpecialties() {
    var root = $('[data-specialties]');
    if (!root) return;
    var out = [];
    CFG.specialties.forEach(function (sp, i) {
      var item = findItem(sp.itemId);
      if (!item) return;
      var cat = findCategory(item.category);
      out.push(
        '<article class="dish dish--' + esc(sp.layout || 'portrait') + '">' +
          '<div class="dish__figure">' +
            '<div class="frame" data-reveal="mask" data-reveal-dir="' + (i % 2 ? 'left' : 'up') + '">' +
              '<div class="frame__inner">' + slotHTML() + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="dish__text" data-scrub-text>' +
            '<span class="dish__num" aria-hidden="true">' + pad2(i + 1) + '</span>' +
            '<p class="dish__cat"><span class="sr-only">Categoría: </span>' + esc(cat ? cat.name : '') + '</p>' +
            '<h3 class="dish__name">' + esc(item.name) + '</h3>' +
            '<p class="dish__desc">' + esc(item.description) + '</p>' +
            (sp.note ? '<p class="dish__note">' + esc(sp.note) + '</p>' : '') +
            '<p class="dish__price"><span><span class="sr-only">Precio: </span>' + esc(priceFormat(item.price)) + '</span></p>' +
          '</div>' +
        '</article>'
      );
    });
    root.innerHTML = out.join('');
    $$('.dish', root).forEach(function (dish, i) {
      var sp = CFG.specialties[i];
      fillSlot($('.slot', dish), CFG.images[sp.image], sp.image);
    });
  }

  /* ----------------------------------------------------------------- Carta */
  var menuState = { current: null, tabs: {}, panels: {} };

  function renderMenu() {
    var tabsEl = $('[data-menu-tabs]');
    var stage = $('[data-menu-stage]');
    if (!tabsEl || !stage) return;

    var tabsHTML = [], panelsHTML = [];
    CFG.menu.categories.forEach(function (cat, ci) {
      var items = CFG.menu.items.filter(function (it) { return it.category === cat.id; });
      tabsHTML.push(
        '<button class="menu__tab" type="button" role="tab" id="tab-' + esc(cat.id) + '" aria-controls="panel-' + esc(cat.id) +
        '" aria-selected="false" tabindex="-1" data-cat="' + esc(cat.id) + '">' +
        '<span class="menu__tab-label">' + esc(cat.name) + '</span><sup aria-hidden="true">' + pad2(items.length) + '</sup></button>'
      );
      var list = items.map(function (it) {
        var thumb = !!it.image;
        return (
          '<li class="menu-item' + (thumb ? ' menu-item--thumb' : '') + '" data-menu-item>' +
            (thumb ? '<span class="menu-item__thumb" data-thumb="' + esc(it.id) + '">' + slotHTML('slot--compact') + '</span>' : '') +
            '<div class="menu-item__body">' +
              '<div class="menu-item__head">' +
                '<h4 class="menu-item__name">' + esc(it.name) + '</h4>' +
                '<span class="menu-item__leader" aria-hidden="true"></span>' +
                '<p class="menu-item__price"><span class="sr-only">Precio: </span>' + esc(priceFormat(it.price)) + '</p>' +
              '</div>' +
              '<p class="menu-item__desc">' + esc(it.description) + '</p>' +
              (it.signature ? '<p class="menu-item__badge">Firma del chef</p>' : '') +
            '</div>' +
          '</li>'
        );
      }).join('');
      panelsHTML.push(
        '<div class="menu-panel" role="tabpanel" id="panel-' + esc(cat.id) + '" aria-labelledby="tab-' + esc(cat.id) + '" tabindex="0" data-panel="' + esc(cat.id) + '" hidden>' +
          '<div class="menu-panel__aside" data-panel-aside>' +
            '<div class="frame menu-panel__photo" data-panel-photo><div class="frame__inner">' + slotHTML() + '</div></div>' +
            '<p class="menu-panel__kicker" data-panel-anim>' + pad2(ci + 1) + ' — ' + esc(cat.subtitle || '') + '</p>' +
            '<h3 class="menu-panel__title" data-panel-anim>' + esc(cat.name) + '</h3>' +
            '<p class="menu-panel__desc" data-panel-anim>' + esc(cat.description || '') + '</p>' +
          '</div>' +
          '<ol class="menu-list">' + list + '</ol>' +
        '</div>'
      );
    });
    tabsEl.insertAdjacentHTML('beforeend', tabsHTML.join(''));
    stage.innerHTML = panelsHTML.join('');

    CFG.menu.categories.forEach(function (cat) {
      var panel = $('#panel-' + cat.id);
      menuState.tabs[cat.id] = $('#tab-' + cat.id);
      menuState.panels[cat.id] = panel;
      fillSlot($('[data-panel-photo] .slot', panel), CFG.images[cat.image], cat.image);
    });
    $$('[data-thumb]', stage).forEach(function (el) {
      var it = findItem(el.getAttribute('data-thumb'));
      fillSlot($('.slot', el), { src: it.image, alt: it.imageAlt || it.name, tone: 'pasta' }, it.id, { compact: true });
    });

    var first = CFG.menu.categories[0].id;
    selectCategory(first, { initial: true });

    tabsEl.addEventListener('click', function (e) {
      var tab = e.target.closest('[role="tab"]');
      if (tab) selectCategory(tab.getAttribute('data-cat'), { user: true });
    });
    var markEnd = function () { tabsEl.classList.toggle('is-end', tabsEl.scrollLeft + tabsEl.clientWidth >= tabsEl.scrollWidth - 4); };
    tabsEl.addEventListener('scroll', markEnd, { passive: true });
    window.addEventListener('resize', debounce(markEnd, 150));
    requestAnimationFrame(markEnd);
    tabsEl.addEventListener('keydown', function (e) {
      var ids = CFG.menu.categories.map(function (c) { return c.id; });
      var i = ids.indexOf(menuState.current), next = null;
      if (e.key === 'ArrowRight') next = ids[(i + 1) % ids.length];
      else if (e.key === 'ArrowLeft') next = ids[(i - 1 + ids.length) % ids.length];
      else if (e.key === 'Home') next = ids[0];
      else if (e.key === 'End') next = ids[ids.length - 1];
      if (next) {
        e.preventDefault();
        selectCategory(next, { user: true, focus: true });
      }
    });
    window.addEventListener('resize', debounce(function () { moveIndicator(false); }, 120));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveIndicator(false); });
  }

  function moveIndicator(animate) {
    var ind = $('[data-menu-indicator]');
    var tab = menuState.tabs[menuState.current];
    if (!ind || !tab) return;
    var label = $('.menu__tab-label', tab);
    /* El label se mide contra .menu__tabs (su ancestro posicionado). */
    var x = label.offsetParent === tab ? tab.offsetLeft + label.offsetLeft : label.offsetLeft;
    if (!animate) ind.style.transition = 'none';
    ind.style.transform = 'translateX(' + x + 'px) scaleX(' + (label.offsetWidth / 100) + ')';
    if (!animate) { void ind.offsetWidth; ind.style.transition = ''; }
  }

  function selectCategory(id, opts) {
    opts = opts || {};
    if (id === menuState.current) {
      if (opts.focus) menuState.tabs[id].focus();
      return;
    }
    var prevId = menuState.current;
    var prev = prevId ? menuState.panels[prevId] : null;
    var next = menuState.panels[id];
    var tab = menuState.tabs[id];
    if (!next || !tab) return;

    Object.keys(menuState.tabs).forEach(function (k) {
      var t = menuState.tabs[k], on = k === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    menuState.current = id;
    if (opts.initial) {
      /* Lecturas de layout agrupadas tras el primer render (un solo layout). */
      requestAnimationFrame(function () { moveIndicator(false); });
    } else {
      moveIndicator(true);
      /* Desplaza la pestaña activa dentro de la fila (móvil) sin mover la página. */
      var tabsEl = tab.parentNode;
      var target = tab.offsetLeft - (tabsEl.clientWidth - tab.offsetWidth) / 2;
      if (tabsEl.scrollWidth > tabsEl.clientWidth) {
        tabsEl.scrollTo({ left: Math.max(0, target), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
    }

    var m = motion();
    if (prev && m && m.switchPanel) {
      m.switchPanel($('[data-menu-stage]'), prev, next);
    } else {
      if (prev) prev.hidden = true;
      next.hidden = false;
    }
    if (opts.focus) tab.focus();

    if (opts.user) {
      /* Si el usuario estaba más abajo en una lista larga, vuelve al inicio del panel. */
      var wrap = $('[data-menu-tabs-wrap]');
      var stageTop = $('[data-menu-stage]').getBoundingClientRect().top;
      /* Al subir, la navegación reaparece: se cuenta siempre su altura. */
      var offset = wrap.offsetHeight + navHeight();
      if (stageTop < offset - 4) {
        window.scrollTo({
          top: window.pageYOffset + stageTop - offset - 8,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });
      }
    }
  }

  /* --------------------------------------------------------------- Galería */
  var gallery = { index: 0, items: [], track: null };

  function renderGallery() {
    var list = $('[data-gallery-list]');
    if (!list) return;
    var n = CFG.gallery.length;
    list.innerHTML = CFG.gallery.map(function (g, i) {
      return (
        '<li class="gallery__item gallery__item--' + esc(g.layout || 'portrait') + '" data-gallery-item>' +
          '<button class="gallery__open" type="button" data-index="' + i + '" aria-label="Ampliar imagen ' + (i + 1) + ' de ' + n + ': ' + esc(g.caption) + '">' +
            '<span class="frame"><span class="frame__inner">' + slotHTML() + '</span></span>' +
            '<span class="gallery__zoom" aria-hidden="true"><svg><use href="#i-expand"/></svg></span>' +
          '</button>' +
          '<p class="gallery__cap"><span class="gallery__cap-num">' + pad2(i + 1) + '</span>' +
          '<span><span class="gallery__cap-kind">' + esc(g.kind || '') + '</span>' +
          '<span class="gallery__cap-text">' + esc(g.caption) + '</span></span></p>' +
        '</li>'
      );
    }).join('');
    $$('[data-gallery-item]', list).forEach(function (li, i) {
      var g = CFG.gallery[i];
      fillSlot($('.slot', li), { src: g.src, alt: g.alt, tone: g.tone, brief: g.kind + ' · ' + g.caption }, 'g' + i);
    });
    var total = $('[data-gallery-total]');
    if (total) total.textContent = pad2(n);
    initGallery();
  }

  function initGallery() {
    var track = gallery.track = $('[data-gallery-track]');
    if (!track) return;
    var items = gallery.items = $$('[data-gallery-item]', track);
    var prevBtn = $('[data-gallery-prev]'), nextBtn = $('[data-gallery-next]');
    var cur = $('[data-gallery-current]'), bar = $('[data-gallery-progress]'), live = $('[data-gallery-live]');
    track.style.position = 'relative';

    function padLeft() { return parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0; }
    function maxScroll() { return track.scrollWidth - track.clientWidth; }
    function nearestIndex() {
      var x = track.scrollLeft, pl = padLeft(), best = 0, bestD = Infinity;
      if (x >= maxScroll() - 2) return items.length - 1;
      items.forEach(function (it, i) {
        var d = Math.abs(it.offsetLeft - pl - x);
        if (d < bestD) { bestD = d; best = i; }
      });
      return best;
    }
    function update() {
      var i = nearestIndex();
      gallery.index = i;
      cur.textContent = pad2(i + 1);
      bar.style.transform = 'scaleX(' + ((i + 1) / items.length) + ')';
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft >= maxScroll() - 2;
    }
    function go(i, instant) {
      i = Math.max(0, Math.min(items.length - 1, i));
      var left = Math.min(maxScroll(), Math.max(0, items[i].offsetLeft - padLeft()));
      track.scrollTo({ left: left, behavior: instant || prefersReducedMotion() ? 'auto' : 'smooth' });
    }
    gallery.go = go;

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; update(); });
    }, { passive: true });
    var announce = debounce(function () {
      live.textContent = 'Imagen ' + (gallery.index + 1) + ' de ' + items.length + ': ' + CFG.gallery[gallery.index].caption;
    }, 400);
    track.addEventListener('scroll', announce, { passive: true });

    prevBtn.addEventListener('click', function () { go(nearestIndex() - 1); });
    nextBtn.addEventListener('click', function () {
      var i = nearestIndex();
      go(i + 1);
    });
    track.addEventListener('keydown', function (e) {
      if (e.target !== track) return;
      var i = nearestIndex();
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
      else if (e.key === 'End') { e.preventDefault(); go(items.length - 1); }
    });

    /* Arrastre con ratón (el táctil usa el desplazamiento nativo). */
    var drag = null, suppressClick = false;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: track.scrollLeft, moved: false, id: e.pointerId };
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true;
        track.classList.add('is-dragging');
      }
      if (drag.moved) {
        e.preventDefault();
        track.scrollLeft = drag.left - dx;
      }
    });
    function endDrag() {
      if (!drag) return;
      var moved = drag.moved;
      drag = null;
      if (moved) {
        suppressClick = true;
        setTimeout(function () { suppressClick = false; }, 60);
        var i = nearestIndex();
        track.classList.remove('is-dragging');
        go(i);
      }
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });
    track.addEventListener('click', function (e) {
      if (suppressClick) { e.preventDefault(); e.stopPropagation(); return; }
      var btn = e.target.closest('.gallery__open');
      if (btn) openLightbox(+btn.getAttribute('data-index'), btn);
    }, true);

    window.addEventListener('resize', debounce(update, 150));
    requestAnimationFrame(update);
  }

  /* -------------------------------------------------------------- Lightbox */
  var lb = { el: null, index: 0, opener: null };

  function initLightbox() {
    var dlg = lb.el = $('[data-lightbox]');
    if (!dlg || typeof dlg.showModal !== 'function') return;
    $('[data-lightbox-close]', dlg).addEventListener('click', closeLightbox);
    $('[data-lightbox-prev]', dlg).addEventListener('click', function () { showLightbox(lb.index - 1); });
    $('[data-lightbox-next]', dlg).addEventListener('click', function () { showLightbox(lb.index + 1); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); showLightbox(lb.index + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); showLightbox(lb.index - 1); }
    });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.classList.contains('lightbox__inner')) closeLightbox();
    });
    dlg.addEventListener('close', function () {
      html.classList.remove('lightbox-open');
      updateFloat();
      if (gallery.go) gallery.go(lb.index, true);
      var btn = $$('.gallery__open')[lb.index] || lb.opener;
      if (btn) btn.focus({ preventScroll: true });
    });
    /* Gesto de deslizar en táctil */
    var sx = null;
    dlg.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', function (e) {
      if (sx == null) return;
      var dx = e.changedTouches[0].clientX - sx;
      sx = null;
      if (Math.abs(dx) > 50) showLightbox(lb.index + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  function showLightbox(i) {
    var n = CFG.gallery.length;
    i = (i + n) % n;
    lb.index = i;
    var g = CFG.gallery[i];
    var media = $('[data-lightbox-media]', lb.el);
    var ratios = { portrait: '0.8', landscape: '1.5', square: '1' };
    media.innerHTML = '<span class="frame" style="--ar:' + (ratios[g.layout] || 1) + '"><span class="frame__inner">' + slotHTML() + '</span></span>';
    fillSlot($('.slot', media), { src: g.src, alt: g.alt, tone: g.tone, brief: g.kind + ' · ' + g.caption }, 'g' + i, { eager: true });
    $('[data-lightbox-caption]', lb.el).textContent = g.caption;
    $('[data-lightbox-count]', lb.el).textContent = pad2(i + 1) + ' / ' + pad2(n);
  }

  function openLightbox(i, opener) {
    if (!lb.el) return;
    lb.opener = opener;
    showLightbox(i);
    lb.el.showModal();
    html.classList.add('lightbox-open');
    updateFloat();
    $('[data-lightbox-close]', lb.el).focus();
  }
  function closeLightbox() { if (lb.el && lb.el.open) lb.el.close(); }

  /* ----------------------------------------------------------- Experiencias */
  function renderExperiences() {
    var root = $('[data-experiences]');
    if (!root) return;
    var ex = CFG.experiences;
    root.innerHTML = ex.items.map(function (x, i) {
      return (
        '<article class="exp" data-exp>' +
          '<div class="frame exp__figure" data-reveal="mask"><div class="frame__inner">' + slotHTML() + '</div></div>' +
          '<p class="exp__num">' + pad2(i + 1) + '</p>' +
          '<h3 class="exp__title">' + esc(x.title) + '</h3>' +
          '<p class="exp__desc">' + esc(x.description) + '</p>' +
          '<a class="text-link" href="#contacto">Consultar disponibilidad<span class="sr-only"> de ' + esc(x.title.toLowerCase()) + '</span>' +
          '<svg aria-hidden="true"><use href="#i-arrow"/></svg></a>' +
        '</article>'
      );
    }).join('');
    $$('[data-exp]', root).forEach(function (el, i) {
      var key = ex.items[i].image;
      fillSlot($('.slot', el), CFG.images[key], key);
    });
    var note = $('[data-experiences-note]');
    if (note && !ex.confirmed) note.hidden = false;
  }

  /* -------------------------------------------------------------- Contacto */
  function renderContact() {
    var c = CFG.contact, demo = CFG.demoMode;
    var a = c.address;

    var addr = $('[data-address]');
    if (addr) {
      addr.innerHTML = a.isPlaceholder
        ? '<span class="is-pending">' + esc(a.line1) + '</span><br><span class="is-pending">' + esc(a.line2) + '</span><br><span class="pending-chip">Dato pendiente</span>'
        : esc(a.line1) + '<br>' + esc(a.line2);
    }

    var maps = $('[data-maps]');
    if (maps) {
      if (a.isPlaceholder) {
        maps.innerHTML =
          '<button class="btn btn--dark btn--sm" type="button" disabled aria-describedby="maps-hint">Cómo llegar</button>' +
          '<p class="field__hint" id="maps-hint">El enlace de indicaciones se activará cuando se confirme la dirección.</p>';
      } else {
        var q = a.mapsQuery || (a.line1 + ', ' + a.line2);
        maps.innerHTML =
          '<a class="btn btn--dark btn--sm" href="https://www.google.com/maps/search/?api=1&amp;query=' + encodeURIComponent(q) +
          '" target="_blank" rel="noopener">Cómo llegar<span class="sr-only"> (se abre en una nueva pestaña)</span></a>';
      }
    }

    var embed = $('[data-map-embed]');
    if (embed && a.mapEmbedUrl && !a.isPlaceholder) {
      embed.innerHTML = '<iframe src="' + esc(a.mapEmbedUrl) + '" title="Mapa de ubicación de VÉRANO" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
      embed.hidden = false;
    }

    var hoursHTML = c.hours.map(function (h) {
      return '<div><dt>' + esc(h.days) + '</dt><dd>' + esc(h.time) + '</dd></div>';
    }).join('');
    $$('[data-hours]').forEach(function (dl) {
      dl.innerHTML = hoursHTML;
      if (c.hoursAreDemo && demo) dl.insertAdjacentHTML('afterend', '<p class="hours__demo">Horario de ejemplo, pendiente de confirmar.</p>');
    });

    var wa = waLink('Hola, VÉRANO. Quisiera hacer una consulta.');
    /* Espacios no separables: un número de teléfono no debe partirse en dos líneas. */
    var nb = function (str) { return esc(str).replace(/ /g, '&nbsp;'); };
    var newTab = '<span class="sr-only"> (se abre en una nueva pestaña)</span>';
    var demoTag = function (flag) { return flag && demo ? ' <span class="pending-chip">Demo</span>' : ''; };
    var ig = c.instagram && c.instagram.url
      ? '<a href="' + esc(c.instagram.url) + '" target="_blank" rel="noopener">' + esc(c.instagram.handle || 'Instagram') + newTab + '</a>'
      : '<span class="v-pending">Cuenta por confirmar</span>';

    var list = $('[data-contact-list]');
    if (list) {
      list.innerHTML =
        '<li><span class="k">WhatsApp' + demoTag(c.whatsapp.isPlaceholder) + '</span><a href="' + esc(wa) + '" target="_blank" rel="noopener">' + nb(c.whatsapp.display) + newTab + '</a></li>' +
        '<li><span class="k">Teléfono' + demoTag(c.phone.isPlaceholder) + '</span><a href="tel:' + esc(c.phone.href) + '">' + nb(c.phone.display) + '</a></li>' +
        '<li><span class="k">Instagram</span>' + ig + '</li>';
    }
    var foot = $('[data-footer-contact]');
    if (foot) {
      foot.innerHTML =
        '<li><a href="' + esc(wa) + '" target="_blank" rel="noopener">WhatsApp ' + nb(c.whatsapp.display) + newTab + '</a></li>' +
        '<li><a href="tel:' + esc(c.phone.href) + '">Tel.&nbsp;' + nb(c.phone.display) + '</a></li>' +
        (c.instagram && c.instagram.url
          ? '<li><a href="' + esc(c.instagram.url) + '" target="_blank" rel="noopener">Instagram ' + esc(c.instagram.handle) + newTab + '</a></li>'
          : '<li>Instagram: por confirmar</li>') +
        '<li>' + esc(a.isPlaceholder ? 'Dirección por confirmar' : a.line1 + ', ' + a.line2) + '</li>';
    }

    var float = $('[data-wa-float]');
    if (float) float.href = wa;
    var successLink = $('[data-success-link]');
    if (successLink) successLink.href = waLink('');
    var demoWa = $('[data-demo-wa]');
    if (demoWa && demo && c.whatsapp.isPlaceholder) demoWa.hidden = false;

    var year = $('[data-year]');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------ Navegación */
  var nav = $('[data-nav]');
  var hero = $('#inicio');
  var heroH = 0, lastY = 0, navTicking = false;
  /* La llegada a un ancla (enlace profundo, recarga) también desplaza la
     página: la navegación solo se oculta tras un gesto del propio usuario. */
  var userScrolled = false;

  function navHeight() { return nav ? $('.nav__bar', nav).offsetHeight : 0; }

  function updateNav() {
    navTicking = false;
    var y = window.pageYOffset;
    /* Transparente solo en reposo sobre la portada: en cuanto el texto del
       hero empieza a pasar por debajo, la barra se vuelve sólida. */
    var solid = y > 24;
    nav.classList.toggle('is-solid', solid);
    var menuOpen = html.classList.contains('menu-open');
    var focusInside = nav.contains(document.activeElement) && document.activeElement !== document.body;
    if (userScrolled && !menuOpen && !focusInside && y > heroH && y > lastY + 6) nav.classList.add('is-hidden');
    else if (y < lastY - 6 || y <= heroH || menuOpen || focusInside) nav.classList.remove('is-hidden');
    html.classList.toggle('nav-visible', !nav.classList.contains('is-hidden'));
    if (Math.abs(y - lastY) > 6) lastY = y;
  }

  function initNav() {
    if (!nav) return;
    window.addEventListener('scroll', function () {
      if (!navTicking) { navTicking = true; requestAnimationFrame(updateNav); }
    }, { passive: true });
    window.addEventListener('resize', debounce(function () { heroH = hero ? hero.offsetHeight : 0; updateNav(); }, 150));
    nav.addEventListener('focusin', function () { nav.classList.remove('is-hidden'); html.classList.add('nav-visible'); });
    var arm = function () { userScrolled = true; };
    ['wheel', 'touchmove', 'keydown', 'pointerdown'].forEach(function (t) {
      window.addEventListener(t, arm, { passive: true, once: true });
    });
    requestAnimationFrame(function () {
      heroH = hero ? hero.offsetHeight : 0;
      /* Con enlace profundo o recarga a mitad de página no hubo desplazamiento
         hacia abajo: la navegación debe verse. */
      lastY = window.pageYOffset;
      updateNav();
    });

    /* Enlace activo según la sección visible */
    var links = $$('[data-nav-link]');
    if ('IntersectionObserver' in window) {
      var map = {};
      links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var a = map[en.target.id];
          if (!a) return;
          if (en.isIntersecting) {
            links.forEach(function (l) { l.removeAttribute('aria-current'); });
            a.setAttribute('aria-current', 'location');
          } else if (a.getAttribute('aria-current')) {
            a.removeAttribute('aria-current');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    }
  }

  /* ----------------------------------------------------------- Menú móvil */
  var mm = { open: false, panel: null, toggle: null };

  function setInert(on) {
    ['#contenido', '.footer', '[data-wa-float]'].forEach(function (sel) {
      var el = $(sel);
      if (!el) return;
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }

  function openMenu() {
    if (mm.open) return;
    mm.open = true;
    mm.panel.hidden = false;
    html.classList.add('menu-open');
    nav.classList.remove('is-hidden');
    mm.toggle.setAttribute('aria-expanded', 'true');
    $('[data-menu-toggle-label]').textContent = 'Cerrar menú';
    setInert(true);
    updateFloat();
    var m = motion();
    if (m && m.mobileMenu) m.mobileMenu(true, mm.panel);
    var first = $('[data-mmenu-link]', mm.panel);
    if (first) first.focus({ preventScroll: true });
  }

  function closeMenu(returnFocus) {
    if (!mm.open) return;
    mm.open = false;
    html.classList.remove('menu-open');
    mm.toggle.setAttribute('aria-expanded', 'false');
    $('[data-menu-toggle-label]').textContent = 'Abrir menú';
    setInert(false);
    updateFloat();
    var done = function () { if (!mm.open) mm.panel.hidden = true; };
    var m = motion();
    if (m && m.mobileMenu) m.mobileMenu(false, mm.panel, done); else done();
    if (returnFocus) mm.toggle.focus({ preventScroll: true });
  }

  function initMobileMenu() {
    mm.panel = $('[data-mmenu]');
    mm.toggle = $('[data-menu-toggle]');
    if (!mm.panel || !mm.toggle) return;
    mm.toggle.addEventListener('click', function () { if (mm.open) closeMenu(true); else openMenu(); });
    /* Al pulsar un enlace se cierra el menú (y se libera el scroll) antes
       de que el navegador procese el salto al ancla. */
    $$('[data-mmenu-link]', mm.panel).forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mm.open) closeMenu(true);
    });
    window.addEventListener('resize', debounce(function () {
      if (mm.open && window.innerWidth >= 900) closeMenu(false);
    }, 120));
  }

  /* ----------------------------------------------------- WhatsApp flotante */
  /* Visible solo cuando ayuda: fuera de la portada (ya tiene sus CTA) y nunca
     sobre reservas, contacto, footer o la lista de la carta, ni encima de un
     control que quede debajo (p. ej. «Imagen siguiente» de la galería). */
  var floatState = { blockers: [], pastHero: false, conflict: false, el: null, showTimer: 0, lastCheck: 0 };
  var PROTECTED = 'a[href], button, input, select, textarea, [role="tab"], .menu-item__price';

  function floatAllowed() {
    return floatState.pastHero &&
      !floatState.blockers.some(function (b) { return b.on; }) &&
      !html.classList.contains('menu-open') && !html.classList.contains('lightbox-open') &&
      !html.classList.contains('has-intro');
  }

  /* ¿Se solapa el botón (con 4 px de margen) con algún control o precio?
     Comprobación geométrica: detecta también solapes parciales en los bordes. */
  var protectedEls = null;
  function coversControl() {
    var el = floatState.el;
    if (!protectedEls) protectedEls = $$(PROTECTED).filter(function (c) { return !el.contains(c); });
    var r = el.getBoundingClientRect();
    var m = 4;
    for (var i = 0; i < protectedEls.length; i++) {
      var q = protectedEls[i].getBoundingClientRect();
      if (!q.width || !q.height) continue;
      if (q.right > r.left - m && q.left < r.right + m && q.bottom > r.top - m && q.top < r.bottom + m) return true;
    }
    return false;
  }

  function updateFloat() {
    var el = floatState.el;
    if (!el) return;
    var allowed = floatAllowed();
    if (allowed) floatState.conflict = coversControl();
    var show = allowed && !floatState.conflict;
    el.classList.toggle('is-visible', show);
    if (show) el.removeAttribute('tabindex'); else el.setAttribute('tabindex', '-1');
    el.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  /* Se oculta en cuanto aparece un control debajo y vuelve tras 250 ms libres,
     para no parpadear al pasar sobre listas de enlaces. */
  function checkConflict() {
    if (!floatState.el || !floatAllowed()) return;
    if (coversControl()) {
      clearTimeout(floatState.showTimer);
      floatState.showTimer = 0;
      if (!floatState.conflict) { floatState.conflict = true; updateFloat(); }
    } else if (floatState.conflict && !floatState.showTimer) {
      floatState.showTimer = setTimeout(function () {
        floatState.showTimer = 0;
        if (!coversControl()) { floatState.conflict = false; updateFloat(); }
      }, 250);
    } else if (!floatState.el.classList.contains('is-visible')) {
      updateFloat();
    }
  }

  function initFloat() {
    floatState.el = $('[data-wa-float]');
    if (!floatState.el || !('IntersectionObserver' in window)) {
      if (floatState.el) floatState.el.classList.add('is-visible');
      return;
    }
    new IntersectionObserver(function (entries) {
      floatState.pastHero = !entries[0].isIntersecting;
      updateFloat();
    }, { rootMargin: '0px 0px -20% 0px' }).observe(hero);
    ['#reservas', '#contacto', '.footer', '[data-menu-stage]'].forEach(function (sel) {
      var el = $(sel);
      if (el) floatState.blockers.push({ el: el, on: false });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        floatState.blockers.forEach(function (b) { if (b.el === en.target) b.on = en.isIntersecting; });
      });
      updateFloat();
    }, { rootMargin: '0px 0px -10% 0px' });
    floatState.blockers.forEach(function (b) { io.observe(b.el); });

    var settleCheck = debounce(checkConflict, 120);
    function onScroll() {
      var now = performance.now();
      if (now - floatState.lastCheck > 80) { floatState.lastCheck = now; checkConflict(); }
      settleCheck();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    var track = $('[data-gallery-track]');
    if (track) track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', settleCheck);
    updateFloat();
  }
  V.updateFloat = updateFloat;

  /* --------------------------------------------------------------- Reservas */
  var R = CFG.reservations;

  function isoDate(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function parseISO(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return d.getMonth() === +m[2] - 1 ? d : null;
  }
  function addDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; }
  var WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  function slotsFor(dateStr) {
    var d = parseISO(dateStr);
    var groups = R.timeSlots;
    if (d) {
      if (R.closedWeekdays.indexOf(d.getDay()) !== -1) return [];
      var allowed = R.servicesByWeekday && R.servicesByWeekday[d.getDay()];
      if (allowed) groups = groups.filter(function (g) { return allowed.indexOf(g.label) !== -1; });
    }
    return groups;
  }
  function minutes(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  function isPastSlot(dateStr, time) {
    var now = new Date();
    if (dateStr !== isoDate(now)) return false;
    return minutes(time) < now.getHours() * 60 + now.getMinutes() + (R.leadTimeMinutes || 0);
  }

  function initReservation() {
    var form = $('[data-reserve-form]');
    if (!form) return;
    var f = {
      nombre: $('#r-nombre'), telefono: $('#r-telefono'), fecha: $('#r-fecha'),
      hora: $('#r-hora'), personas: $('#r-personas'), comentarios: $('#r-comentarios')
    };
    var labels = { nombre: 'Nombre', telefono: 'Teléfono', fecha: 'Fecha', hora: 'Hora', personas: 'Número de personas' };
    var touched = {};
    var summary = $('[data-form-summary]');
    var submit = $('[data-submit]');
    var success = $('[data-form-success]');

    var today = new Date();
    f.fecha.min = isoDate(today);
    f.fecha.max = isoDate(addDays(today, R.maxDaysAhead));
    f.personas.min = R.minGuests;
    f.personas.max = R.maxGuests;
    f.personas.value = R.defaultGuests;
    $('[data-guests-hint]').textContent = 'De ' + R.minGuests + ' a ' + R.maxGuests + ' personas. Para grupos más grandes, escríbenos por WhatsApp.';

    function fillTimes() {
      var prev = f.hora.value, dateStr = f.fecha.value;
      var groups = slotsFor(dateStr);
      var opts = ['<option value="">' + (dateStr && !groups.length ? 'Sin servicio ese día' : 'Elige un horario') + '</option>'];
      groups.forEach(function (g) {
        opts.push('<optgroup label="' + esc(g.label) + '">');
        g.times.forEach(function (t) {
          var past = isPastSlot(dateStr, t);
          opts.push('<option value="' + t + '"' + (past ? ' disabled' : '') + '>' + t + (past ? ' — no disponible' : '') + '</option>');
        });
        opts.push('</optgroup>');
      });
      f.hora.innerHTML = opts.join('');
      var still = $$('option', f.hora).some(function (o) { return o.value === prev && !o.disabled; });
      f.hora.value = still ? prev : '';
    }
    fillTimes();

    /* Validaciones */
    var V_ = {
      nombre: function (v) {
        v = v.trim();
        if (!v) return 'Escribe tu nombre.';
        if (v.length < 2 || !/[A-Za-zÀ-ÖØ-öø-ÿ].*[A-Za-zÀ-ÖØ-öø-ÿ]/.test(v)) return 'Escribe un nombre de al menos 2 letras.';
        if (v.length > 60) return 'El nombre no puede superar los 60 caracteres.';
        return '';
      },
      telefono: function (v) {
        var raw = v.trim();
        if (!raw) return 'Escribe un teléfono de contacto.';
        var s = raw.replace(/[\s().-]/g, '');
        if (!/^\+?\d+$/.test(s)) return 'Usa solo números, espacios o el signo +.';
        var digits = s.replace('+', '');
        var ok;
        if (s.charAt(0) === '+') ok = digits.indexOf('56') === 0 ? digits.length === 11 : digits.length >= 8 && digits.length <= 15;
        else ok = digits.length === 9 || (digits.indexOf('56') === 0 && digits.length === 11);
        return ok ? '' : 'Revisa el número. Ejemplo: +56 9 1234 5678.';
      },
      fecha: function (v) {
        if (!v) return 'Elige la fecha de tu visita.';
        var d = parseISO(v);
        if (!d) return 'La fecha no es válida.';
        if (v < f.fecha.min) return 'Elige una fecha a partir de hoy.';
        if (v > f.fecha.max) return 'Aceptamos solicitudes hasta ' + R.maxDaysAhead + ' días antes.';
        if (R.closedWeekdays.indexOf(d.getDay()) !== -1) return 'Los ' + WEEKDAYS[d.getDay()] + ' no hay servicio. Elige otro día.';
        return '';
      },
      hora: function (v) {
        if (!v) return f.fecha.value && !slotsFor(f.fecha.value).length ? 'Elige primero un día con servicio.' : 'Elige un horario.';
        var valid = slotsFor(f.fecha.value).some(function (g) { return g.times.indexOf(v) !== -1; });
        if (!valid) return 'Ese horario no está disponible para la fecha elegida.';
        if (isPastSlot(f.fecha.value, v)) return 'Para hoy, elige un horario con al menos ' + R.leadTimeMinutes + ' minutos de anticipación.';
        return '';
      },
      personas: function (v) {
        if (v === '') return 'Indica cuántas personas vienen.';
        var n = Number(v);
        if (!/^\d+$/.test(String(v).trim()) || n < R.minGuests) return 'Indica un número de personas válido.';
        if (n > R.maxGuests) return 'Para más de ' + R.maxGuests + ' personas, escríbenos directamente por WhatsApp.';
        return '';
      }
    };

    function setError(name, msg) {
      var input = f[name];
      var out = $('[data-error-for="' + name + '"]', form);
      out.textContent = msg;
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    }
    function check(name) {
      var msg = V_[name](f[name].value);
      setError(name, msg);
      return msg;
    }

    Object.keys(V_).forEach(function (name) {
      var el = f[name];
      el.addEventListener('blur', function () {
        if (el.value !== '' || touched[name]) { touched[name] = true; check(name); }
      });
      el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', function () {
        if (el.getAttribute('aria-invalid') === 'true') check(name);
      });
    });
    f.fecha.addEventListener('change', function () {
      fillTimes();
      touched.fecha = true;
      check('fecha');
      if (touched.hora || f.hora.getAttribute('aria-invalid') === 'true') check('hora');
    });

    /* Stepper de personas */
    var stepBtns = $$('[data-step]', form);
    function syncStepper() {
      var n = parseInt(f.personas.value, 10);
      stepBtns[0].disabled = !(n > R.minGuests);
      stepBtns[1].disabled = !(isNaN(n) || n < R.maxGuests);
    }
    stepBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var n = parseInt(f.personas.value, 10);
        if (isNaN(n)) n = R.defaultGuests;
        n = Math.min(R.maxGuests, Math.max(R.minGuests, n + Number(b.getAttribute('data-step'))));
        f.personas.value = n;
        syncStepper();
        if (f.personas.getAttribute('aria-invalid') === 'true') check('personas');
      });
    });
    f.personas.addEventListener('input', syncStepper);
    syncStepper();

    /* Contador de comentarios */
    var count = $('[data-count]', form);
    var maxC = +f.comentarios.getAttribute('maxlength');
    f.comentarios.addEventListener('input', function () { count.textContent = f.comentarios.value.length + ' / ' + maxC; });

    function showSummary(errors) {
      summary.innerHTML =
        '<strong>Revisa ' + (errors.length === 1 ? 'este campo' : 'estos ' + errors.length + ' campos') + ' antes de continuar:</strong>' +
        '<ul>' + errors.map(function (e) {
          return '<li><a href="#' + f[e.name].id + '" data-focus="' + e.name + '">' + esc(labels[e.name]) + ': ' + esc(e.msg) + '</a></li>';
        }).join('') + '</ul>';
      summary.hidden = false;
      summary.focus();
    }
    summary.addEventListener('click', function (e) {
      var a = e.target.closest('[data-focus]');
      if (!a) return;
      e.preventDefault();
      var el = f[a.getAttribute('data-focus')];
      el.focus();
      el.scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });

    function setLoading(on) {
      submit.classList.toggle('is-loading', on);
      submit.disabled = on;
      submit.setAttribute('aria-busy', on ? 'true' : 'false');
      $('[data-submit-label]').textContent = on ? 'Preparando tu mensaje…' : 'Preparar solicitud por WhatsApp';
    }

    function buildMessage() {
      var d = parseISO(f.fecha.value);
      var fecha;
      try {
        fecha = d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      } catch (e) { fecha = f.fecha.value; }
      var n = Number(f.personas.value);
      var lines = [
        'Hola, ' + CFG.brand.name + '. Quisiera solicitar una reserva:',
        '',
        '• Nombre: ' + f.nombre.value.trim(),
        '• Teléfono: ' + f.telefono.value.trim(),
        '• Fecha: ' + fecha,
        '• Hora: ' + f.hora.value,
        '• Personas: ' + n
      ];
      var notes = f.comentarios.value.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '').trim();
      if (notes) lines.push('• Comentarios: ' + notes);
      lines.push('', 'Quedo atento/a a su confirmación. ¡Gracias!');
      return lines.join('\n');
    }
    V.buildReservationMessage = buildMessage;

    var busy = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) return;
      var errors = [];
      Object.keys(V_).forEach(function (name) {
        touched[name] = true;
        var msg = check(name);
        if (msg) errors.push({ name: name, msg: msg });
      });
      if (errors.length) { showSummary(errors); return; }
      summary.hidden = true;

      busy = true;
      setLoading(true);
      var url = waLink(buildMessage());
      V.lastWhatsAppUrl = url;
      /* La ventana se abre dentro del gesto del usuario para evitar bloqueos. */
      var win = null;
      try { win = window.open(url, '_blank'); if (win) win.opener = null; } catch (err) { win = null; }

      setTimeout(function () {
        busy = false;
        setLoading(false);
        var link = $('[data-success-link]', success);
        link.href = url;
        $('.btn__label', link).textContent = win ? 'Abrir WhatsApp de nuevo' : 'Abrir WhatsApp';
        var title = $('.form-success__title', success);
        title.textContent = win ? 'Tu solicitud está lista en WhatsApp' : 'Tu solicitud está lista para enviar';
        form.hidden = true;
        success.hidden = false;
        success.focus();
      }, 650);
    });

    $('[data-success-edit]', success).addEventListener('click', function () {
      success.hidden = true;
      form.hidden = false;
      f.nombre.focus();
    });
  }

  /* --------------------------------------------------------------- Portada */
  function initHero() {
    if (!hero || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      hero.classList.toggle('is-offscreen', !entries[0].isIntersecting);
    }).observe(hero);
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  }

  /* ---------------------------------------------------------------- Inicio */
  renderStaticSlots();
  renderSpecialties();
  renderMenu();
  renderGallery();
  initLightbox();
  renderExperiences();
  renderContact();
  initNav();
  initMobileMenu();
  initFloat();
  initReservation();
  initHero();

  V.ui = {
    openMenu: openMenu,
    closeMenu: closeMenu,
    selectCategory: selectCategory,
    openLightbox: openLightbox,
    closeLightbox: closeLightbox
  };
})();
