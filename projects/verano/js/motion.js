/* =========================================================================
   VÉRANO — Sistema de movimiento
   GSAP 3 + ScrollTrigger + SplitText (vendor/gsap, licencia «no charge»).

   Arquitectura
   - Intro y hero: una sola línea de tiempo, se ejecuta una vez por carga.
   - Revelados al hacer scroll: declarativos vía atributos data-* y creados
     dentro de gsap.matchMedia(), que los revierte por completo (incluidos
     los SplitText) al cambiar de breakpoint o al llamar a destroy().
   - Hooks para la interfaz: switchPanel (carta) y mobileMenu.
   - Movimiento reducido: sin revelados ni parallax; el contenido queda
     visible y las interacciones funcionan igual (ver MOTION.md).

   Atributos
   data-split="heading"   titular revelado por líneas (máscara)
   data-split="lines"     párrafo revelado por líneas
   data-reveal="fade"     aparición suave
   data-reveal="stagger"  hijos escalonados
   data-reveal="from-left|from-right|from-bottom|from-side"
   data-reveal="draw"     línea que se dibuja (scaleX)
   data-reveal="mask"     fotografía revelada por máscara (+ data-reveal-dir)
   data-reveal="clip"     fotografía revelada por clip-path desde una ranura
   data-reveal="step"     pasos del proceso
   data-parallax="6"      parallax moderado (yPercent ±n, mitad en móvil)
   ========================================================================= */
