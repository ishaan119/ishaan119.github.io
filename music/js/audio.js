/* ------------------------------------------------------------------
   Web Audio engine: a soft flute-ish tone for swaras, a tanpura-style
   drone, tabla-ish clicks for the tala player, and the six ornaments
   from Chapter 6. Everything is synthesised locally, so the app works
   with no network and no audio files.
   ------------------------------------------------------------------ */
window.VF = window.VF || {};

VF.Audio = (function () {
  var ctx = null;
  var master = null;
  var droneNodes = null;
  var saSemitone = 0;          // offset from C4
  var SA_KEY = 'vf.saPitch';

  var PITCH_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  function ensure() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.9;
        master.connect(ctx.destination);
      } catch (e) {
        ctx = null;                 // no audio device, or blocked: stay silent
        return null;
      }
    }
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    return ctx;
  }

  function loadSa() {
    var v = parseInt(localStorage.getItem(SA_KEY), 10);
    saSemitone = isNaN(v) ? 0 : v;
  }
  loadSa();

  function saFreq() {
    return 261.625565 * Math.pow(2, saSemitone / 12);   // C4 as the zero point
  }

  function setSa(semi) {
    saSemitone = semi;
    localStorage.setItem(SA_KEY, String(semi));
    if (droneNodes) { stopDrone(); startDrone(); }
  }

  function getSa() { return saSemitone; }

  function saName() {
    var n = ((saSemitone % 12) + 12) % 12;
    return PITCH_NAMES[n] + (saSemitone < 0 ? '3' : '4');
  }

  function freq(semitonesFromSa) {
    return saFreq() * Math.pow(2, semitonesFromSa / 12);
  }

  /* ---------------- a single swara, flute-ish ---------------- */
  function voice(f, start, dur, gain) {
    var c = ensure(); if (!c) return;
    gain = gain === undefined ? 0.28 : gain;

    var osc = c.createOscillator();
    osc.type = 'sine';
    var harm = c.createOscillator();
    harm.type = 'triangle';
    var harmGain = c.createGain();
    harmGain.gain.value = 0.11;

    var env = c.createGain();
    env.gain.value = 0;

    // gentle breathy filter
    var lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = Math.max(1200, f * 4);

    // vibrato, kept slight
    var lfo = c.createOscillator();
    lfo.frequency.value = 5.2;
    var lfoGain = c.createGain();
    lfoGain.gain.value = Math.min(3.2, f * 0.006);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfoGain.connect(harm.frequency);

    osc.frequency.setValueAtTime(f, start);
    harm.frequency.setValueAtTime(f * 2, start);

    osc.connect(env);
    harm.connect(harmGain);
    harmGain.connect(env);
    env.connect(lp);
    lp.connect(master);

    var atk = Math.min(0.06, dur * 0.25);
    var rel = Math.min(0.28, dur * 0.6);
    env.gain.setValueAtTime(0, start);
    env.gain.linearRampToValueAtTime(gain, start + atk);
    env.gain.setValueAtTime(gain, start + Math.max(atk, dur - rel));
    env.gain.exponentialRampToValueAtTime(0.0008, start + dur);

    osc.start(start); harm.start(start); lfo.start(start);
    var end = start + dur + 0.05;
    osc.stop(end); harm.stop(end); lfo.stop(end);

    return { osc: osc, harm: harm, env: env, start: start, end: end };
  }

  /* one note, by semitone offset from Sa */
  function note(semi, dur, delay, gain) {
    var c = ensure(); if (!c) return 0;
    dur = dur || 0.5;
    var start = c.currentTime + (delay || 0);
    voice(freq(semi), start, dur, gain);
    return dur;
  }

  /* a glide between two semitone offsets (meend) */
  function glide(fromSemi, toSemi, dur, delay, gain) {
    var c = ensure(); if (!c) return 0;
    var start = c.currentTime + (delay || 0);
    var v = voice(freq(fromSemi), start, dur, gain);
    if (!v) return 0;
    v.osc.frequency.setValueAtTime(freq(fromSemi), start + dur * 0.12);
    v.osc.frequency.exponentialRampToValueAtTime(freq(toSemi), start + dur * 0.88);
    v.harm.frequency.setValueAtTime(freq(fromSemi) * 2, start + dur * 0.12);
    v.harm.frequency.exponentialRampToValueAtTime(freq(toSemi) * 2, start + dur * 0.88);
    return dur;
  }

  /* an oscillating shake between two notes (gamak) */
  function shake(baseSemi, toSemi, dur, cycles, delay) {
    var c = ensure(); if (!c) return 0;
    var start = c.currentTime + (delay || 0);
    var v = voice(freq(baseSemi), start, dur, 0.3);
    if (!v) return 0;
    cycles = cycles || 6;
    var step = dur / (cycles * 2);
    for (var i = 0; i < cycles * 2; i++) {
      var target = (i % 2 === 0) ? toSemi : baseSemi;
      var t = start + step * (i + 1);
      v.osc.frequency.exponentialRampToValueAtTime(freq(target), t);
      v.harm.frequency.exponentialRampToValueAtTime(freq(target) * 2, t);
    }
    return dur;
  }

  /* a run of notes; notes = array of semitone offsets */
  function sequence(notes, noteDur, gap, delay, onStep) {
    var c = ensure(); if (!c) return 0;
    noteDur = noteDur || 0.34;
    gap = gap === undefined ? 0.02 : gap;
    var d = delay || 0;
    notes.forEach(function (n, i) {
      var at = d + i * (noteDur + gap);
      note(n, noteDur, at);
      if (onStep) setTimeout(function () { onStep(i); }, at * 1000);
    });
    var total = notes.length * (noteDur + gap);
    if (onStep) setTimeout(function () { onStep(-1); }, (d + total) * 1000);
    return total;
  }

  /* ---------------- the six ornaments of Chapter 6 ---------------- */
  var ORNAMENTS = {
    plain:  function (s) { note(s, 1.1); return 1.2; },
    gamak:  function (s) { return shake(s, s + 2, 1.6, 7) + 0.2; },
    tan:    function (s) { return sequence([s, s + 2, s + 4, s + 5, s + 7, s + 9, s + 11, s + 12, s + 11, s + 9, s + 7, s + 5, s + 4, s + 2, s], 0.11, 0.0) + 0.2; },
    kana:   function (s) { note(s + 2, 0.09, 0); note(s, 1.0, 0.09); return 1.2; },
    meend:  function (s) { return glide(s, s + 7, 1.5) + 0.2; },
    murki:  function (s) { sequence([s + 2, s + 1, s], 0.075, 0.0, 0); note(s, 0.9, 0.24); return 1.2; },
    khatka: function (s) { sequence([s + 2, s, s - 1], 0.06, 0.0, 0); note(s, 0.75, 0.2); return 1.0; }
  };

  function ornament(kind, semi) {
    ensure();
    var fn = ORNAMENTS[kind] || ORNAMENTS.plain;
    return fn(semi === undefined ? 0 : semi);
  }

  /* ---------------- tanpura-ish drone ---------------- */
  function startDrone(lowerFifth) {
    var c = ensure(); if (!c) return;
    stopDrone();
    var g = c.createGain();
    g.gain.value = 0;
    g.connect(master);
    g.gain.linearRampToValueAtTime(0.16, c.currentTime + 1.2);

    var partials = [
      { semi: -12, gain: 0.5, type: 'sine' },
      { semi: 0,   gain: 0.42, type: 'sine' },
      { semi: 0,   gain: 0.12, type: 'triangle' },
      { semi: lowerFifth === false ? 12 : 7, gain: 0.26, type: 'sine' }
    ];
    var oscs = partials.map(function (p) {
      var o = c.createOscillator();
      o.type = p.type;
      o.frequency.value = freq(p.semi);
      var pg = c.createGain();
      pg.gain.value = p.gain;
      // slow swell, like a plucked tanpura settling
      var lfo = c.createOscillator();
      lfo.frequency.value = 0.18 + Math.random() * 0.1;
      var lg = c.createGain();
      lg.gain.value = p.gain * 0.35;
      lfo.connect(lg); lg.connect(pg.gain);
      o.connect(pg); pg.connect(g);
      o.start(); lfo.start();
      return [o, lfo];
    });
    droneNodes = { gain: g, oscs: oscs };
  }

  function stopDrone() {
    if (!droneNodes || !ctx) return;
    var g = droneNodes.gain, oscs = droneNodes.oscs;
    var t = ctx.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value, t);
    g.gain.linearRampToValueAtTime(0, t + 0.35);
    oscs.forEach(function (pair) {
      pair.forEach(function (o) { try { o.stop(t + 0.4); } catch (e) {} });
    });
    droneNodes = null;
  }

  function droneOn() { return !!droneNodes; }

  /* ---------------- tala clicks ---------------- */
  function click(kind, when) {
    var c = ensure(); if (!c) return;
    var t = when === undefined ? c.currentTime : when;

    if (kind === 'sam' || kind === 'taali') {
      // resonant low stroke, like a dha
      var o = c.createOscillator();
      o.type = 'sine';
      var g = c.createGain();
      var f0 = kind === 'sam' ? 150 : 210;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(f0 * 0.55, t + 0.18);
      var peak = kind === 'sam' ? 0.5 : 0.3;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(peak, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.001, t + (kind === 'sam' ? 0.34 : 0.24));
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + 0.4);
    }
    if (kind === 'khaali' || kind === 'taali' || kind === 'sam') {
      // dry rim tick on top
      var n = noiseBurst(t, kind === 'khaali' ? 0.06 : 0.035, kind === 'khaali' ? 2400 : 3200, kind === 'khaali' ? 0.22 : 0.16);
    }
    if (kind === 'tick') {
      noiseBurst(t, 0.03, 4200, 0.07);
    }
  }

  function noiseBurst(t, dur, cutoff, gain) {
    var c = ensure(); if (!c) return;
    var len = Math.max(1, Math.floor(c.sampleRate * dur));
    var buf = c.createBuffer(1, len, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = c.createBufferSource();
    src.buffer = buf;
    var bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = cutoff;
    bp.Q.value = 0.9;
    var g = c.createGain();
    g.gain.value = gain;
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(t);
  }

  /* ---------------- a small look-ahead scheduler ---------------- */
  function Metronome(opts) {
    this.bpm = opts.bpm || 110;
    this.beats = opts.beats || 16;
    this.kindFor = opts.kindFor || function () { return 'tick'; };
    this.onBeat = opts.onBeat || function () {};
    this.subdiv = opts.subdiv || 1;
    this._timer = null;
    this._next = 0;
    this._beat = 0;
    this.running = false;
  }

  Metronome.prototype.start = function () {
    var c = ensure(); if (!c) return;
    if (this.running) return;
    this.running = true;
    this._beat = 0;
    this._next = c.currentTime + 0.12;
    var self = this;
    this._timer = setInterval(function () { self._tick(); }, 25);
  };

  Metronome.prototype._tick = function () {
    var c = ctx;
    var spb = 60 / this.bpm / this.subdiv;
    while (this._next < c.currentTime + 0.18) {
      var b = this._beat % this.beats;
      click(this.kindFor(b), this._next);
      var uiAt = (this._next - c.currentTime) * 1000;
      var self = this;
      (function (beat) {
        setTimeout(function () { if (self.running) self.onBeat(beat); }, Math.max(0, uiAt));
      })(b);
      this._next += spb;
      this._beat++;
    }
  };

  Metronome.prototype.stop = function () {
    this.running = false;
    if (this._timer) clearInterval(this._timer);
    this._timer = null;
    this.onBeat(-1);
  };

  Metronome.prototype.setBpm = function (v) { this.bpm = v; };

  return {
    ensure: ensure,
    note: note,
    glide: glide,
    shake: shake,
    sequence: sequence,
    ornament: ornament,
    ornaments: Object.keys(ORNAMENTS),
    startDrone: startDrone,
    stopDrone: stopDrone,
    droneOn: droneOn,
    click: click,
    Metronome: Metronome,
    setSa: setSa,
    getSa: getSa,
    saName: saName,
    pitchNames: PITCH_NAMES,
    freq: freq
  };
})();
