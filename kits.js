// Drum kits. Kick and bass are always synthesised. Other voices can use a sample instead:
// `smp` = sample names from samples/ (CC0, Versilian Community Sample Library),
// `rule` = 'alt' (alternate per hit) or 'vel' (accent → first, soft → second), plus `rate`, `cut` (seconds).
// If a sample can't load (e.g. opened as file://), the synth version plays instead.
// Every kit overrides parts of BASE. Voices: kick, snare, chh, ohh, perc, bass, plus master tone.

const SAMPLE_NAMES = ['conga', 'tumba', 'bongo_hi', 'bongo_lo', 'shaker_dn', 'shaker_up', 'clap1', 'clap2',
  'clave', 'wood', 'hat_closed', 'hat_open', 'tamb'];

const BASE = {
  kick:  { f0: 150, f1: 45, pd: 0.12, dec: 0.45, click: 0, vol: 1 },
  snare: { mode: 'snare', tone: 185, toneDec: 0.1, hp: 1000, dec: 0.2, vol: 0.7 },   // mode: snare | clap | rim
  chh:   { mode: 'noise', hp: 7500, dec: 0.045, vol: 0.35 },                          // mode: noise | metal | shaker
  ohh:   { mode: 'noise', hp: 7000, dec: 0.35, vol: 0.3 },
  perc:  { mode: 'rim', f: 900, dec: 0.06, vol: 0.45 },                               // mode: rim | conga | bongo | tom | click | tamb
  bass:  { wave: 'sine', f: 49, dec: 0.7, glide: 0, lp: 0, wobble: 0, vol: 0.7 },
  master: { lp: 16000, drive: 0 },
};

