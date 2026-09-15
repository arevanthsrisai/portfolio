/**
 * Tiny WebAudio blip engine for the arcade. Lazily creates the AudioContext
 * on first user gesture (browser autoplay policy) and never throws.
 */

let ctx: AudioContext | null = null;
let muted = false;

try {
  muted = window.localStorage.getItem("arcade-muted") === "1";
} catch {
  muted = false;
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function isMuted() {
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  try {
    window.localStorage.setItem("arcade-muted", value ? "1" : "0");
  } catch {
    /* private mode */
  }
}

type BlipOptions = {
  freq: number;
  dur?: number;
  type?: OscillatorType;
  gain?: number;
  slideTo?: number;
};

function blip({ freq, dur = 0.08, type = "square", gain = 0.04, slideTo }: BlipOptions) {
  if (muted) return;
  const ac = audio();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, ac.currentTime + dur);
    }
    g.gain.setValueAtTime(gain, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    osc.connect(g).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + dur + 0.02);
  } catch {
    /* audio unavailable */
  }
}

/** Brick hit — pitch climbs with the combo. */
export function sfxBrick(combo: number) {
  blip({ freq: 320 + combo * 70, dur: 0.07, type: "square", gain: 0.035 });
}

/** Paddle bounce — low thud. */
export function sfxPaddle() {
  blip({ freq: 180, dur: 0.06, type: "triangle", gain: 0.05 });
}

/** Wall bounce — soft tick. */
export function sfxWall() {
  blip({ freq: 240, dur: 0.04, type: "sine", gain: 0.02 });
}

/** Life lost — descending sweep. */
export function sfxLifeLost() {
  blip({ freq: 340, dur: 0.4, type: "sawtooth", gain: 0.05, slideTo: 90 });
}

/** Level clear — quick ascending arpeggio. */
export function sfxLevelClear() {
  [392, 494, 587, 784].forEach((f, i) => {
    window.setTimeout(() => blip({ freq: f, dur: 0.12, type: "square", gain: 0.04 }), i * 90);
  });
}

/** Game over — slow descending notes. */
export function sfxGameOver() {
  [330, 262, 196, 147].forEach((f, i) => {
    window.setTimeout(() => blip({ freq: f, dur: 0.22, type: "triangle", gain: 0.05 }), i * 160);
  });
}

/** Victory — fanfare. */
export function sfxWon() {
  [523, 659, 784, 1047, 784, 1047].forEach((f, i) => {
    window.setTimeout(() => blip({ freq: f, dur: 0.14, type: "square", gain: 0.045 }), i * 110);
  });
}
