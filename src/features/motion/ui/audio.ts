/** Tiny WebAudio synth. Nothing is downloaded: chime and music are generated. */
type Ctx = AudioContext;

let ctx: Ctx | null = null;
let musicTimer: ReturnType<typeof setInterval> | null = null;

function getCtx(): Ctx | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(c: Ctx, freq: number, start: number, dur: number, gain: number, type: OscillatorType = "sine") {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(c.destination);
  o.start(start);
  o.stop(start + dur + 0.02);
}

/** The single "first gesture" sound: a soft two-note chime. */
export function playChime() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  tone(c, 523.25, t, 0.12, 0.04);
  tone(c, 783.99, t + 0.1, 0.22, 0.04);
}

const SCALE = [261.63, 311.13, 349.23, 392.0, 466.16, 523.25];

export function startMusic() {
  if (musicTimer) return;
  const c = getCtx();
  if (!c) return;
  let i = 0;
  musicTimer = setInterval(() => {
    const cc = getCtx();
    if (!cc) return;
    const n = SCALE[(i * 3 + (i >> 2)) % SCALE.length] ?? 261.63;
    tone(cc, n / 2, cc.currentTime, 0.25, 0.012, "triangle");
    i += 1;
  }, 360);
}

export function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
}
