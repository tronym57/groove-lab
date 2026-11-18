// Model:Cycles tutorial: our own drawing of the front panel (layout from the official manual, OS 1.13, p.10),
// a basics walkthrough, and a per-genre "program this groove" walkthrough built from the current grid.
// Knob values are starting points derived from this app's kit sounds, not Elektron presets.

const MC = (() => {
  // ---------- panel controls: id → [kind, x, y, label, secondary] ----------
  const C = {
    level:    ['knob', 51, 48, 'LEVEL / DATA', 'TRIG / PAN'],
    back:     ['key', 44, 149, 'BACK', 'PAD MENU', '↩'],
    settings: ['key', 119, 149, 'SETTINGS', 'TEMP SAVE', '⚙'],
    tempo:    ['key', 195, 149, 'TEMPO', 'TAP BPM', '◬'],
    record:   ['key', 44, 212, 'RECORD', 'COPY', '●'],
    play:     ['key', 119, 212, 'PLAY', 'CLEAR', '▶'],
    stop:     ['key', 195, 212, 'STOP', 'PASTE', '■'],
    machines: ['key', 271, 48, 'MACHINES', 'PRESET MENU', '◍'],
    punch:    ['key', 271, 114, 'PUNCH', 'QUANTIZE', '◈'],
    gate:     ['key', 271, 178, 'GATE', 'CLICK', '⌐'],
    lfo:      ['key', 271, 243, 'LFO', 'LFO SETUP', '∿'],
    func:     ['wide', 53, 276, 'FUNC', ''],
    retrig:   ['wide', 185, 276, 'RETRIG', 'RETRIG MENU'],
    pattern:  ['wide', 53, 339, 'PATTERN', 'RELOAD PTN'],
    track:    ['wide', 185, 339, 'TRACK', 'CTRL ALL / TRK MENU'],
    pitch:    ['tknob', 373, 48, 'PITCH'], decay: ['tknob', 471, 48, 'DECAY'],
    color:    ['tknob', 570, 48, 'COLOR'], shape: ['tknob', 668, 48, 'SHAPE'],
    sweep:    ['tknob', 373, 145, 'SWEEP'], contour: ['tknob', 471, 145, 'CONTOUR'],
    delay:    ['tknob', 570, 145, 'DELAY SEND'], reverb: ['tknob', 668, 145, 'REVERB SEND'],
    lfospeed: ['tknob', 373, 243, 'LFO SPEED'], vol: ['tknob', 471, 243, 'VOLUME + DIST'],
    swing:    ['tknob', 570, 243, 'SWING', 'NUDGE'], chance: ['tknob', 668, 243, 'CHANCE', 'COND'],
    main:     ['knob', 768, 48, 'MAIN VOLUME'],
    revsize:  ['knob', 768, 145, 'REVERB SIZE', 'REV TONE'],
    deltime:  ['knob', 768, 243, 'DELAY TIME', 'DEL FEEDBACK'],
    page:     ['pad', 768, 333, 'PAGE', 'FILL / SCALE'],
  };
  [271, 354, 437, 520, 602, 685].forEach((x, i) => C['t' + (i + 1)] = ['pad', x, 333, 'T' + (i + 1), `BANK ${'ABCDEF'[i]} / MUTE`]);
  for (let i = 0; i < 16; i++) C['trig' + (i + 1)] = ['trig', 43 + 49 * i, 406, String(i + 1)];

  const INFO = {
    level: 'Track level. Also edits values in every menu; press it to switch between NOTE, VEL and LEN while holding a trig.',
    back: 'Goes up one menu level. Within ~3 s it also reverts the last knob change.',
    settings: 'Patterns, projects, MIDI and settings. [FUNC] + [SETTINGS] = temporary save of the pattern.',
    tempo: 'Tempo menu (turn LEVEL/DATA). [FUNC] + [TEMPO] = tap tempo.',
    record: 'Grid recording on/off (lights red). Hold it and press [PLAY] for live recording. [FUNC] + [RECORD] = copy.',
    play: 'Play / pause. Holding a trig and pressing [PLAY] clears its locks. [FUNC] + [PLAY] = clear.',
    stop: 'Stop. [FUNC] + [STOP] = paste.',
    machines: 'Machine menu: pick KICK, SNARE, METAL, PERC, TONE or CHORD with LEVEL/DATA. [FUNC] + [MACHINES] = presets.',
    punch: 'Adds fixed compression and distortion to the active track. [FUNC] + [PUNCH] = quantize menu.',
    gate: 'Gate mode for the active track (notes held for the trig length). [FUNC] + [GATE] = metronome.',
    lfo: 'Hold [LFO] and turn a knob to make that parameter the LFO destination. [FUNC] + [LFO] = LFO setup.',
    func: 'Shift key: hold it to reach the secondary function printed under each key.',
    retrig: 'Hold a trig and press [RETRIG] to roll that step. [FUNC] + [RETRIG] = retrig setup for the pads.',
    pattern: '[PATTERN] + [T1–6] picks a bank, [PATTERN] + [TRIG] picks a pattern. [FUNC] + [PATTERN] reloads the saved pattern.',
    track: '[TRACK] + [T1–6] selects a track without playing it. Hold [TRACK] and turn a knob to change all tracks at once.',
    pitch: 'Tuning, −24 to +24 semitones. Hold [FUNC] to jump in semitones.', decay: 'Amp decay: how long the sound rings (0–127).',
    color: 'Machine parameter 1: different job per machine (see the step text).', shape: 'Machine parameter 2.',
    sweep: 'Machine parameter 3.', contour: 'Machine parameter 4.',
    delay: 'Send to the global delay.', reverb: 'Send to the global reverb.',
    lfospeed: 'LFO speed for the active track.', vol: 'Track volume. Above 60 it adds distortion.',
    swing: 'Track swing, 50–80% (50 = straight). Hold a trig + turn = nudge that step.',
    chance: 'Probability that the track\'s trigs play. Hold a trig + turn = trig condition (e.g. 1:2, FILL).',
    main: 'Main and headphone volume. Hold it to power on/off.', revsize: 'Global reverb size. [FUNC] = reverb tone.',
    deltime: 'Global delay time. [FUNC] = delay feedback.',
    page: 'Pattern page (for >16 steps). Hold it while playing = fill. [FUNC] + [PAGE] = length and scale.',
  };
  for (let i = 1; i <= 6; i++) INFO['t' + i] = `Pad for track ${i}: plays it and makes it active. [FUNC] + [T${i}] mutes it.`;
  for (let i = 1; i <= 16; i++) INFO['trig' + i] = `Step ${i}. In grid recording: tap = place/remove a trig; hold = edit it (note, velocity, locks).`;

  const NAME = id => {
    if (id.startsWith('trig')) return 'TRIG ' + id.slice(4);
    if (id === 'level') return 'LEVEL/DATA';
    return C[id][3];
  };
  const isKnob = id => C[id] && /knob/.test(C[id][0]);

  // ---------- SVG ----------
  function svg() {
    let s = `<svg viewBox="-12 -8 844 452" class="mcsvg" role="img" aria-label="Model:Cycles front panel">
      <defs><pattern id="mcRoll" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="3" height="6" class="rollf"/></pattern></defs>
      <rect x="-12" y="-8" width="844" height="452" rx="26" class="body"/>
      <rect x="236" y="14" width="456" height="262" rx="8" class="well"/>
      <rect x="92" y="18" width="118" height="62" rx="5" class="screen"/>
      <text x="151" y="53" class="scrtxt" id="mcScreen">Model:Cycles</text>
      <text x="151" y="104" class="brand">Model:Cycles</text>
      <g class="pageleds">${[0, 1, 2, 3].map(i => `<rect x="${741 + i * 14}" y="296" width="10" height="6" rx="2"/>`).join('')}</g>`;
    for (const [id, [kind, x, y, label, sub, glyph]] of Object.entries(C)) {
      s += `<g class="ctl" data-k="${id}" tabindex="0">`;
      if (kind === 'knob' || kind === 'tknob') {
        s += `<circle cx="${x}" cy="${y}" r="19" class="face"/><line x1="${x}" y1="${y - 6}" x2="${x}" y2="${y - 17}" class="ptr"/>`;
        if (kind === 'tknob') s += `<rect x="${x - 40}" y="${y - 22}" width="8" height="8" rx="2" class="led"/>`;
        s += `<text x="${x}" y="${y + 34}" class="lb">${label}</text>${sub ? `<text x="${x}" y="${y + 44}" class="sb">${sub}</text>` : ''}`;
      } else if (kind === 'key') {
        s += `<rect x="${x - 17}" y="${y - 17}" width="34" height="34" rx="8" class="face"/><text x="${x}" y="${y + 5}" class="gl">${glyph}</text>
              <text x="${x}" y="${y + 30}" class="lb">${label}</text>${sub ? `<text x="${x}" y="${y + 40}" class="sb">${sub}</text>` : ''}`;
      } else if (kind === 'wide') {
        s += `<rect x="${x - 27}" y="${y - 17}" width="54" height="34" rx="8" class="face"/><text x="${x}" y="${y + 4}" class="lb in">${label}</text>
              ${sub ? `<text x="${x}" y="${y + 30}" class="sb">${sub}</text>` : ''}`;
      } else if (kind === 'pad') {
        s += `<rect x="${x - 29}" y="${y - 27}" width="58" height="54" rx="9" class="face"/><text x="${x}" y="${y + 4}" class="lb in big">${label}</text>
              <text x="${x}" y="${y + 38}" class="sb">${sub}</text>`;
      } else {
        s += `<rect x="${x - 19}" y="${y - 19}" width="38" height="38" rx="7" class="face"/><text x="${x}" y="${y + 4}" class="lb in big${(+label - 1) % 4 === 0 ? ' u' : ''}">${label}</text>`;
      }
      s += `<g class="badge"></g></g>`;
    }
    return s + '</svg>';
  }

  // ---------- sound recipes (from the app's kit params) ----------
  const clamp = v => Math.round(Math.max(0, Math.min(127, v)));
  const semis = (f, ref) => Math.max(-24, Math.min(24, Math.round(12 * Math.log2(f / ref))));
  const sgn = n => (n > 0 ? '+' : '') + n;
  const NOTE = f => { const n = Math.round(12 * Math.log2(f / 440) + 69); return 'C C# D D# E F F# G G# A A# B'.split(' ')[n % 12] + (Math.floor(n / 12) - 1); };

  function recipe(kitId, tid) {
    const kit = KITS[kitId] || {}, k = { ...BASE[tid], ...(kit[tid] || {}) }, m = { ...BASE.master, ...(kit.master || {}) };
    const r = { machine: '', knobs: [], tips: [] };
    if (tid === 'kick') {
      r.machine = 'KICK';
      r.knobs = [['pitch', sgn(semis(k.f0, 150))], ['decay', clamp(k.dec * 120)], ['sweep', clamp(k.pd * 420)], ['contour', clamp((k.click || 0) * 100)]];
      if (m.drive >= 0.4) { r.knobs.push(['shape', 70]); r.tips.push('Gritty kit: high SHAPE plus CONTOUR gives the noisy, punchy kick (manual tip). Press [PUNCH] for extra weight.'); }
      else r.knobs.push(['shape', 15]);
    } else if (tid === 'snare') {
      r.machine = 'SNARE';
      if (k.mode === 'rim') {
        r.knobs = [['pitch', '+10'], ['decay', 90], ['shape', 64], ['contour', 30]];
        r.tips.push('Sidestick / rim: long DECAY, SHAPE halfway and some CONTOUR (manual tip).');
      } else if (k.mode === 'clap') {
        r.knobs = [['pitch', '+3'], ['decay', 40], ['color', 90], ['shape', 30]];
        r.tips.push('Clap: high COLOR makes it noisy. For the smeared clap attack, hold the trig → [RETRIG] → ON, RTE 1/64, LEN 1/16.');
      } else {
        r.knobs = [['pitch', sgn(Math.round((k.tone - 185) / 9))], ['decay', clamp(k.dec * 250)], ['color', 55], ['sweep', 25]];
        if (k.dec > 0.3) r.tips.push('Big gated snare: add REVERB SEND ≈ 60 and a bigger REVERB SIZE.');
      }
    } else if (tid === 'chh' || tid === 'ohh') {
      if (k.mode === 'shaker') {
        r.machine = 'PERC';
        r.knobs = [['pitch', '+20'], ['decay', 22], ['color', 110], ['shape', 100]];
        r.tips.push('Shaker: PERC with very high COLOR and SHAPE turns into noise. Alternate soft/loud velocities to fake the up/down stroke.');
      } else {
        r.machine = 'METAL';
        r.knobs = [['pitch', tid === 'chh' ? '+20' : '+16'], ['decay', clamp(k.dec * (tid === 'chh' ? 500 : 220))], ['shape', k.mode === 'metal' ? 60 : 35], ['sweep', 40]];
        r.tips.push('METAL wants a very high PITCH (manual tip). Turn COLOR and SWEEP for different cymbal tunings.');
      }
    } else if (tid === 'perc') {
      const mode = k.mode;
      if (mode === 'tamb') { r.machine = 'METAL'; r.knobs = [['pitch', '+22'], ['decay', 25], ['shape', 90]]; r.tips.push('Tambourine is closer to METAL than PERC.'); }
      else if (mode === 'click') { r.machine = 'PERC'; r.knobs = [['pitch', '+20'], ['decay', 4], ['shape', 10], ['color', 70]]; r.tips.push('Very short DECAY turns PERC into a click or woodblock tick.'); }
      else if (mode === 'rim') { r.machine = 'PERC'; r.knobs = [['pitch', sgn(semis(k.f, 250))], ['decay', clamp(k.dec * 250)], ['shape', 20], ['color', 60]]; }
      else {
        r.machine = 'PERC';
        r.knobs = [['pitch', sgn(semis(k.f, 250))], ['decay', clamp(k.dec * 250)], ['shape', 12], ['color', 30]];
        r.tips.push(`${mode === 'tom' ? 'Toms' : 'Hand drums'}: low SHAPE, then play with COLOR for the ringing body (manual tip). For high/low ${mode === 'bongo' ? 'bongo' : 'conga'} hits, hold a trig and turn PITCH to lock a different tuning.`);
      }
    } else if (tid === 'bass') {
      r.machine = 'TONE';
      const decay = ['decay', clamp(k.dec * 80)];
      if (k.wave === 'sawtooth') {
        r.knobs = [decay, ['color', '2.002'], ['shape', 20], ['sweep', 100], ['contour', 0]];
        r.tips.push('Nasty bass: low SHAPE, high SWEEP, no CONTOUR, COLOR slightly detuned at 2.002 (manual tip).');
      } else {
        r.knobs = [decay, ['color', '1.000'], ['shape', 0], ['sweep', 0], ['contour', 0]];
        r.tips.push('SHAPE at 0 = no FM = a clean sine sub, like an 808.');
      }
      r.tips.push(`Root note ≈ ${NOTE(k.f)}: hold a trig and turn LEVEL/DATA to set its NOTE.`);
      if (k.wobble) r.tips.push('Wobble: hold [LFO] and turn SHAPE to route the LFO, then set LFO SPEED (try 1/8 synced).');
      if (k.glide) r.tips.push('The Cycles has no glide: fake the slide with a PITCH lock on the next trig.');
    }
    return r;
  }

  // ---------- step builders ----------
  // seq: groups joined by "→", tokens in a group joined by "+". Knob tokens render as "turn X".
  const S = (title, seq, text, extra = {}) => ({ title, seq, text, ...extra });
  const hlOf = seq => [...new Set(seq.flat().map(t => t.replace(/^hold:/, '')))];

  const BASICS = [
    S('The layout', [['t1', 't2', 't3', 't4', 't5', 't6']], 'Six tracks, one sound each. Each track runs one of six FM machines: KICK, SNARE, METAL, PERC, TONE, CHORD. The 12 knobs always edit the <b>active</b> track (the red pad). The 16 trig keys are the 16 steps, exactly like the grid above.'),
    S('Pick a pattern slot', [['pattern', 't1'], ['pattern', 'trig1']], '[PATTERN] + [T1] chooses bank A, then [PATTERN] + [TRIG 1] loads pattern A01. Pick an empty slot so you start from scratch.'),
    S('Set the tempo', [['tempo'], ['level'], ['back']], 'Press [TEMPO] and turn LEVEL/DATA to the BPM. [BACK] closes the menu. Tap tempo: [FUNC] + [TEMPO].'),
    S('Choose a track and machine', [['track', 't1'], ['machines'], ['level'], ['back']], '[TRACK] + [T1] selects track 1 without playing it (pressing just the pad plays the sound). [MACHINES] opens the machine list; turn LEVEL/DATA to choose; [BACK] to leave.'),
    S('Shape the sound', [['pitch'], ['decay'], ['color', 'shape', 'sweep', 'contour']], 'PITCH and DECAY work the same on every machine. COLOR, SHAPE, SWEEP and CONTOUR change meaning per machine (e.g. on KICK, SWEEP is the pitch-drop depth; on TONE, SHAPE is the FM amount). Changed too much? Press [BACK] within ~3 s to undo.'),
    S('Grid record: place trigs', [['record'], ['trig1', 'trig5', 'trig9', 'trig13'], ['play']], '[RECORD] turns red = grid recording. Tap trig keys to place hits (tap again to remove). [PLAY] to listen. [RECORD] again to leave.', { trigs: 'X...X...X...X...' }),
    S('Soft hits: velocity', [['hold:trig3', 'level']], 'Hold a trig and turn LEVEL/DATA: the TRIG NOTE menu opens. Press LEVEL/DATA to switch between NOTE, VEL and LEN, set VEL ≈ 60–80 for a ghost note. This is the grid\'s "soft" state.', { trigs: '..x.............' }),
    S('Parameter locks', [['hold:trig5', 'decay']], 'Hold a trig and turn any knob: that value now only applies to this step (the trig key blinks). Clear a step\'s locks: hold it and press [PLAY]. Lock trig without sound: [FUNC] + [TRIG].'),
    S('Rolls: retrig a step', [['hold:trig16', 'retrig'], ['level']], 'Hold a trig and press [RETRIG]: the TRIG REPEAT menu. Set it ON, RTE 1/32 for doubles or 1/24 for triplet rolls. The FDE parameter fades the roll in or out. This is the grid\'s "roll" state.', { trigs: '...............r' }),
    S('Swing and nudge', [['swing'], ['hold:trig8', 'swing']], 'SWING is per track, 50–80% (same numbers as this app). Hold [TRACK] while turning to set every track at once. Hold a trig and turn SWING to nudge just that step early or late.'),
    S('Chance and conditions', [['chance'], ['hold:trig9', 'chance']], 'CHANCE sets the probability that the track\'s trigs play. Hold a trig and turn CHANCE for a trig condition: 1:2 (every other bar), FILL (only during a fill), etc.'),
    S('Perform: mute, fill, change all', [['func', 't3'], ['page'], ['track', 'decay']], '[FUNC] + [T3] mutes track 3. Hold [PAGE] while playing for a fill. Hold [TRACK] and turn a knob to move that parameter on all tracks.'),
    S('Save your work', [['func', 'settings'], ['settings']], '[FUNC] + [SETTINGS] = temporary save (snapshot you can go back to with [FUNC] + [PATTERN]). To keep it for good: [SETTINGS] → PATTERN → SAVE.'),
  ];

  const POS = ['', 'first', 'second', 'third', 'fourth'];
  const stepWords = arr => arr.map(i => i + 1).join(', ');

  function genreSteps(g, pattern, labelOf, TRACKS, kitId, bpm, swing) {
    const out = [];
    out.push(S('Start a fresh pattern', [['pattern', 't1'], ['pattern', 'trig1']], `Pick an empty slot: [PATTERN] + [T1] (bank A), then [PATTERN] + a free [TRIG]. Everything below programs <b>${g.name}</b> as it is on the grid right now, including your edits.`, { sec: 'Setup' }));
    out.push(S(`Tempo: ${bpm} BPM`, [['tempo'], ['level'], ['back']], `[TEMPO], turn LEVEL/DATA to <b>${bpm}</b>, [BACK].`, { sec: 'Setup', screen: `BPM ${bpm}.0` }));
    out.push(S('Grid recording on', [['record']], 'Press [RECORD]. It lights red and stays on for all the tracks below.', { sec: 'Setup', screen: 'GRID REC' }));
    TRACKS.forEach((tr, i) => {
      const p = pattern[tr.id];
      if (!p.some(v => v)) return;
      const n = i + 1, t = 't' + n, name = labelOf(tr.id), r = recipe(kitId, tr.id), sec = name;
      const acc = [], soft = [], roll = [];
      p.forEach((v, s) => (v === 2 ? acc : v === 1 ? soft : v === 3 ? roll : null)?.push(s));
      out.push(S(`T${n} · ${name}: load ${r.machine}`, [['track', t], ['machines'], ['level'], ['back']],
        `[TRACK] + [T${n}], then [MACHINES] and turn LEVEL/DATA to <b>${r.machine}</b>. [BACK] to close.`, { sec, screen: r.machine }));
      out.push(S(`T${n} · ${name}: dial in the sound`, [r.knobs.map(([k]) => k)],
        `<ul class="knobs">${r.knobs.map(([k, v]) => `<li><b>${NAME(k)}</b> ${v}</li>`).join('')}</ul>${r.tips.map(x => `<p>${x}</p>`).join('')}`,
        { sec, values: Object.fromEntries(r.knobs) }));
      const all = p.map((v, s) => v ? s : -1).filter(s => s >= 0);
      let txt = `Tap trig keys <b>${stepWords(all)}</b>.`;
      if (soft.length) txt += `<p>Soft hits on <b>${stepWords(soft)}</b>: hold each one and turn LEVEL/DATA → VEL ≈ 70 (press LEVEL/DATA to get from NOTE to VEL). Holding several trigs at once sets them together.</p>`;
      if (roll.length) txt += `<p>Rolls on <b>${stepWords(roll)}</b>: hold the trig, press [RETRIG], set ON and RTE 1/32 (or 1/24 for a triplet roll).</p>`;
      out.push(S(`T${n} · ${name}: place the trigs`, [all.map(s => 'trig' + (s + 1))], txt, { sec, trigs: p, track: t }));
    });
    if (g.harmony && !pattern.perc.some(v => v)) {
      out.push(S('Optional: chords on T5', [['track', 't5'], ['machines'], ['level']],
        `T5 is free in this groove. Load <b>CHORD</b> there. SHAPE picks unison or a chord type (manual appendix C), COLOR changes the interval mix, CONTOUR is the filter envelope. ${g.harmony}`, { sec: 'Chords', screen: 'CHORD' }));
    }
    out.push(S(swing > 50 ? `Swing: ${swing}% on every track` : 'Swing: leave it at 50%', [['hold:track', 'swing']],
      swing > 50 ? `Hold [TRACK] and turn SWING to <b>${swing}%</b>: CONTROL ALL sets it on every track at once. Swing only moves the even 16ths, the same as in this app.`
        : 'This groove is straight. SWING stays at its default 50%.', { sec: 'Finish', values: { swing: swing + '%' } }));
    out.push(S('Listen', [['record'], ['play']], 'Press [RECORD] to leave grid recording, then [PLAY]. Use [FUNC] + [T1–6] to mute tracks and hear how the layers stack, like the build-up view above.', { sec: 'Finish' }));
    out.push(S('Save it', [['func', 'settings'], ['settings']], '[FUNC] + [SETTINGS] for a quick snapshot. [SETTINGS] → PATTERN → SAVE to keep it in the project.', { sec: 'Finish' }));
    return out;
  }

  return { svg, INFO, NAME, isKnob, BASICS, genreSteps, hlOf, recipe, C };
})();
