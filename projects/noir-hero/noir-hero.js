import { gsap } from 'gsap';
import { createAmbientSound } from './noir-audio.js';

const STAGE_SECONDS = 8;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clamp01 = (v) => Math.min(1, Math.max(0, v));

function pickQuality(requested) {
  if (requested === 'high' || requested === 'low') return { tier: requested, adaptive: false };
  // Phones/tablets and low-memory devices start light; everything else starts
  // at full quality and steps down at runtime if frames are slow.
  const coarse = matchMedia('(pointer: coarse)').matches;
  const small = Math.min(screen.width, screen.height) < 600;
  const lowMemory = (navigator.deviceMemory || 8) <= 4;
  return { tier: coarse || small || lowMemory ? 'low' : 'high', adaptive: true };
}

/**
 * Mounts the NOIR® hero inside `root` (the element carrying data-noir-hero).
 * Returns a small API: setStage(index) and destroy().
 */
export function mountNoirHero(root, { autoplay = true } = {}) {
  if (!root) return null;

  const pick = (name) => root.querySelector(`[data-noir="${name}"]`);
  const hero = root.querySelector('.noir-hero');
  const canvas = pick('canvas');
  const poster = pick('poster');
  const focusBox = pick('focus');
  const curtain = root.querySelector('.noir-hero__curtain');
  const stagesNav = pick('stages');
  const stageButtons = [...root.querySelectorAll('[data-stage]')];
  const stageFills = [...root.querySelectorAll('.noir-stage__fill')];
  const soundButton = pick('sound');
  const soundState = pick('sound-state');
  const scrollButton = pick('scroll');
  const scrollFill = pick('scroll-fill');
  const scrollDot = pick('scroll-dot');
  const orbLights = pick('orb-lights');

  const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = reduceQuery.matches;
  const quality = pickQuality(root.dataset.quality);
  const sound = createAmbientSound();

  let scene = null;
  let introTimeline = null;
  let activeStage = 0;
  let stageClock = null;
  let autoplayHeld = false;
  let inView = true;
  let destroyed = false;
  const cleanups = [];
  const listen = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  };

  // ------------------------------------------------------------ scene life

  function showFallback() {
    root.classList.add('noir--fallback');
    if (poster && poster.hidden) {
      poster.src = poster.dataset.src;
      poster.hidden = false;
    }
    scene?.dispose();
    scene = null;
  }

  function measure() {
    if (!scene) return;
    const frame = hero.getBoundingClientRect();
    const box = focusBox.getBoundingClientRect();
    scene.resize(frame.width, frame.height, {
      cx: (box.left - frame.left + box.width / 2) / frame.width,
      cy: (box.top - frame.top + box.height / 2) / frame.height,
      w: box.width / frame.width,
      h: box.height / frame.height,
    });
  }

  function syncRunning() {
    if (!scene) return;
    if (inView && !document.hidden) scene.start();
    else scene.stop();
  }

  async function loadScene() {
    const { createNoirScene } = await import('./noir-scene.js');
    const instance = await createNoirScene({
      canvas,
      quality: quality.tier,
      reducedMotion: reduced,
      onContextLost: showFallback,
    });
    if (destroyed) {
      instance.dispose();
      return null;
    }
    if (quality.adaptive) instance.enableAdaptiveQuality();
    scene = instance;
    scene.setStage(activeStage);
    measure();
    syncRunning();
    return scene;
  }

  function revealScene() {
    if (!scene) return;
    const at = introTimeline ? Math.max(0, 0.35 - introTimeline.time()) : 0;
    gsap.to(scene.intro, {
      reveal: 1,
      duration: reduced ? 0 : 2.1,
      delay: reduced ? 0 : at,
      ease: 'power2.inOut',
    });
  }

  // ----------------------------------------------------------------- intro

  function playIntro() {
    root.classList.add('noir--ready');
    const all = (name) => root.querySelectorAll(`[data-intro="${name}"]`);

    if (reduced) {
      gsap.set(root.querySelectorAll('[data-intro]'), { autoAlpha: 1 });
      gsap.set(curtain, { autoAlpha: 0 });
      return null;
    }

    return gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .to(curtain, { autoAlpha: 0, duration: 1.1, ease: 'power2.inOut' }, 0)
      .fromTo(all('nav'), { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06 }, 0.15)
      .fromTo(all('eyebrow'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.6)
      .fromTo(all('title'), { autoAlpha: 1, yPercent: 108 }, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.12 }, 0.7)
      .fromTo(all('body'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 1.15)
      .fromTo(all('cta'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 1.28)
      .fromTo(all('stage'), { autoAlpha: 0, x: 12 }, { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.07 }, 1.5)
      .fromTo(all('controls'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, stagger: 0.08 }, 1.6);
  }

  // ---------------------------------------------------------------- stages

  function setStage(index) {
    activeStage = (index + stageButtons.length) % stageButtons.length;
    stageButtons.forEach((button, i) => {
      if (i === activeStage) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    scene?.setStage(activeStage);

    // Rails read as a stepper: passed stages lit, the active one fills over time.
    stageFills.forEach((fill, i) => {
      if (i === activeStage) return;
      gsap.to(fill, { '--p': i < activeStage ? 1 : 0, duration: reduced ? 0 : 0.6, ease: 'power2.out', overwrite: true });
    });
    runStageClock();
  }

  function runStageClock() {
    stageClock?.kill();
    stageClock = null;
    const fill = stageFills[activeStage];
    if (!autoplay || reduced) {
      if (fill) gsap.set(fill, { '--p': 1, overwrite: true });
      return;
    }
    const target = fill || { '--p': 0 };
    stageClock = gsap.fromTo(
      target,
      { '--p': 0 },
      {
        '--p': 1,
        duration: STAGE_SECONDS,
        ease: 'none',
        overwrite: true,
        paused: autoplayHeld,
        onComplete: () => setStage(activeStage + 1),
      },
    );
  }

  function holdAutoplay(hold) {
    autoplayHeld = hold;
    if (!stageClock) return;
    if (hold || !inView || document.hidden) stageClock.pause();
    else stageClock.resume();
  }

  stageButtons.forEach((button) => {
    listen(button, 'click', () => setStage(Number(button.dataset.stage)));
  });
  listen(stagesNav, 'pointerenter', () => holdAutoplay(true));
  listen(stagesNav, 'pointerleave', () => holdAutoplay(false));
  listen(stagesNav, 'focusin', () => holdAutoplay(true));
  listen(stagesNav, 'focusout', (event) => {
    if (!stagesNav.contains(event.relatedTarget)) holdAutoplay(false);
  });

  // --------------------------------------------------------------- pointer

  const orbX = gsap.quickTo(orbLights, 'x', { duration: 0.8, ease: 'power3' });
  const orbY = gsap.quickTo(orbLights, 'y', { duration: 0.8, ease: 'power3' });

  function setPointer(x, y) {
    scene?.setPointer(x, y);
    sound.setBrightness(x);
    if (!reduced) {
      orbX(x * -3.2);
      orbY(y * 3.2);
    }
  }

  function pointerFrom(clientX, clientY) {
    const r = hero.getBoundingClientRect();
    setPointer(((clientX - r.left) / r.width) * 2 - 1, -(((clientY - r.top) / r.height) * 2 - 1));
  }

  listen(hero, 'pointermove', (event) => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') pointerFrom(event.clientX, event.clientY);
  });
  listen(hero, 'pointerleave', (event) => {
    if (event.pointerType === 'mouse') setPointer(0, 0);
  });
  // Touch: follow the finger without ever blocking the page scroll.
  const onTouch = (event) => {
    const touch = event.touches[0];
    if (touch) pointerFrom(touch.clientX, touch.clientY);
  };
  listen(hero, 'touchstart', onTouch, { passive: true });
  listen(hero, 'touchmove', onTouch, { passive: true });
  listen(hero, 'touchend', () => setPointer(0, 0), { passive: true });

  // ---------------------------------------------------------------- scroll

  function onScroll() {
    const r = root.getBoundingClientRect();
    const range = Math.max(1, r.height - window.innerHeight);
    const progress = clamp01(-r.top / range);
    scene?.setScroll(progress);
    gsap.set(scrollFill, { scaleY: progress });
    gsap.set(scrollDot, { y: progress * 6, backgroundColor: `rgba(240, 238, 233, ${progress * 0.9})` });
  }
  listen(window, 'scroll', onScroll, { passive: true });

  listen(scrollButton, 'click', () => {
    const r = root.getBoundingClientRect();
    const end = window.scrollY + r.bottom - window.innerHeight;
    const target = end - window.scrollY > 4 ? end : window.scrollY + r.bottom;
    window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
  });

  // ----------------------------------------------------------------- sound

  function renderSound(on) {
    soundButton.setAttribute('aria-pressed', String(on));
    soundButton.setAttribute('aria-label', on ? 'Turn ambient sound off' : 'Turn ambient sound on');
    soundState.textContent = on ? 'On' : 'Off';
  }
  if (!sound.supported) soundButton.hidden = true;
  renderSound(false);
  listen(soundButton, 'click', async () => {
    if (sound.enabled) {
      sound.disable();
      renderSound(false);
    } else {
      renderSound(await sound.enable());
    }
  });

  // ------------------------------------------------------------ visibility

  listen(document, 'visibilitychange', () => {
    syncRunning();
    if (document.hidden) sound.pause();
    else sound.resume();
    holdAutoplay(autoplayHeld);
  });

  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncRunning();
    holdAutoplay(autoplayHeld);
  });
  io.observe(hero);

  let resizeFrame = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      measure();
      onScroll();
    });
  });
  ro.observe(hero);

  const onMotionPreference = () => {
    reduced = reduceQuery.matches;
    scene?.setReducedMotion(reduced);
    runStageClock();
  };
  listen(reduceQuery, 'change', onMotionPreference);

  // ----------------------------------------------------------------- boot

  const scenePromise = loadScene().catch((error) => {
    console.warn('[noir] 3D scene unavailable, showing still frame.', error);
    showFallback();
    return null;
  });

  (async () => {
    const fonts = document.fonts ? Promise.race([document.fonts.ready, wait(1200)]) : Promise.resolve();
    await Promise.all([fonts, Promise.race([scenePromise, wait(1500)])]);
    if (destroyed) return;
    introTimeline = playIntro();
    onScroll();
    scenePromise.then(revealScene);
    if (introTimeline) introTimeline.eventCallback('onComplete', () => setStage(activeStage));
    else setStage(activeStage);
  })();

  return {
    setStage,
    destroy() {
      destroyed = true;
      cleanups.forEach((fn) => fn());
      io.disconnect();
      ro.disconnect();
      introTimeline?.kill();
      stageClock?.kill();
      sound.dispose();
      scene?.dispose();
      scene = null;
    },
  };
}
