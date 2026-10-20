/*
 * CREMA & GRANO · La tazita animada
 * ------------------------------------------------------------
 * - Coloca la imagen de la mascota (config.js → mascota.imagen) sin deformarla.
 * - Le añade capas independientes: el café (SVG), el vapor y la bolsita de té.
 *   La ilustración original nunca se modifica.
 * - Flota, reacciona al cursor y cambia según la categoría elegida en la carta.
 * - Recorrido con el scroll: se asoma tras el logotipo, se desprende, viaja hasta
 *   la carta (en escritorio) y termina asomándose en el pie de página.
 * - Respeta «reducir movimiento»: sin viajes ni flotación, todo queda estático.
 */
(function () {
  'use strict';

  var CFG = (window.CG_CONFIG && window.CG_CONFIG.mascota) || {};
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var wide = window.matchMedia('(min-width: 1024px)');
  var SVGNS = 'http://www.w3.org/2000/svg';

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }

  /* 1. Configuración --------------------------------------------------- */
  function applyConfig() {
    var b = CFG.boca;
    if (b) {
      root.style.setProperty('--boca-x', b.x + '%');
      root.style.setProperty('--boca-y', b.y + '%');
      root.style.setProperty('--boca-w', b.ancho + '%');
      root.style.setProperty('--boca-h', b.alto + '%');
    }
    if (typeof CFG.asomarse === 'number') root.style.setProperty('--asomarse', String(clamp(CFG.asomarse, 0, 0.6)));
    if (/ajustar-mascota/.test(location.hash)) root.classList.add('cg-debug-mascota');

    var src = CFG.imagen;
    if (!src) return;
    document.querySelectorAll('.cup__img, .brand__cup, .member__badge img, .map-placeholder__pin img').forEach(function (img) {
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
    // La caja de la tazita toma la proporción real de la imagen: nunca se estira.
    var probe = new Image();
    probe.onload = function () {
      if (probe.naturalWidth && probe.naturalHeight) {
        root.style.setProperty('--cup-ratio', (probe.naturalWidth / probe.naturalHeight).toFixed(4));
        requestUpdate(true);
      }
    };
    probe.src = src;
  }

  /* 2. Capas animadas -------------------------------------------------- */
  var uid = 0;

  function liquidMarkup() {
    var id = 'cg-boca-' + (++uid);
    return '' +
      '<svg viewBox="0 0 244 52" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
        '<defs><clipPath id="' + id + '"><ellipse cx="122" cy="26" rx="122" ry="26"/></clipPath></defs>' +
        '<g clip-path="url(#' + id + ')">' +
          '<rect class="liq liq-base" x="-30" y="-20" width="304" height="92"/>' +
          '<g class="liq-surface">' +
            '<ellipse class="liq liq-crema" cx="122" cy="28" rx="107" ry="20"/>' +
            '<ellipse class="liq liq-core" cx="122" cy="30" rx="62" ry="10"/>' +
            '<g class="liq liq-art"><path fill="#FFF7EA" d="M122 42c-19-9-27-17-19-23 6-4.5 14-2 19 3 5-5 13-7.5 19-3 8 6 0 14-19 23z"/>' +
              '<path fill="none" stroke="#FFF7EA" stroke-width="2.6" stroke-linecap="round" d="M98 37c8 4 40 4 48 0M104 42c6 2.5 30 2.5 36 0"/></g>' +
            '<g class="liq liq-drizzle"><path fill="none" stroke="#6B3F2A" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" d="M38 24l20 12 20-15 22 16 22-16 22 16 22-16 20 13 18-9"/></g>' +
            '<g class="liq liq-ice" fill="#FFFFFF" fill-opacity="0.9" stroke="#DCC2A1" stroke-width="2.4">' +
              '<rect x="70" y="13" width="32" height="22" rx="6" transform="rotate(-12 86 24)"/>' +
              '<rect x="132" y="16" width="34" height="23" rx="6" transform="rotate(11 149 27)"/>' +
              '<rect x="104" y="28" width="24" height="16" rx="5" transform="rotate(4 116 36)"/></g>' +
            '<ellipse class="liq liq-shine" cx="86" cy="19" rx="27" ry="5"/>' +
          '</g>' +
          '<ellipse class="liq-ripple" cx="122" cy="29" rx="84" ry="17"/>' +
          '<ellipse class="liq-ripple liq-ripple--b" cx="122" cy="29" rx="84" ry="17"/>' +
        '</g>' +
      '</svg>';
  }

  function steamMarkup() {
    return '' +
      '<svg viewBox="0 0 120 110" aria-hidden="true" focusable="false">' +
        '<path class="steam steam--a" pathLength="120" d="M30 104c-12-20 12-34 0-54-10-16 6-28 0-44"/>' +
        '<path class="steam steam--b" pathLength="120" d="M60 104c-12-20 12-34 0-54-10-16 6-28 0-44"/>' +
        '<path class="steam steam--c" pathLength="120" d="M90 104c-12-20 12-34 0-54-10-16 6-28 0-44"/>' +
        '<g class="cup__hearts">' +
          '<path class="heart heart--a" d="M30 70c-5-6-14-1-8 6l8 8 8-8c6-7-3-12-8-6z"/>' +
          '<path class="heart heart--b" d="M62 58c-4-5-11-1-6 5l6 6 6-6c5-6-2-10-6-5z"/>' +
          '<path class="heart heart--c" d="M90 72c-5-6-14-1-8 6l8 8 8-8c6-7-3-12-8-6z"/>' +
        '</g>' +
      '</svg>';
  }

  function teabagMarkup() {
    return '' +
      '<svg viewBox="0 0 30 64" aria-hidden="true" focusable="false">' +
        '<path d="M5 1c6 12-2 22 9 34" fill="none" stroke="#6B3F2A" stroke-width="2.2" stroke-linecap="round"/>' +
        '<rect x="3" y="34" width="23" height="27" rx="4.5" fill="#FFFFFF" stroke="#4A281B" stroke-width="2.6"/>' +
        '<path d="M10 47.5c3-4 7-4 10 0-3 4-7 4-10 0z" fill="#B98250"/>' +
      '</svg>';
  }

  function Cup(el, kind) {
    this.el = el;
    this.kind = kind;
    this.tilt = el.querySelector('.cup__tilt');
    this.bubble = el.querySelector('.cup__bubble');
    this.x = 0;   // inclinación del café (-1…1)
    this.v = 0;
    this.lastMood = null;
    if (this.tilt && !this.tilt.querySelector('.cup__steam')) {
      var steam = document.createElement('span');
      steam.className = 'cup__steam';
      steam.innerHTML = steamMarkup();
      this.tilt.appendChild(steam);
      if (CFG.capaLiquido !== false) {
        var liquid = document.createElement('span');
        liquid.className = 'cup__liquid';
        liquid.innerHTML = liquidMarkup();
        this.tilt.appendChild(liquid);
        var bag = document.createElement('span');
        bag.className = 'cup__teabag';
        bag.innerHTML = teabagMarkup();
        this.tilt.appendChild(bag);
      }
    }
    if (!el.dataset.mood) el.dataset.mood = 'espresso';
    el.classList.toggle('is-alive', !reduceMotion.matches);
  }
  Cup.prototype.impulse = function (f) { this.v += f; wake(); };
  Cup.prototype.setMood = function (mood, text, pop) {
    var changed = mood && mood !== this.el.dataset.mood;
    if (mood) this.el.dataset.mood = mood;
    if (text && this.bubble) {
      this.bubble.textContent = text;
      if (pop) popBubble(this.bubble);
    }
    if (changed) this.impulse(this.x > 0 ? -2.6 : 2.6);
  };
  Cup.prototype.step = function (dt, force) {
    // Muelle amortiguado: el café se mece y vuelve al reposo.
    var k = 38, c = 6.5;
    var a = -k * this.x - c * this.v + force;
    this.v += a * dt;
    this.x += this.v * dt;
    if (Math.abs(this.x) < 0.0008 && Math.abs(this.v) < 0.0008) { this.x = 0; this.v = 0; }
    var s = clamp(this.x, -1, 1);
    this.el.style.setProperty('--slosh', s.toFixed(3));
    this.el.style.setProperty('--slosh-abs', Math.abs(s).toFixed(3));
    return this.x !== 0 || this.v !== 0;
  };

  function popBubble(b) {
    b.classList.remove('is-popping');
    void b.offsetWidth;
    b.classList.add('is-popping');
  }

  /* 3. Instancias ------------------------------------------------------ */
  var cups = {};
  ['hero', 'menu', 'footer'].forEach(function (k) {
    var el = document.querySelector('[data-cup="' + k + '"]');
    if (el) cups[k] = new Cup(el, k);
  });
  var menuAside = document.querySelector('.menu__aside');
  var footer = document.querySelector('.site-footer');
  var beans = Array.prototype.slice.call(document.querySelectorAll('.hero .bean'));
  var currentMood = { mood: 'espresso', text: cups.menu && cups.menu.bubble ? cups.menu.bubble.textContent : '' };

  /* 4. La viajera (solo escritorio y con movimiento) -------------------- */
  var traveler = null;
  var travel = { phase: -1, d0: 0, s1: 0, lastX: null, lastY: null, ready: false };

  function travelAllowed() {
    return wide.matches && !reduceMotion.matches && cups.hero && cups.menu && menuAside;
  }

  function ensureTraveler() {
    if (traveler) return traveler;
    var el = document.createElement('span');
    el.className = 'cup cup--traveler';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<span class="cup__float"><span class="cup__tilt"><img class="cup__img" alt="" src="' +
      (CFG.imagen || 'assets/img/mascota/tazita.png') + '"></span></span>';
    document.body.appendChild(el);
    traveler = new Cup(el, 'traveler');
    return traveler;
  }

  function measureTravel() {
    if (!travelAllowed()) { travel.ready = false; return; }
    ensureTraveler();
    var y = window.scrollY;
    var vh = window.innerHeight;
    var cs = getComputedStyle(root);
    var headerH = parseFloat(cs.getPropertyValue('--header-h')) || 76;
    var asomarse = parseFloat(cs.getPropertyValue('--asomarse')) || 0;

    // Punto de partida: la tazita de la portada ya desprendida del logotipo.
    var a = cups.hero.el.getBoundingClientRect();
    var rise = parseFloat(cups.hero.el.style.getPropertyValue('--rise')) || 0;
    var lift = a.height * asomarse;
    var aDocTop = a.top + y + rise * lift - lift;
    var startTop = headerH + 14;
    travel.d0 = Math.max(24, Math.round(aDocTop - startTop));
    travel.a = { cx: a.left + a.width / 2, top: aDocTop - travel.d0, w: a.width };

    // Destino: su lugar junto a la carta, cuando esa columna queda fija.
    var grid = menuAside.parentElement;
    var stickyTop = parseFloat(getComputedStyle(menuAside).top) || 0;
    var aside = menuAside.getBoundingClientRect();
    var b = cups.menu.el.getBoundingClientRect();
    var asideDocTop = grid.getBoundingClientRect().top + y;
    travel.s1 = Math.max(travel.d0 + 1, asideDocTop - stickyTop);
    travel.b = { cx: b.left + b.width / 2, top: stickyTop + (b.top - aside.top), w: b.width };

    travel.baseW = a.width;
    travel.ratio = a.width / a.height;
    traveler.el.style.setProperty('--cup-w', a.width + 'px');
    travel.ready = travel.s1 - travel.d0 > vh * 0.25;
  }

  function setPhase(p) {
    if (p === travel.phase) return;
    var prev = travel.phase;
    travel.phase = p;
    var heroHidden = p >= 1, menuHidden = p <= 1;
    cups.hero.el.classList.toggle('is-hidden-by-traveler', heroHidden);
    cups.menu.el.classList.toggle('is-hidden-by-traveler', menuHidden);
    traveler.el.classList.toggle('is-active', p === 1);
    if (p === 1) { traveler.setMood(currentMood.mood); travel.lastX = travel.lastY = null; }
    if (p === 2 && prev === 1) {
      cups.menu.impulse(-3);
      if (cups.menu.bubble) popBubble(cups.menu.bubble);
    }
  }

  function releaseTraveler() {
    if (!traveler) return;
    traveler.el.classList.remove('is-active');
    cups.hero && cups.hero.el.classList.remove('is-hidden-by-traveler');
    cups.menu && cups.menu.el.classList.remove('is-hidden-by-traveler');
    travel.phase = -1;
  }

  function updateTravel(y) {
    if (!travel.ready || !travelAllowed()) { releaseTraveler(); return 0; }
    var p = y < travel.d0 ? 0 : (y < travel.s1 ? 1 : 2);
    setPhase(p);
    if (p !== 1) return 0;

    // Recorrido definido: de la portada (arriba a la derecha) a su lugar junto
    // a la carta, bajando por el borde libre de la página con un leve vaivén.
    var t = (y - travel.d0) / (travel.s1 - travel.d0);
    var A = travel.a, B = travel.b;
    var te = easeInOutSine(t);
    var w = lerp(A.w, B.w, te);
    var scale = w / travel.baseW;
    var baseH = travel.baseW / travel.ratio;
    var sway = Math.sin(t * Math.PI * 2) * Math.min(44, window.innerWidth * 0.03) * (1 - t * 0.4);
    var cx = lerp(A.cx, B.cx, easeInOutCubic(t)) + sway;
    var top = lerp(A.top, B.top, te);
    var rot = Math.sin(t * Math.PI * 2) * -8;
    var left = cx - travel.baseW / 2;
    var elTop = top - (baseH - baseH * scale) / 2;
    traveler.el.style.transform = 'translate3d(' + left.toFixed(1) + 'px,' + elTop.toFixed(1) + 'px,0) scale(' +
      scale.toFixed(4) + ') rotate(' + rot.toFixed(2) + 'deg)';
    // Mientras viaja, el vapor se aquieta y el café se mece con el movimiento.
    traveler.el.style.setProperty('--steam', (0.4 + 0.6 * Math.abs(t - 0.5) * 2).toFixed(2));
    var force = travel.lastX === null ? 0 : clamp(-(cx - travel.lastX) * 1.6 - (top - travel.lastY) * 0.4, -60, 60);
    travel.lastX = cx; travel.lastY = top;
    return force;
  }

  /* 5. Efectos ligados al scroll --------------------------------------- */
  var lastY = window.scrollY, lastT = performance.now(), scrollVel = 0;

  function updateScroll(now) {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var dt = Math.max(16, now - lastT);
    scrollVel = lerp(scrollVel, (y - lastY) / dt * 16, 0.35);
    lastY = y; lastT = now;
    var motion = !reduceMotion.matches;

    // Portada: la tazita se desprende del logotipo y el vapor sube y se desvanece.
    if (cups.hero) {
      var riseDist = travelAllowed() && travel.ready ? travel.d0 : vh * 0.2;
      var rise = motion ? clamp(y / riseDist, 0, 1) : 0;
      cups.hero.el.style.setProperty('--rise', rise.toFixed(3));
      cups.hero.el.style.setProperty('--steam', motion ? clamp(1 - y / (vh * 0.55), 0, 1).toFixed(3) : '1');
      // filter (no opacity) para no chocar con la animación de entrada de la burbuja.
      if (cups.hero.bubble) cups.hero.bubble.style.filter = motion ? 'opacity(' + clamp(1 - rise * 1.4, 0, 1).toFixed(2) + ')' : '';
      if (motion && !travelAllowed()) {
        // Móvil: sin viaje; la tazita se inclina y sube un poco más lento que el texto.
        var p = clamp(y / vh, 0, 1);
        cups.hero.el.style.setProperty('--tilt-r', (-9 * p).toFixed(2) + 'deg');
        cups.hero.el.style.setProperty('--tilt-y', (p * 30).toFixed(1) + 'px');
      }
    }
    if (motion) {
      beans.forEach(function (b, i) { b.style.setProperty('--parallax', (y * (0.08 + i * 0.05)).toFixed(1)); });
    }

    var travelForce = motion ? updateTravel(y) : 0;

    // Pie de página: la tazita termina su recorrido asomándose otra vez.
    if (cups.footer && footer) {
      var ft = footer.getBoundingClientRect().top;
      var landed = motion ? clamp((vh - ft) / (vh * 0.5), 0, 1) : 1;
      var fe = cups.footer.el;
      fe.style.setProperty('--landed', easeInOutSine(landed).toFixed(3));
      fe.style.opacity = landed.toFixed(3);
      if (landed >= 0.98 && !fe.dataset.greeted) {
        fe.dataset.greeted = '1';
        if (cups.footer.bubble) popBubble(cups.footer.bubble);
        cups.footer.impulse(3);
      } else if (landed < 0.3) {
        delete fe.dataset.greeted;
      }
    }
    return { scrollForce: motion ? clamp(-scrollVel * 0.5, -30, 30) : 0, travelForce: travelForce };
  }

  /* 6. Cursor (escritorio) --------------------------------------------- */
  var pointer = null;
  function onPointer(e) {
    if (!finePointer.matches || reduceMotion.matches) return;
    pointer = { x: e.clientX, y: e.clientY };
    wake();
  }
  function onPointerLeave() { pointer = null; wake(); }

  function updateTilt(cup) {
    if (!cup || reduceMotion.matches || !finePointer.matches) return;
    var r = cup.el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight || !pointer) {
      cup.el.style.setProperty('--tilt-x', '0px');
      cup.el.style.setProperty('--tilt-y', '0px');
      cup.el.style.setProperty('--tilt-r', '0deg');
      return;
    }
    var dx = clamp((pointer.x - (r.left + r.width / 2)) / 520, -1, 1);
    var dy = clamp((pointer.y - (r.top + r.height / 2)) / 520, -1, 1);
    cup.el.style.setProperty('--tilt-x', (dx * 10).toFixed(1) + 'px');
    cup.el.style.setProperty('--tilt-y', (dy * 6).toFixed(1) + 'px');
    cup.el.style.setProperty('--tilt-r', (dx * 7).toFixed(2) + 'deg');
  }

  /* 7. Bucle de animación (solo corre mientras hace falta) -------------- */
  var rafId = 0, lastFrame = 0, idleFrames = 0, needsMeasure = true;

  function wake() {
    idleFrames = 0;
    if (!rafId) { lastFrame = performance.now(); rafId = requestAnimationFrame(frame); }
  }
  function requestUpdate(measure) { if (measure) needsMeasure = true; wake(); }

  function frame(now) {
    rafId = 0;
    var dt = Math.min(0.05, Math.max(0.001, (now - lastFrame) / 1000));
    lastFrame = now;
    if (needsMeasure) { measureTravel(); needsMeasure = false; }
    var f = updateScroll(now);
    var busy = false;
    var visible = [cups.hero, cups.menu, cups.footer, traveler];
    visible.forEach(function (cup) {
      if (!cup) return;
      var force = cup === traveler ? f.travelForce : f.scrollForce * (cup.kind === 'footer' ? 0.6 : 1);
      if (reduceMotion.matches) force = 0;
      busy = cup.step(dt, force) || busy;
    });
    [cups.hero, cups.menu, traveler].forEach(updateTilt);
    if (Math.abs(scrollVel) > 0.05) busy = true;
    idleFrames = busy ? 0 : idleFrames + 1;
    if (idleFrames < 20) rafId = requestAnimationFrame(frame);
  }

  /* 8. Arranque -------------------------------------------------------- */
  applyConfig();
  window.addEventListener('scroll', function () { wake(); }, { passive: true });
  window.addEventListener('resize', function () { requestUpdate(true); });
  window.addEventListener('load', function () { requestUpdate(true); });
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('pointerleave', onPointerLeave);
  [reduceMotion, wide, finePointer].forEach(function (mq) {
    var fn = function () {
      Object.keys(cups).forEach(function (k) { cups[k].el.classList.toggle('is-alive', !reduceMotion.matches); });
      if (traveler) traveler.el.classList.toggle('is-alive', !reduceMotion.matches);
      if (!travelAllowed()) releaseTraveler();
      requestUpdate(true);
    };
    if (mq.addEventListener) mq.addEventListener('change', fn); else if (mq.addListener) mq.addListener(fn);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { requestUpdate(true); });

  // En móvil la tazita de la carta saluda cuando aparece en pantalla.
  if ('IntersectionObserver' in window && cups.menu) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !travelAllowed()) {
          if (cups.menu.bubble) popBubble(cups.menu.bubble);
          cups.menu.impulse(3);
        }
      });
    }, { threshold: 0.6 }).observe(cups.menu.el);
  }

  requestUpdate(true);

  /* 9. API para app.js -------------------------------------------------- */
  window.CGMascota = {
    setMood: function (mood, text) {
      currentMood = { mood: mood, text: text };
      if (cups.menu) cups.menu.setMood(mood, text, true);
      if (traveler) traveler.setMood(mood);
    },
    refresh: function () { requestUpdate(true); },
  };
})();
