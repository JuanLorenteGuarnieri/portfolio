// -----------------------------------------------------------------------------------------
// Sintetizador de piano con la Web Audio API (sin archivos de audio).
//
// Cada nota es una suma de armónicos (osciladores senoidales) que decaen por separado: los
// agudos se apagan antes que el fundamental, y las notas graves suenan más tiempo que las agudas.
// Los tres primeros armónicos llevan dos "cuerdas" levemente desafinadas (el batido típico del
// piano), hay un golpe de martillo (ruido corto filtrado), un filtro paso-bajo que se cierra
// mientras suena la nota, un compresor para los acordes y un poco de reverb.
//
//   pianoSynth.unlock()           -> crear/reanudar el AudioContext (llamar desde un gesto del usuario)
//   pianoSynth.noteOn(midi, vel)  -> vel entre 0 y 1
//   pianoSynth.noteOff(midi)      -> el apagador cae sobre las cuerdas
// -----------------------------------------------------------------------------------------

const MAX_VOICES = 28;
const MIN_HOLD = 0.15; // s: aunque se suelte antes, la nota suena un instante (un clic rápido no queda "seco")
const RELEASE_TAU = 0.16; // s: constante de caída al soltar la tecla
const FAST_TAU = 0.04; // s: caída rápida (robo de voz / misma tecla pulsada otra vez)

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

export class PianoSynth {
  constructor() {
    this.ctx = null;
    this.input = null;
    this.noise = null;
    this.voices = new Map(); // midi -> voz activa
  }