const KITS = {
  organic: {
    desc: 'Soft acoustic-style kick, real hand claps, live open hat, a shaker alternating up and down strokes, and congas (open on accents, low tumba on soft hits)',
    kick: { f0: 120, f1: 48, pd: 0.08, dec: 0.38 },
    snare: { mode: 'clap', vol: 0.55, smp: ['clap1', 'clap2'], rule: 'alt' },
    chh: { mode: 'shaker', hp: 5000, dec: 0.06, vol: 0.5, smp: ['shaker_dn', 'shaker_up'], rule: 'alt' },
    ohh: { hp: 6000, dec: 0.22, vol: 0.3, smp: ['hat_open'], cut: 0.3 },
    perc: { mode: 'conga', f: 210, dec: 0.22, vol: 0.8, smp: ['conga', 'tumba'], rule: 'vel' },
    bass: { f: 46, dec: 0.45, vol: 0.55 },
    master: { lp: 9000, drive: 0.15 } },
  downtempo: {
    desc: 'Round, low kick, wooden clave backbeat, real shaker and bongos (high on accents, low on soft hits), dark and soft',
    kick: { f0: 105, f1: 44, pd: 0.09, dec: 0.5 },
    snare: { mode: 'rim', vol: 0.4, smp: ['clave'], rate: 0.85 },
    chh: { mode: 'shaker', hp: 4500, dec: 0.07, vol: 0.45, smp: ['shaker_dn', 'shaker_up'], rule: 'alt' },
    ohh: { hp: 5500, dec: 0.3, vol: 0.25, smp: ['hat_open'], cut: 0.35, rate: 0.9 },
    perc: { mode: 'bongo', f: 330, dec: 0.15, vol: 0.7, smp: ['bongo_hi', 'bongo_lo'], rule: 'vel' },
    bass: { f: 44, dec: 0.6, vol: 0.55 },
    master: { lp: 7000, drive: 0.2 } },
  dusty: {
    desc: 'Muted kick, pitched-down clave as a rim, real hi-hats, woodblock clicks, low-passed and saturated like a sampled record',
    kick: { f0: 100, f1: 46, pd: 0.07, dec: 0.32, vol: 0.9 },
    snare: { mode: 'rim', vol: 0.4, smp: ['clave'], rate: 0.7 },
    chh: { hp: 6000, dec: 0.035, vol: 0.35, smp: ['hat_closed'], rate: 0.9 },
    ohh: { hp: 5500, dec: 0.18, vol: 0.25, smp: ['hat_open'], cut: 0.25, rate: 0.85 },
    perc: { mode: 'click', f: 2400, dec: 0.012, vol: 0.35, smp: ['wood'], rate: 1.3 },
    bass: { f: 41, dec: 0.4, vol: 0.55 },
    master: { lp: 4800, drive: 0.45 } },
  deep: {
    desc: '909-style kick, compressed clap, short 808 open hat, a real swung shaker, dusty top end',
    kick: { f0: 160, f1: 50, pd: 0.1, dec: 0.42, click: 0.2 },
    snare: { mode: 'clap', vol: 0.65 },
    chh: { mode: 'shaker', hp: 5000, dec: 0.06, vol: 0.42, smp: ['shaker_dn', 'shaker_up'], rule: 'alt' },
    ohh: { mode: 'metal', dec: 0.16, vol: 0.2 },
    perc: { mode: 'tom', f: 150, dec: 0.3, vol: 0.45 },
    master: { lp: 8000, drive: 0.2 } },
  techno: {
    desc: 'Driven 909 kick with click, metallic hats, rumbling sub',
    kick: { f0: 190, f1: 46, pd: 0.09, dec: 0.5, click: 0.6 },
    snare: { mode: 'clap', vol: 0.55 },
    chh: { mode: 'metal', dec: 0.035, vol: 0.25 },
    ohh: { mode: 'metal', dec: 0.25, vol: 0.22 },
    perc: { mode: 'rim', f: 700, dec: 0.08, vol: 0.4 },
    bass: { f: 41, dec: 0.22, lp: 180, wave: 'sawtooth', vol: 0.75 },
    master: { lp: 14000, drive: 0.5 } },
  breaks: {
    desc: 'Punchy acoustic-style kick, fat snare, real hi-hat and tambourine, crunchy sampled-break feel',
    kick: { f0: 130, f1: 55, pd: 0.05, dec: 0.25, click: 0.3 },
    snare: { tone: 210, toneDec: 0.08, hp: 1500, dec: 0.18, vol: 0.85 },
    chh: { hp: 8000, dec: 0.05, vol: 0.35, smp: ['hat_closed'] },
    perc: { mode: 'tamb', vol: 0.4, smp: ['tamb'] },
    bass: { f: 46, dec: 0.4 },
    master: { lp: 10000, drive: 0.4 } },
  reggaeton: {
    desc: 'Soft 808 kick, snappy dembow snare, airy hats, dreamy low end',
    kick: { f0: 110, f1: 45, pd: 0.1, dec: 0.4 },
    snare: { tone: 230, toneDec: 0.06, hp: 2500, dec: 0.12, vol: 0.55 },
    chh: { dec: 0.03, vol: 0.2 },
    perc: { mode: 'rim', f: 1100, dec: 0.05, vol: 0.35 },
    bass: { f: 44, dec: 0.5, vol: 0.6 },
    master: { lp: 8000, drive: 0.1 } },
  synthwave: {
    desc: 'LinnDrum-style punchy kick, huge gated snare, saw bass arp',
    kick: { f0: 140, f1: 50, pd: 0.06, dec: 0.3, click: 0.2 },
    snare: { tone: 180, toneDec: 0.12, hp: 900, dec: 0.38, vol: 0.85 },
    chh: { hp: 9000, dec: 0.04, vol: 0.25 },
    bass: { wave: 'sawtooth', f: 55, dec: 0.12, lp: 900, vol: 0.45 },
    master: { lp: 12000, drive: 0.15 } },
  ukg: {
    desc: 'Short punchy kick, high snappy snare, crisp hats, woody rimshot',
    kick: { f0: 170, f1: 52, pd: 0.06, dec: 0.28, click: 0.3 },
    snare: { tone: 260, toneDec: 0.05, hp: 2500, dec: 0.12, vol: 0.7 },
    chh: { mode: 'metal', dec: 0.03, vol: 0.25 },
    ohh: { mode: 'metal', dec: 0.14, vol: 0.2 },
    perc: { mode: 'rim', f: 1000, dec: 0.05, vol: 0.5 },
    bass: { f: 49, dec: 0.5 },
    master: { lp: 13000, drive: 0.15 } },
  funky: {
    desc: 'Tight kick, clap, bright hats, real congas',
    kick: { f0: 160, f1: 52, pd: 0.07, dec: 0.3, click: 0.2 },
    snare: { mode: 'clap', vol: 0.6 },
    chh: { mode: 'metal', dec: 0.035, vol: 0.22 },
    perc: { mode: 'tom', f: 190, dec: 0.2, vol: 0.7, smp: ['conga', 'tumba'], rule: 'vel' },
    master: { lp: 12000, drive: 0.15 } },
  gqom: {
    desc: 'Heavy, distorted low kick, big dark toms, lots of grit',
    kick: { f0: 120, f1: 40, pd: 0.12, dec: 0.55, click: 0.3 },
    snare: { mode: 'clap', vol: 0.55 },
    chh: { dec: 0.04, vol: 0.2 },
    perc: { mode: 'tom', f: 110, dec: 0.35, vol: 0.7 },
    master: { lp: 7000, drive: 0.7 } },
  dubstep: {
    desc: 'Deep kick, huge snare on 3, wobbling saw sub',
    kick: { f0: 140, f1: 42, pd: 0.1, dec: 0.45, click: 0.3 },
    snare: { tone: 190, toneDec: 0.12, hp: 1200, dec: 0.3, vol: 0.9 },
    chh: { dec: 0.035, vol: 0.22 },
    perc: { mode: 'rim', vol: 0.35 },
    bass: { wave: 'sawtooth', f: 41, dec: 0.4, lp: 600, wobble: 8, vol: 0.6 },
    master: { lp: 14000, drive: 0.3 } },
  dnb: {
    desc: 'Tight, clicky kick, loud bright snare, crisp hats, sub bass',
    kick: { f0: 180, f1: 55, pd: 0.04, dec: 0.22, click: 0.5 },
    snare: { tone: 240, toneDec: 0.07, hp: 2000, dec: 0.16, vol: 0.9 },
    chh: { hp: 9000, dec: 0.03, vol: 0.28 },
    ohh: { hp: 8000, dec: 0.2, vol: 0.22 },
    perc: { mode: 'rim', f: 1200, dec: 0.04, vol: 0.35 },
    bass: { f: 44, dec: 0.45 },
    master: { lp: 15000, drive: 0.25 } },
  footwork: {
    desc: 'Boomy 808 kick, 808 clap, clicky rim, sparse',
    kick: { f0: 110, f1: 45, pd: 0.12, dec: 0.6 },
    snare: { mode: 'clap', vol: 0.6 },
    perc: { mode: 'rim', f: 1500, dec: 0.035, vol: 0.4 },
    bass: { f: 46, dec: 0.5 },
    master: { lp: 12000, drive: 0.25 } },
  trap: {
    desc: 'Short kick, 808 clap, metallic hats with rolls, long 808 bass',
    kick: { f0: 160, f1: 50, pd: 0.05, dec: 0.25, click: 0.3 },
    snare: { mode: 'clap', vol: 0.75 },
    chh: { mode: 'metal', dec: 0.03, vol: 0.22 },
    bass: { f: 44, dec: 1.2, vol: 0.75 },
    master: { lp: 15000, drive: 0.3 } },
  drill: {
    desc: 'Short kick, snappy snare, metallic hats, sliding 808',
    kick: { f0: 160, f1: 50, pd: 0.05, dec: 0.25, click: 0.3 },
    snare: { tone: 220, toneDec: 0.05, hp: 2500, dec: 0.12, vol: 0.7 },
    chh: { mode: 'metal', dec: 0.03, vol: 0.22 },
    bass: { f: 44, dec: 1.0, glide: 7, vol: 0.75 },
    master: { lp: 13000, drive: 0.35 } },
  boombap: {
    desc: 'Thick kick, fat cracking snare, real hi-hats, dusty and low-passed',
    kick: { f0: 120, f1: 50, pd: 0.06, dec: 0.3, click: 0.4 },
    snare: { tone: 200, toneDec: 0.1, hp: 1200, dec: 0.22, vol: 0.9 },
    chh: { hp: 6500, dec: 0.04, vol: 0.35, smp: ['hat_closed'] },
    ohh: { hp: 6000, dec: 0.25, vol: 0.28, smp: ['hat_open'], cut: 0.3 },
    bass: { f: 46, dec: 0.4 },
    master: { lp: 6000, drive: 0.5 } },
};