(function () {
  'use strict';

  var html = document.documentElement;
  var V = window.VERANO = window.VERANO || {};
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var SplitText = window.SplitText;

  /* Si el script se carga dos veces (recarga en caliente, inserción
     duplicada), se limpia la instancia anterior antes de continuar. */
  if (V.motion && typeof V.motion.destroy === 'function') V.motion.destroy();

  function markReady() {
    html.classList.add('motion-ready');
    clearTimeout(window.__veranoFailsafe);
  }
  function rememberIntro() {
    try { window.sessionStorage.setItem('verano:intro', '1'); } catch (e) {}
  }
  function updateFloat() { if (V.updateFloat) V.updateFloat(); }

  /* ------------------------------------------- Sin GSAP: todo visible */
  if (!gsap || !ScrollTrigger) {
    html.classList.remove('motion', 'has-intro');
    html.classList.add('motion-failed');
    rememberIntro();
    markReady();
    V.motion = null;
    updateFloat();
    return;
  }

  /* La red de seguridad del <head> ya dejó todo visible (carga muy lenta):
     no se reocultan contenidos ni se repite la entrada. */
  if (html.classList.contains('motion-failed')) {
    html.classList.remove('motion', 'has-intro', 'intro-static');
    rememberIntro();
    markReady();
    V.motion = null;
    updateFloat();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });

  var EASE = {
    reveal: 'expo.out',      /* entradas de texto y máscaras */
    soft: 'power3.out',      /* apariciones secundarias */
    wipe: 'power4.inOut',    /* máscaras de imagen */
    curtain: 'expo.inOut',   /* telón de la intro */
    exit: 'power2.in'        /* salidas (siempre más rápidas) */
  };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return gsap.utils.toArray((root || document).querySelectorAll(sel)); }
  /* Revelado de una sola vez. Se usa toggleActions en lugar de once:true:
     los ScrollTrigger con once se autodestruyen durante un refresh() y, si
     el sistema se reconstruye a mitad de página (cambio de breakpoint al
     girar una tablet), GSAP puede encontrarse un hueco en su lista. */
  function once(trigger, start) {
    return { trigger: trigger, start: start || 'top 85%', toggleActions: 'play none play none' };
  }

  /* Revelado con valores finales explícitos (fromTo). Con from() GSAP toma
     como estado final el estilo computado en ese instante, y una transición
     CSS sobre la misma propiedad (p. ej. opacity en .btn) puede dejar el
     elemento invisible para siempre. Misma firma que gsap.from(). */
  var END = { opacity: 1, x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1, scaleX: 1, scaleY: 1 };
  function reveal(targets, vars) {
    var from = {}, to = { clearProps: 'transform' };
    Object.keys(vars).forEach(function (k) {
      if (k in END) { from[k] = vars[k]; to[k] = END[k]; }
      else if (k === 'transformOrigin') from[k] = vars[k];
      else to[k] = vars[k];
    });
    if (to.clearProps === false) delete to.clearProps;
    return gsap.fromTo(targets, from, to);
  }

  /* Tras construir a mitad de página (enlace profundo, recarga, giro de
     pantalla) GSAP no dispara onEnter en disparadores ya superados: lo que
     quedó atrás pasa a su estado final sin animar y lo visible se anima. */
  function settle() {
    var y = window.pageYOffset;
    ScrollTrigger.getAll().forEach(function (st) {
      var a = st.animation;
      if (!a || st.vars.scrub || a.progress() === 1) return;
      if (st.end <= y) a.progress(1);
      else if (st.start <= y) a.play();
    });
  }

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var Motion = {
    enabled: html.classList.contains('motion') && !mqReduce.matches,
    mm: null,
    _menuIntro: null,
    _menuIntroDone: false,
    _switch: null,
    _mmenu: null,

    /* Crea todas las animaciones de scroll. Idempotente: destruye antes. */
    init: function () {
      if (this.mm) this.destroy();
      var self = this;
      this.mm = gsap.matchMedia();
      this.mm.add({
        desktop: '(min-width: 900px)',
        mobile: '(max-width: 899px)',
        reduce: '(prefers-reduced-motion: reduce)'
      }, function (ctx) {
        self.enabled = !ctx.conditions.reduce;
        html.classList.toggle('motion', self.enabled);
        if (!self.enabled) return; /* estado final, sin animaciones complejas */
        var c = ctx.conditions;
        var hero = $('#inicio');
        if (hero) buildScroll(c, hero);

        /* El resto de secciones se construye con un viewport de antelación. */
        var roots = $$('main > section:not(#inicio), .footer');
        if (!('IntersectionObserver' in window)) {
          roots.forEach(function (r) { buildScroll(c, r); });
          return function () { self._menuIntro = null; };
        }
        var built = [];
        var io = new IntersectionObserver(function (entries) {
          var any = false;
          entries.forEach(function (en) {
            if (!en.isIntersecting || built.indexOf(en.target) !== -1) return;
            built.push(en.target);
            io.unobserve(en.target);
            ctx.add(function () { buildScroll(c, en.target); });
            any = true;
          });
          if (any) settle();
        }, { rootMargin: '0px 0px 100% 0px' });
        roots.forEach(function (r) { io.observe(r); });

        return function () {
          io.disconnect();
          self._menuIntro = null;
        };
      });
    },

    /* Revierte animaciones, ScrollTriggers y SplitText creados en init(). */
    destroy: function () {
      if (this._switch) { this._switch.progress(1).kill(); this._switch = null; }
      if (this._mmenu) { this._mmenu.progress(1).kill(); this._mmenu = null; }
      if (this.mm) { this.mm.revert(); this.mm = null; }
    },

    refresh: function () { ScrollTrigger.refresh(); },
    switchPanel: switchPanel,
    mobileMenu: mobileMenu
  };
  V.motion = Motion;

  /* =========================================================== SCROLL */
  /* Construye las animaciones de UNA sección (root). Se llama para la
     portada al arrancar y para cada sección justo antes de que entre en
     pantalla: repartir el trabajo evita un bloqueo largo en la carga
     (importante en Android) y mantiene la limpieza dentro de matchMedia. */
  function buildScroll(c, root) {
    var desktop = !!c.desktop;
    var id = root.id;

    /* Portada: parallax moderado de la imagen y salida suave del texto. */
    if (id === 'inicio') {
      gsap.to($('[data-hero-img]', root), {
        yPercent: desktop ? 12 : 6,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to($('.hero__content', root), {
        y: desktop ? -70 : -30,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true }
      });
      return;
    }

    /* Titulares: líneas que suben dentro de su máscara. */
    $$('[data-split="heading"]', root).forEach(function (el) {
      if (!SplitText) { fadeUp(el); return; }
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'line', tag: 'span', aria: 'none', autoSplit: true,
        onSplit: function (self) {
          return reveal(self.lines, {
            yPercent: 110, duration: 1.15, ease: EASE.reveal, stagger: 0.1,
            scrollTrigger: once(el, 'top 86%')
          });
        }
      });
    });

    /* Párrafos editoriales por líneas. */
    $$('[data-split="lines"]', root).forEach(function (el) {
      if (!SplitText) { fadeUp(el); return; }
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'line', tag: 'span', aria: 'none', autoSplit: true,
        onSplit: function (self) {
          return reveal(self.lines, {
            yPercent: 100, opacity: 0, duration: 1, ease: EASE.soft, stagger: 0.08,
            scrollTrigger: once(el, 'top 88%')
          });
        }
      });
    });

    $$('[data-reveal="fade"]', root).forEach(fadeUp);

    $$('[data-reveal="stagger"]', root).forEach(function (el) {
      reveal(el.children, {
        opacity: 0, y: 24, duration: 0.9, ease: EASE.soft, stagger: 0.1,
        scrollTrigger: once(el, 'top 88%')
      });
    });

    /* Elementos que entran desde direcciones distintas. */
    var dirs = {
      'from-left': { x: -48 }, 'from-right': { x: 48 }, 'from-bottom': { y: 48 },
      'from-side': desktop ? { x: 56 } : { y: 24 }
    };
    Object.keys(dirs).forEach(function (key) {
      $$('[data-reveal="' + key + '"]', root).forEach(function (el) {
        /* Los principios comparten disparador en escritorio (misma fila). */
        var group = desktop ? el.closest('.principles') : null;
        var vars = {
          opacity: 0, duration: 1.1, ease: EASE.reveal,
          delay: group ? Array.prototype.indexOf.call(group.children, el) * 0.12 : 0,
          scrollTrigger: once(group || el, 'top 86%')
        };
        if (dirs[key].x) vars.x = desktop ? dirs[key].x : dirs[key].x / 2;
        if (dirs[key].y) vars.y = dirs[key].y;
        reveal(el, vars);
      });
    });

    /* Líneas que se dibujan. */
    $$('[data-reveal="draw"]', root).forEach(function (el) {
      reveal(el, {
        scaleX: 0, transformOrigin: 'left center', duration: 1.4, ease: 'power3.inOut',
        scrollTrigger: once(el.closest('.principles') || el, 'top 92%')
      });
    });

    /* Fotografías reveladas por máscara (clip-path inset) + escala interior. */
    $$('[data-reveal="mask"]', root).forEach(function (el) {
      var dir = el.getAttribute('data-reveal-dir') || 'up';
      var from = dir === 'left' ? 'inset(0% 0% 0% 100%)' : dir === 'right' ? 'inset(0% 100% 0% 0%)' : 'inset(100% 0% 0% 0%)';
      var inner = $('.slot', el);
      var tl = gsap.timeline({ scrollTrigger: once(el, 'top 84%') });
      tl.fromTo(el, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: EASE.wipe, clearProps: 'clipPath' })
        .fromTo(inner, { scale: 1.22 }, { scale: 1, duration: 1.8, ease: EASE.soft }, 0);
      /* Experiencias: transición de filtro (blanco y negro → color). */
      if (el.closest('[data-exp]')) {
        tl.fromTo(inner, { filter: 'grayscale(1) brightness(0.72)' },
          { filter: 'grayscale(0) brightness(1)', duration: 1.6, ease: 'power2.out', clearProps: 'filter' }, 0.25);
      }
    });

    /* Proceso: imagen que se abre desde una ranura + etiquetas sincronizadas. */
    $$('[data-reveal="clip"]', root).forEach(function (el) {
      var tl = gsap.timeline({ scrollTrigger: once(el, 'top 80%') });
      tl.fromTo(el, { clipPath: 'inset(46% 6% 46% 6%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: EASE.curtain, clearProps: 'clipPath' })
        .fromTo($('.slot', el), { scale: 1.3 }, { scale: 1, duration: 2, ease: EASE.soft }, 0)
        .fromTo($$('[data-reveal="tag"]', el), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: EASE.soft, stagger: 0.16, clearProps: 'transform' }, 1.1);
    });

    /* Pasos: texto desde el lateral y línea de progreso ligada al scroll. */
    $$('[data-reveal="step"]', root).forEach(function (el) {
      reveal(el, {
        opacity: 0, x: desktop ? 40 : 0, y: desktop ? 0 : 20, duration: 0.9, ease: EASE.soft,
        scrollTrigger: once(el, 'top 88%')
      });
    });
    var progress = $('[data-steps-progress]', root);
    if (progress) {
      gsap.fromTo(progress, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: $('.steps-wrap', root), start: 'top 72%', end: 'bottom 62%', scrub: true }
      });
    }

    /* Parallax moderado. */
    $$('[data-parallax]', root).forEach(function (el) {
      var amt = parseFloat(el.getAttribute('data-parallax')) || 6;
      if (!desktop) amt *= 0.5;
      gsap.fromTo(el, { yPercent: -amt }, {
        yPercent: amt, ease: 'none',
        scrollTrigger: { trigger: el.parentNode, start: 'top bottom', end: 'bottom top', scrub: desktop ? 0.6 : true }
      });
    });

    /* Sello de marca: gira con el scroll (no gira solo). */
    var seal = $('[data-seal]', root);
    if (seal) {
      reveal(seal, { opacity: 0, scale: 0.8, duration: 1.1, ease: EASE.reveal, clearProps: false, scrollTrigger: once(seal, 'top 92%') });
      gsap.fromTo(seal, { rotation: -25 }, {
        rotation: 70, ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    /* Especialidades: entrada escalonada y texto desplazado por el scroll. */
    $$('.dish', root).forEach(function (dish) {
      var text = $('[data-scrub-text]', dish);
      reveal(text.children, {
        opacity: 0, y: 28, duration: 0.9, ease: EASE.soft, stagger: 0.08,
        scrollTrigger: once(dish, 'top 72%')
      });
      if (desktop) {
        gsap.fromTo(text, { y: 70 }, {
          y: -70, ease: 'none',
          scrollTrigger: { trigger: dish, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        });
      }
    });

    /* Carta: pestañas y primer panel. */
    var tabs = $('[data-menu-tabs]', root);
    if (tabs) {
      reveal($$('.menu__tab', tabs), {
        opacity: 0, y: 12, duration: 0.7, ease: EASE.soft, stagger: 0.05,
        scrollTrigger: once(tabs, 'top 90%')
      });
    }
    var stage = $('[data-menu-stage]', root);
    var first = stage && $('.menu-panel:not([hidden])', stage);
    if (first && !Motion._menuIntroDone) {
      Motion._menuIntro = gsap.timeline({
        scrollTrigger: once(stage, 'top 82%'),
        onComplete: function () { Motion._menuIntroDone = true; Motion._menuIntro = null; }
      });
      Motion._menuIntro
        .fromTo($('[data-panel-photo]', first), { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: EASE.wipe, clearProps: 'clipPath' })
        .fromTo($$('[data-panel-anim]', first), { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8, ease: EASE.soft, stagger: 0.08, clearProps: 'transform' }, 0.2)
        .fromTo($$('[data-menu-item]', first), { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, ease: EASE.soft, stagger: 0.06, clearProps: 'transform' }, 0.3);
    }

    /* Proceso → galería: el contenido se retira con suavidad al salir. */
    if (desktop && id === 'proceso') {
      gsap.to($('.process__grid', root), {
        y: -50, opacity: 0.45, ease: 'none',
        scrollTrigger: { trigger: root, start: 'bottom 65%', end: 'bottom top', scrub: true }
      });
    }

    /* Galería: las primeras piezas entran en horizontal. */
    var glist = $('[data-gallery-list]', root);
    if (glist) {
      reveal(gsap.utils.toArray(glist.children).slice(0, 4), {
        opacity: 0, x: desktop ? 140 : 60, duration: 1.3, ease: EASE.reveal, stagger: 0.09,
        scrollTrigger: once(glist, 'top 86%')
      });
    }

    /* Experiencias: texto escalonado (las imágenes usan la máscara). */
    $$('[data-exp]', root).forEach(function (el, i) {
      reveal($$(':scope > :not(.exp__figure)', el), {
        opacity: 0, y: 22, duration: 0.9, ease: EASE.soft, stagger: 0.07,
        delay: desktop ? i * 0.12 : 0,
        scrollTrigger: once(desktop ? el.parentNode : el, 'top 80%')
      });
    });

    /* Reservas: campos del formulario (opacity, nunca visibility, para que
       el tabulado no se salte campos aún no revelados). */
    var form = $('.form', root);
    if (form) {
      reveal($$(':scope > .field, :scope > .field-row, :scope > .form__submit', form), {
        opacity: 0, y: 20, duration: 0.8, ease: EASE.soft, stagger: 0.07,
        scrollTrigger: once(form, 'top 86%')
      });
    }

    /* Footer: logotipo. */
    var flogo = $('.footer__logo', root);
    if (flogo) {
      reveal(flogo, { yPercent: 30, opacity: 0, duration: 1.3, ease: EASE.reveal, scrollTrigger: once(flogo, 'top 95%') });
    }
  }

  function fadeUp(el) {
    reveal(el, { opacity: 0, y: 16, duration: 0.9, ease: EASE.soft, scrollTrigger: once(el, 'top 90%') });
  }

  /* ========================================================== CARTA */
  function switchPanel(stage, prev, next) {
    if (Motion._menuIntro) {
      if (Motion._menuIntro.scrollTrigger) Motion._menuIntro.scrollTrigger.kill();
      Motion._menuIntro.progress(1);
    }
    if (Motion._switch) Motion._switch.progress(1).kill();

    var prevEls = $$('[data-panel-photo], [data-panel-anim], [data-menu-item]', prev);
    var h0 = stage.offsetHeight;
    var tl = Motion._switch = gsap.timeline({
      onComplete: function () { Motion._switch = null; }
    });

    /* Salida breve (0,22 s): más rápida que la entrada. */
    tl.to(prevEls, { autoAlpha: 0, y: -10, duration: 0.22, ease: EASE.exit, stagger: 0.01 })
      .add(function () {
        prev.hidden = true;
        gsap.set(prevEls, { clearProps: 'opacity,visibility,transform' });
        next.hidden = false;
        /* Altura animada una sola vez: evita el salto sin animar el layout en bucle. */
        stage.style.height = '';
        var h1 = stage.offsetHeight;
        /* El refresh de ScrollTrigger (las secciones de abajo cambian de
           posición) se hace al terminar, nunca a mitad de la animación. */
        if (Math.abs(h1 - h0) > 2) {
          gsap.fromTo(stage, { height: h0, overflow: 'clip' }, {
            height: h1, duration: 0.5, ease: 'power3.inOut', clearProps: 'height,overflow',
            onComplete: function () { ScrollTrigger.refresh(); }
          });
        }
      })
      .fromTo($('[data-panel-photo]', next), { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: EASE.wipe, clearProps: 'clipPath' })
      .fromTo($$('[data-panel-anim]', next), { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE.soft, stagger: 0.06, clearProps: 'transform' }, '<0.05')
      .fromTo($$('[data-menu-item]', next), { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE.soft, stagger: 0.045, clearProps: 'transform' }, '<0.05');
    return tl;
  }

  /* ===================================================== MENÚ MÓVIL */
  function mobileMenu(open, panel, done) {
    var links = $$('.mmenu__list a', panel);
    var foot = $('[data-mmenu-foot]', panel);
    if (Motion._mmenu) Motion._mmenu.kill();
    if (open) {
      Motion._mmenu = gsap.timeline()
        .fromTo(panel, { yPercent: -100 }, { yPercent: 0, duration: 0.75, ease: EASE.reveal })
        .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: EASE.reveal, stagger: 0.06 }, 0.15)
        .fromTo(foot, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE.soft }, 0.35);
    } else {
      Motion._mmenu = gsap.timeline({
        onComplete: function () {
          gsap.set([panel, foot].concat(links), { clearProps: 'all' });
          Motion._mmenu = null;
          if (done) done();
        }
      })
        .to(links, { yPercent: -60, autoAlpha: 0, duration: 0.22, ease: EASE.exit, stagger: 0.02 })
        .to(foot, { autoAlpha: 0, duration: 0.2, ease: EASE.exit }, 0)
        .to(panel, { yPercent: -100, duration: 0.45, ease: 'power3.in' }, 0.08);
    }
  }

  /* ================================================== INTRO + PORTADA */
  function playHero() {
    var tl = gsap.timeline({ defaults: { ease: EASE.reveal } });
    var heroSlot = $('[data-hero-img] .slot');
    var title = $('.hero__title');
    var nav = $('[data-nav]');

    if (!Motion.enabled) {
      gsap.set('[data-hero], [data-nav]', { clearProps: 'opacity,visibility' });
      return tl;
    }

    /* Escalado lento de la imagen de fondo. */
    if (heroSlot) tl.fromTo(heroSlot, { scale: 1.16 }, { scale: 1, duration: 2.8, ease: 'power2.out', clearProps: 'transform' }, 0);
    tl.fromTo(nav, { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: 0.9, clearProps: 'transform' }, 0.45)
      .fromTo('[data-hero="brand"]', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.2);

    /* Titular por líneas; al terminar se deshace el split para que el
       texto vuelva a ser fluido y responsive. */
    if (SplitText && title) {
      var split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'line', tag: 'span', aria: 'none' });
      tl.set(title, { autoAlpha: 1 }, 0.3)
        .fromTo(split.lines, { yPercent: 112 }, {
          yPercent: 0, duration: 1.3, stagger: 0.12,
          onComplete: function () { split.revert(); }
        }, 0.3);
    } else {
      tl.fromTo(title, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 0.3);
    }

    tl.fromTo('[data-hero="lead"]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1, ease: EASE.soft }, 0.8)
      .fromTo('[data-hero="action"]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, ease: EASE.soft, stagger: 0.1, clearProps: 'transform' }, 1)
      .fromTo('[data-hero="scroll"]', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'none' }, 1.5);
    return tl;
  }

  function fontsReady(maxWait) {
    return new Promise(function (resolve) {
      var done = false;
      function finish() { if (!done) { done = true; resolve(); } }
      setTimeout(finish, maxWait);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(finish, finish);
      else finish();
    });
  }

  function runIntro() {
    var intro = $('[data-intro]');
    var hasIntro = intro && html.classList.contains('has-intro');

    if (!hasIntro) {
      fontsReady(500).then(playHero);
      return;
    }

    var inner = $('[data-intro-inner]', intro);
    var skipBtn = $('[data-intro-skip]', intro);
    var ended = false;
    var tl;

    function end() {
      if (ended) return;
      ended = true;
      html.classList.remove('has-intro', 'intro-static');
      rememberIntro();
      removeSkipListeners();
      gsap.set([intro, inner], { clearProps: 'all' });
      updateFloat();
    }

    function skip() {
      if (ended || !tl) return;
      if (tl.time() < tl.labels.reveal) tl.seek('reveal');
      tl.timeScale(2.4);
    }
    function onKey(e) {
      if (e.key === 'Tab' || e.key === 'Shift') return;
      skip();
    }
    var passive = { passive: true };
    function addSkipListeners() {
      skipBtn.addEventListener('click', skip);
      window.addEventListener('keydown', onKey);
      window.addEventListener('wheel', skip, passive);
      window.addEventListener('touchstart', skip, passive);
      intro.addEventListener('pointerdown', skip);
    }
    function removeSkipListeners() {
      skipBtn.removeEventListener('click', skip);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', skip, passive);
      window.removeEventListener('touchstart', skip, passive);
      intro.removeEventListener('pointerdown', skip);
    }

    if (!Motion.enabled) {
      /* Movimiento reducido: logotipo estático y fundido breve. */
      tl = gsap.timeline({ onComplete: end });
      tl.addLabel('reveal', 0.7)
        .to(intro, { autoAlpha: 0, duration: 0.45, ease: 'none' }, 'reveal')
        .add(playHero, 'reveal');
      addSkipListeners();
      return;
    }

    var chars = $$('.intro__char', intro);
    tl = gsap.timeline({ onComplete: end, defaults: { ease: EASE.reveal } });
    tl.fromTo(chars, { yPercent: 115, y: 0 }, { yPercent: 0, duration: 0.85, stagger: 0.05 }, 0.1)
      .fromTo($('.intro__line', intro), { scaleX: 0 }, { scaleX: 1, duration: 0.75, ease: 'power3.inOut' }, 0.45)
      .fromTo($('.intro__desc', intro), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE.soft }, 0.8)
      .fromTo(skipBtn, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'none' }, 0.25)
      .addLabel('reveal', 1.35)
      /* Telón: el panel sube y su contenido baja (máscara con profundidad). */
      .to(intro, { yPercent: -100, duration: 1, ease: EASE.curtain }, 'reveal')
      .to(inner, { yPercent: 40, autoAlpha: 0, duration: 0.9, ease: EASE.curtain }, 'reveal')
      .add(playHero, 'reveal+=0.12');
    /* El logotipo ya se mostró estático mientras cargaba el JS: directo al telón. */
    if (html.classList.contains('intro-static')) {
      tl.seek('reveal');
      html.classList.remove('intro-static');
    }
    addSkipListeners();
  }

  /* Al cruzar un breakpoint (p. ej. girar una tablet) ScrollTrigger mide la
     página con el scroll en 0 y, al recrear los disparadores, no restaura la
     posición. Se registra la sección visible y su avance relativo al terminar
     cada desplazamiento (antes de que el giro cambie el layout) y se vuelve
     a ese mismo punto de lectura. */
  function captureAnchor() {
    if (window.pageYOffset < 1) return null;
    var blocks = $$('main > section, .footer');
    for (var i = 0; i < blocks.length; i++) {
      var r = blocks[i].getBoundingClientRect();
      if (r.top <= 0 && r.bottom > 0) return { el: blocks[i], ratio: -r.top / r.height };
    }
    return null;
  }
  var anchorTimer;
  window.addEventListener('scroll', function () {
    clearTimeout(anchorTimer);
    anchorTimer = setTimeout(function () { Motion._anchor = captureAnchor(); }, 150);
  }, { passive: true });
  ScrollTrigger.addEventListener('matchMedia', function () {
    var a = Motion._anchor;
    if (!a) return;
    var r = a.el.getBoundingClientRect();
    window.scrollTo({ top: window.pageYOffset + r.top + a.ratio * r.height, behavior: 'instant' });
    ScrollTrigger.update();
  });

  /* ========================================================== ARRANQUE */
  mqReduce.addEventListener && mqReduce.addEventListener('change', function () {
    Motion.init();
  });

  Motion.init();
  markReady();
  runIntro();

  /* ScrollTrigger ya recalcula en 'load'; solo falta hacerlo si las fuentes
     terminan de cargar después (cambian la altura de los textos). */
  if (document.fonts && document.fonts.status !== 'loaded') {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();
