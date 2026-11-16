/**
 * Interface sounds, synthesised with the Web Audio API so there are no files to load.
 * Off until the visitor turns it on; the choice is remembered.
 */

const STORAGE_KEY = 'sound';

let context: AudioContext | null = null;
let enabled = false;
let lastTick = 0;

try {
  enabled = localStorage.getItem(STORAGE_KEY) === 'on';
} catch {
  enabled = false;
}

export const isSoundOn = () => enabled;

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // storage unavailable: the choice just won't persist
  }
  if (on) playTone('select');
}

function getContext() {
  if (!context) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

type Tone = 'tick' | 'select' | 'page';

export function playTone(tone: Tone) {
  if (!enabled) return;
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  if (tone === 'page') {
    // a soft sweep of filtered noise, like a page being turned
    const length = Math.floor(ctx.sampleRate * 0.45);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / length);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 0.8;
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.4);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(now);
    return;
  }

  if (tone === 'tick') {
    // hovers arrive in bursts; let at most one through every 60ms
    if (now - lastTick < 0.06) return;
    lastTick = now;
  }

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const duration = tone === 'tick' ? 0.05 : 0.12;
  oscillator.type = tone === 'tick' ? 'sine' : 'triangle';
  oscillator.frequency.setValueAtTime(tone === 'tick' ? 1650 : 520, now);
  oscillator.frequency.exponentialRampToValueAtTime(tone === 'tick' ? 1200 : 260, now + duration);
  gain.gain.setValueAtTime(tone === 'tick' ? 0.018 : 0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

/** Wires hover ticks and click tones to every link and button. Returns a cleanup function. */
export function attachSounds() {
  const INTERACTIVE = 'a, button, [role="button"]';
  let lastHovered: Element | null = null;

  const onOver = (e: MouseEvent) => {
    const hit = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
    if (hit && hit !== lastHovered) playTone('tick');
    lastHovered = hit;
  };

  const onClick = (e: MouseEvent) => {
    if ((e.target as Element | null)?.closest?.(INTERACTIVE)) playTone('select');
  };

  document.addEventListener('mouseover', onOver);
  document.addEventListener('click', onClick);
  return () => {
    document.removeEventListener('mouseover', onOver);
    document.removeEventListener('click', onClick);
  };
}
