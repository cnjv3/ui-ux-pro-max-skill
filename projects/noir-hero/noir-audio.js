// Ambient score generated with the Web Audio API: a low open-fifth drone,
// a slow filtered-noise "water" wash and a faint high shimmer, sent through a
// synthetic hall reverb. Nothing is downloaded and nothing plays until the
// visitor turns it on (browsers require a user gesture anyway).

function createImpulse(ctx, seconds, decay) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return buffer;
}

function createBrownNoise(ctx, seconds) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

export function createAmbientSound({ volume = 0.5 } = {}) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  let master = null;
  let tone = null;
  let suspendTimer = 0;
  let enabled = false;

  function lfo(frequency, depth, target) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = frequency;
    gain.gain.value = depth;
    osc.connect(gain).connect(target);
    osc.start();
  }

  function build() {
    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = 0;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -14;
    limiter.ratio.value = 4;
    master.connect(limiter).connect(ctx.destination);

    const reverb = ctx.createConvolver();
    reverb.buffer = createImpulse(ctx, 5, 2.4);
    const wet = ctx.createGain();
    wet.gain.value = 0.6;
    const dry = ctx.createGain();
    dry.gain.value = 0.55;
    reverb.connect(wet).connect(master);
    dry.connect(master);
    const bus = ctx.createGain();
    bus.connect(dry);
    bus.connect(reverb);

    // Drone: A1 / E2 / A2 / E3 with slow, independent breathing.
    tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 520;
    tone.Q.value = 0.5;
    tone.connect(bus);
    lfo(0.019, 160, tone.frequency);
    [
      [55.0, 0.3, 'sine', -3],
      [82.41, 0.15, 'sine', 4],
      [110.0, 0.08, 'triangle', -5],
      [164.81, 0.035, 'sine', 6],
    ].forEach(([freq, level, type, detune], i) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = detune;
      const gain = ctx.createGain();
      gain.gain.value = level;
      lfo(0.045 + i * 0.027, level * 0.4, gain.gain);
      osc.connect(gain).connect(tone);
      osc.start();
    });

    // Water wash.
    const noise = ctx.createBufferSource();
    noise.buffer = createBrownNoise(ctx, 8);
    noise.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 340;
    band.Q.value = 0.6;
    const wash = ctx.createGain();
    wash.gain.value = 0.07;
    lfo(0.07, 0.04, wash.gain);
    lfo(0.031, 90, band.frequency);
    noise.connect(band).connect(wash).connect(bus);
    noise.start();

    // Shimmer: a quiet E5 with a slow vibrato, only audible in the tail.
    const shimmer = ctx.createOscillator();
    shimmer.frequency.value = 659.25;
    lfo(0.18, 2.5, shimmer.frequency);
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.008;
    lfo(0.06, 0.006, shimmerGain.gain);
    shimmer.connect(shimmerGain).connect(reverb);
    shimmer.start();
  }

  return {
    get enabled() {
      return enabled;
    },
    get supported() {
      return Boolean(AudioCtx);
    },
    async enable() {
      if (!AudioCtx) return false;
      if (!ctx) build();
      clearTimeout(suspendTimer);
      await ctx.resume();
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(volume, now + 2.2);
      enabled = true;
      return true;
    },
    disable() {
      enabled = false;
      if (!ctx) return;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.7);
      clearTimeout(suspendTimer);
      suspendTimer = setTimeout(() => ctx.suspend(), 800);
    },
    // Pause/resume with tab visibility without changing the visitor's choice.
    pause() {
      if (ctx && enabled) ctx.suspend();
    },
    resume() {
      if (ctx && enabled) ctx.resume();
    },
    // Pointer x (-1..1) opens the filter slightly, so the sound follows the cursor.
    setBrightness(x) {
      if (!ctx || !enabled) return;
      tone.frequency.setTargetAtTime(520 + x * 140, ctx.currentTime, 0.6);
    },
    dispose() {
      clearTimeout(suspendTimer);
      ctx?.close();
      ctx = null;
    },
  };
}
