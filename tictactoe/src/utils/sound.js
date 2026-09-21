let audioContext = null;
let muted = false;

const MUTE_KEY = 'tictactoe.muted.v1';

/** Call once on app mount to restore the user's mute preference. Returns the initial muted state. */
export function initSoundPreference() {
  try {
    muted = localStorage.getItem(MUTE_KEY) === 'true';
  } catch {
    muted = false;
  }
  return muted;
}

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
  try {
    localStorage.setItem(MUTE_KEY, String(value));
  } catch {
    /* ignore */
  }
}

function getContext() {
  if (muted) return null;
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    audioContext = new AudioCtx();
  }
  // Browsers start contexts "suspended" until a user gesture; every sound
  // call here happens inside a click handler, so this resume is safe.
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function tone({ freq, duration = 0.12, type = 'sine', startGain = 0.16, delay = 0 }) {
  const ctx = getContext();
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(startGain, t0 + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Short chalk-tap tick when a mark is placed. X and O get different pitches. */
export function playMove(symbol) {
  tone({ freq: symbol === 'X' ? 640 : 420, duration: 0.09, type: 'square', startGain: 0.12 });
}

/** Low buzz for clicking a filled square or a finished board. */
export function playInvalid() {
  tone({ freq: 140, duration: 0.12, type: 'sawtooth', startGain: 0.07 });
}

/** Rising four-note arpeggio (C5-E5-G5-C6) for a win. */
export function playWin() {
  const ctx = getContext();
  if (!ctx) return;
  const t0 = ctx.currentTime;

  // Warm sustained bass chord (C major) swelling under the melody
  [130.81, 164.81, 196.0].forEach((freq) => {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(0.05, t0 + 0.3);
    gain.gain.linearRampToValueAtTime(0, t0 + 1.8);
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 1.85);
  });

  // Little victory fanfare motif: C5 - E5 - G5 - C6 (held) - B5 - C6 (held)
  [
    [523.25, 0, 0.16],
    [659.25, 0.16, 0.16],
    [783.99, 0.32, 0.16],
    [1046.5, 0.48, 0.4],
    [987.77, 0.95, 0.14],
    [1046.5, 1.12, 0.55],
  ].forEach(([freq, start, dur]) =>
    tone({ freq, duration: dur, type: 'triangle', startGain: 0.16, delay: start })
  );

  // Shimmer sparkle on top for a bit of sparkle/glaze
  [1568, 1760, 2093].forEach((freq, i) =>
    tone({ freq, duration: 0.12, type: 'sine', startGain: 0.05, delay: 1.05 + i * 0.07 })
  );
}

/** Neutral two-note descent for a draw. */
export function playDraw() {
  [392, 329.63].forEach((freq, i) =>
    tone({ freq, duration: 0.24, type: 'sine', startGain: 0.12, delay: i * 0.1 })
  );
}