  /** Crea (o reanuda) el AudioContext. Hay que llamarlo desde un gesto del usuario (clic, toque, tecla). */
  unlock() {
    if (!this.ctx) {
      const AC = typeof window !== 'undefined' ? window.AudioContext || window.webkitAudioContext : null;
      if (!AC) return false;
      this.attach(new AC());
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    return true;
  }

  /** Usa un contexto existente (también sirve para renderizar offline en pruebas). */
  attach(ctx) {
    this.ctx = ctx;

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 30;
    compressor.ratio.value = 2.5;
    compressor.attack.value = 0.012;
    compressor.release.value = 0.30;
    compressor.connect(ctx.destination);

    const master = ctx.createGain();
    master.gain.value = 0.85;
    master.connect(compressor);

    // Reverb de sala pequeña: ruido con caída exponencial
    const reverb = ctx.createConvolver();
    reverb.buffer = this._impulse(2.2, 2.8);
    const wet = ctx.createGain();
    wet.gain.value = 0.12;
    master.connect(reverb);
    reverb.connect(wet);
    wet.connect(compressor);

    this.input = master;

    // Ruido blanco compartido para el golpe del martillo
    const n = Math.floor(ctx.sampleRate * 0.08);
    this.noise = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  }

  _impulse(seconds, decay) {
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buf.getChannelData(c);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  /**
   * @param {number} midi      nota MIDI (60 = Do central)
   * @param {number} velocity  0..1
   * @param {number} [when]    instante (s) en el reloj del contexto; por defecto, ahora
   */
  noteOn(midi, velocity = 0.8, when) {
    const ctx = this.ctx;
    if (!ctx || !this.input) return;
    const now = when ?? ctx.currentTime;
    const vel = clamp(velocity, 0.05, 1);

    // La misma tecla otra vez: la nota anterior se apaga rápido; demasiadas voces: se roba la más antigua
    const prev = this.voices.get(midi);
    if (prev) this._release(prev, now, FAST_TAU);
    if (this.voices.size >= MAX_VOICES) {
      const oldest = this.voices.values().next().value;
      if (oldest) this._release(oldest, now, FAST_TAU);
    }

    const f0 = midiToHz(midi);
    const out = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.Q.value = 0.25;
    // Brillo: más abierto con más velocidad y se va cerrando mientras suena
    lp.frequency.setValueAtTime(18000, now);
    lp.connect(out);
    out.connect(this.input);

    // Envolvente global: ataque casi instantáneo; el nivel baja un poco en los agudos
    const peak = 0.55 * Math.pow(vel, 1.2) * (1.12 - clamp((midi - 24) / 190, 0, 0.5));
    out.gain.setValueAtTime(0, now);
    out.gain.linearRampToValueAtTime(peak, now + 0.008);

    // Cuanto más grave, más tiempo suena
    const tau0 = Math.max(1.0, 10.0 * Math.pow(2, -(midi - 36) / 26));
    const inharm = 0.00015 * Math.pow(2, (midi - 60) / 18); // las cuerdas reales no son perfectamente armónicas
    const maxPartials = clamp(Math.floor(11000  / f0), 1, 12);
    const lowBoost = 1 + clamp((60 - midi) / 24, 0, 1) * 0.45; // graves: más peso en los armónicos para que se oigan
    const rolloff = 1.1 + (1 - vel) * 0.5;

    const partials = [];
    let sum = 0;
    for (let n = 1; n <= maxPartials; n++) {
      const a = Math.pow(n, -rolloff) * (n > 1 ? lowBoost : 1);
      partials.push(a);
      sum += a;
    }

    const oscs = [];
    const life = tau0 * 5 + 0.5;
    partials.forEach((a, i) => {
      const n = i + 1;
      const freq = n * f0 * Math.sqrt(1 + inharm * n * n);
      if (freq > 18000) return;
      const amp = a / sum;
      const tau = tau0 / (1 + 0.45 * (n - 1));
      const stringDetunes =
        midi < 36 ? [0] :
        midi < 48 ? [-1.0, 1.0] :
        [-1.3, -0.1, 1.1];

      // Solamente duplicamos las tres primeras componentes armónicas.
      // El resto utiliza un único oscilador para reducir la carga de CPU.
      const strings = n <= 3 ? stringDetunes : [0];
      for (const cents of strings) {
        const g = ctx.createGain();
        g.gain.setValueAtTime(amp / strings.length, now);
        g.gain.setTargetAtTime(0, now + 0.002, tau);
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.detune.value = cents;
        osc.connect(g);
        g.connect(lp);
        osc.start(now);
        osc.stop(now + life);
        oscs.push(osc);
      }
    });

    // Golpe del martillo
    if (this.noise) {
      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = clamp(f0 * 4, 600, 5000);
      bp.Q.value = 0.8;
      const hg = ctx.createGain();
      hg.gain.setValueAtTime(0.14 * Math.pow(vel, 1.5), now);
      hg.gain.setTargetAtTime(0, now, 0.008);
      src.connect(bp);
      bp.connect(hg);
      hg.connect(out);
      src.start(now);
      src.stop(now + 0.08);
    }

    const voice = { midi, out, oscs, start: now, released: false };
    this.voices.set(midi, voice);
    const last = oscs[oscs.length - 1] || oscs[0];
    if (last) {
      last.onended = () => {
        try { out.disconnect(); lp.disconnect(); } catch { /* ya desconectado */ }
        if (this.voices.get(midi) === voice) this.voices.delete(midi);
      };
    }
    return voice;
  }

  /** Suelta la tecla: el apagador cae (con un mínimo de duración para que un clic rápido suene). */
  noteOff(midi, when) {
    const ctx = this.ctx;
    const voice = this.voices.get(midi);
    if (!ctx || !voice) return;
    const now = when ?? ctx.currentTime;
    this._release(voice, Math.max(now, voice.start + MIN_HOLD), RELEASE_TAU);
  }

  releaseAll() {
    this.voices.forEach((v) => this.noteOff(v.midi));
  }

  _release(voice, at, tau) {
    if (voice.released && tau >= RELEASE_TAU) return;
    voice.released = true;
    const g = voice.out.gain;
    try {
      g.cancelScheduledValues(at);
      g.setTargetAtTime(0, at, tau);
    } catch { /* contexto cerrado */ }
    const stopAt = at + tau * 9 + 0.1;
    voice.oscs.forEach((o) => { try { o.stop(stopAt); } catch { /* ya parado */ } });
    if (this.voices.get(voice.midi) === voice && tau <= FAST_TAU) this.voices.delete(voice.midi);
  }
}

export const pianoSynth = new PianoSynth();