// ---------- engine ----------
const Engine = (() => {
  let ctx, bus, shaper, lp, noiseBuf, openHat, kit = mergeKit('organic');
  const buffers = {}, rr = {};
  let samplesLoaded = 0;

  function loadSamples() {
    SAMPLE_NAMES.forEach(name =>
      fetch(`samples/${name}.wav`)
        .then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then(b => ctx.decodeAudioData(b))
        .then(buf => { buffers[name] = buf; samplesLoaded++; })
        .catch(() => {}));   // missing sample → synth fallback
  }
  function pickSample(track, p, val) {
    if (!p.smp) return null;
    let name;
    if (p.rule === 'vel') name = val === 2 ? p.smp[0] : (p.smp[1] || p.smp[0]);
    else { rr[track] = ((rr[track] || 0) + 1) % p.smp.length; name = p.smp[rr[track]]; }
    return buffers[name] || null;
  }
  function playSample(buf, t, v, p) {
    const s = ctx.createBufferSource(), g = gain();
    s.buffer = buf; s.playbackRate.value = p.rate || 1;
    g.gain.setValueAtTime(v * p.vol, t);
    if (p.cut) { g.gain.setValueAtTime(v * p.vol, t + p.cut * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + p.cut); }
    s.connect(g).connect(bus); s.start(t); if (p.cut) s.stop(t + p.cut + 0.02);
    return g;
  }

  function mergeKit(id) {
    const k = KITS[id] || {};
    const out = { desc: k.desc || '' };
    for (const v of Object.keys(BASE)) out[v] = { ...BASE[v], ...(k[v] || {}) };
    return out;
  }
  function curve(amount) {
    const n = 1024, c = new Float32Array(n), k = amount * 40;
    for (let i = 0; i < n; i++) { const x = i * 2 / n - 1; c[i] = k ? (1 + k) * x / (1 + k * Math.abs(x)) : x; }
    return c;
  }
  function applyMaster() {
    if (!ctx) return;
    shaper.curve = curve(kit.master.drive);
    lp.frequency.setTargetAtTime(kit.master.lp, ctx.currentTime, 0.02);
  }
  function init() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      bus = ctx.createGain(); bus.gain.value = 0.75;
      shaper = ctx.createWaveShaper(); shaper.oversample = '2x';
      lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.5;
      const out = ctx.createDynamicsCompressor(); out.threshold.value = -6; out.ratio.value = 4;
      bus.connect(shaper).connect(lp).connect(out).connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      applyMaster();
      loadSamples();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // helpers
  const env = (g, t, peak, dec) => { g.gain.setValueAtTime(Math.max(peak, 0.0002), t); g.gain.exponentialRampToValueAtTime(0.0001, t + dec); };
  const gain = () => ctx.createGain();
  const filt = (type, f, q) => { const x = ctx.createBiquadFilter(); x.type = type; x.frequency.value = f; if (q) x.Q.value = q; return x; };
  const noise = (t, dur) => { const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.playbackRate.value = 0.9 + Math.random() * 0.2; s.start(t); s.stop(t + dur); return s; };
  const osc = (type, f, t, dur) => { const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); o.start(t); o.stop(t + dur); return o; };

  const V = {
    kick(t, v, p) {
      const o = osc('sine', p.f0, t, p.dec + 0.05), g = gain();
      o.frequency.exponentialRampToValueAtTime(p.f1, t + p.pd);
      env(g, t, v * p.vol, p.dec); o.connect(g).connect(bus);
      if (p.click) { const cg = gain(); env(cg, t, v * p.click * 0.5, 0.012); noise(t, 0.02).connect(filt('highpass', 3000)).connect(cg).connect(bus); }
    },
    snare(t, v, p) {
      if (p.mode === 'clap') {
        const f = filt('bandpass', 1400, 0.9), g = gain(); f.connect(g).connect(bus);
        g.gain.setValueAtTime(0.0001, t);
        [0, 0.011, 0.022].forEach(o => { g.gain.setValueAtTime(v * p.vol, t + o); g.gain.exponentialRampToValueAtTime(v * p.vol * 0.15, t + o + 0.009); });
        g.gain.setValueAtTime(v * p.vol * 0.8, t + 0.033); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.033 + p.dec);
        noise(t, 0.05 + p.dec).connect(f);
        return;
      }
      if (p.mode === 'rim') {
        const o = osc('triangle', 1700, t, 0.05), g = gain(); env(g, t, v * p.vol, 0.03); o.connect(filt('highpass', 600)).connect(g).connect(bus);
        const o2 = osc('square', 470, t, 0.03), g2 = gain(); env(g2, t, v * p.vol * 0.3, 0.015); o2.connect(g2).connect(bus);
        return;
      }
      const g = gain(); env(g, t, v * p.vol, p.dec);
      noise(t, p.dec + 0.05).connect(filt('highpass', p.hp)).connect(g).connect(bus);
      const o = osc('triangle', p.tone, t, p.toneDec + 0.05), og = gain();
      o.frequency.exponentialRampToValueAtTime(p.tone * 0.8, t + p.toneDec);
      env(og, t, v * p.vol * 0.7, p.toneDec); o.connect(og).connect(bus);
    },
    hat(t, v, p, open) {
      const g = gain();
      if (p.mode === 'shaker') {
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * p.vol, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.012 + p.dec);
        noise(t, p.dec + 0.03).connect(filt('bandpass', p.hp + 1000, 1.2)).connect(g).connect(bus);
      } else if (p.mode === 'metal') {
        env(g, t, v * p.vol, p.dec);
        const hp = filt('highpass', 7000), bp = filt('bandpass', 10000, 0.8);
        [2, 3, 4.16, 5.43, 6.79, 8.21].forEach(r => osc('square', 40 * r * 1.0, t, p.dec + 0.05).connect(bp));
        bp.connect(hp).connect(g).connect(bus);
      } else {
        env(g, t, v * p.vol, p.dec);
        noise(t, p.dec + 0.05).connect(filt('highpass', p.hp)).connect(g).connect(bus);
      }
      if (open) openHat = g;
      return g;
    },
    perc(t, v, p) {
      const g = gain();
      if (p.mode === 'conga' || p.mode === 'bongo' || p.mode === 'tom') {
        const o = osc('sine', p.f * (p.mode === 'tom' ? 1.4 : 1.25), t, p.dec + 0.05);
        o.frequency.exponentialRampToValueAtTime(p.f, t + (p.mode === 'tom' ? 0.08 : 0.025));
        env(g, t, v * p.vol, p.dec); o.connect(g).connect(bus);
        const ng = gain(); env(ng, t, v * p.vol * 0.25, 0.015);
        noise(t, 0.02).connect(filt('bandpass', p.f * 6, 1)).connect(ng).connect(bus);
      } else if (p.mode === 'click') {
        const o = osc('triangle', p.f, t, 0.03); env(g, t, v * p.vol, p.dec); o.connect(g).connect(bus);
      } else if (p.mode === 'tamb') {
        [0, 0.012, 0.024].forEach((o, i) => {
          const gg = gain(); env(gg, t + o, v * p.vol * (1 - i * 0.25), 0.05);
          noise(t + o, 0.07).connect(filt('bandpass', 8500, 2)).connect(gg).connect(bus);
        });
      } else {
        const o = osc('triangle', p.f, t, 0.08); o.frequency.exponentialRampToValueAtTime(p.f * 0.66, t + 0.03);
        env(g, t, v * p.vol, p.dec); o.connect(g).connect(bus);
        const ng = gain(); env(ng, t, v * p.vol * 0.5, 0.02);
        noise(t, 0.03).connect(filt('bandpass', 2500, 1.5)).connect(ng).connect(bus);
      }
    },
    bass(t, v, p, stepDur) {
      const o = osc(p.wave, p.f * (p.glide ? Math.pow(2, p.glide / 12) : 1.4), t, p.dec + 0.1), g = gain();
      o.frequency.exponentialRampToValueAtTime(p.f, t + (p.glide ? 0.12 : 0.06));
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v * p.vol, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p.dec);
      let node = o;
      if (p.lp) {
        const f = filt('lowpass', p.lp, 6); node = node.connect(f);
        if (p.wobble) {
          const l = osc('sine', p.wobble / (stepDur * 16), t, p.dec + 0.1), lg = gain(); // wobble = cycles per bar
          lg.gain.value = p.lp * 0.8; l.connect(lg).connect(f.frequency);
        }
      }
      node.connect(g).connect(bus);
    },
  };

  return {
    init,
    setKit(id) { kit = mergeKit(id); applyMaster(); return kit; },
    play(track, val, t, stepDur) {
      const v = val === 2 ? 1 : 0.45;
      const hits = val === 3 ? 3 : 1;
      for (let i = 0; i < hits; i++) {
        const tt = t + i * stepDur / 3, vv = val === 3 ? 0.55 : v;
        if (track === 'chh' && openHat) { try { openHat.gain.cancelScheduledValues(tt); openHat.gain.setTargetAtTime(0.0001, tt, 0.005); } catch {} openHat = null; }
        const buf = pickSample(track, kit[track], val);
        if (buf) { const g = playSample(buf, tt, vv, kit[track]); if (track === 'ohh') openHat = g; continue; }
        if (track === 'chh') V.hat(tt, vv, kit.chh, false);
        else if (track === 'ohh') V.hat(tt, vv, kit.ohh, true);
        else if (track === 'bass') V.bass(tt, vv, kit.bass, stepDur);
        else V[track](tt, vv, kit[track]);
      }
    },
    get ctx() { return ctx; },
    get samplesLoaded() { return samplesLoaded; },
  };
})();
