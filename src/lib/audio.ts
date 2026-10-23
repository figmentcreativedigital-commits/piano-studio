"use client";

/**
 * Audio for the studio: a simple synthesized piano-like tone, a click, a
 * metronome with gap and backbeat modes, and an exercise player that schedules
 * notes from abcjs timing data on the Web Audio clock.
 *
 * The tone is synthesized and labeled as such in the interface: it shows pitch
 * and rhythm, not piano sound.
 */

type Listener<T> = (v: T) => void;

class Emitter<T> {
  private ls = new Set<Listener<T>>();
  on(l: Listener<T>) {
    this.ls.add(l);
    return () => this.ls.delete(l);
  }
  emit(v: T) {
    this.ls.forEach((l) => l(v));
  }
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let wakeLock: { release: () => Promise<void> } | null = null;

export function audioAvailable(): boolean {
  return typeof window !== "undefined" && !!(window.AudioContext || (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext);
}

export function ensureAudio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.75;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    master.connect(comp);
    comp.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export async function keepAwake(on: boolean) {
  try {
    const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } };
    if (on && !wakeLock && nav.wakeLock) wakeLock = await nav.wakeLock.request("screen");
    if (!on && wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch {
    /* not available; fine */
  }
}

const PARTIALS: [number, number][] = [
  [1, 1],
  [2, 0.42],
  [3, 0.16],
  [4, 0.07],
];

export function tone(t: number, pitch: number, dur: number, vel: number, bucket: AudioScheduledSourceNode[]) {
  if (!ctx || !master) return;
  const f = 440 * Math.pow(2, (pitch - 69) / 12);
  const g = ctx.createGain();
  const peak = 0.2 * vel;
  const decay = 0.3 + 1.3 * Math.max(0, Math.min(1, (88 - pitch) / 48));
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + 0.006);
  g.gain.setTargetAtTime(0, t + 0.012, decay);
  g.gain.setTargetAtTime(0, t + dur, 0.05);
  g.connect(master);
  for (const [mul, amp] of PARTIALS) {
    if (f * mul > 12000) continue;
    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.frequency.value = f * mul;
    og.gain.value = amp;
    o.connect(og);
    og.connect(g);
    o.start(t);
    o.stop(t + dur + 0.4);
    bucket.push(o);
  }
}

export function click(t: number, accent: boolean, bucket: AudioScheduledSourceNode[], soft = false) {
  if (!ctx || !master) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.value = accent ? 1760 : 1320;
  const p = (accent ? 0.5 : 0.36) * (soft ? 0.6 : 1);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(p, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
  o.connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + 0.05);
  bucket.push(o);
}

/** A soft two-note chime for the end of a timed block. */
export function chime() {
  const c = ensureAudio();
  if (!c) return;
  const b: AudioScheduledSourceNode[] = [];
  tone(c.currentTime + 0.02, 79, 0.6, 0.5, b);
  tone(c.currentTime + 0.22, 84, 0.9, 0.5, b);
}

function stopNodes(list: AudioScheduledSourceNode[]) {
  for (const n of list) {
    try {
      n.stop(0);
    } catch {
      /* already stopped */
    }
    try {
      n.disconnect();
    } catch {
      /* already disconnected */
    }
  }
  list.length = 0;
}

// ───────────────────────── Metronome ─────────────────────────

export type ClickMode = "every" | "twofour" | "gap";

export interface MetroBeat {
  beat: number;
  bar: number;
  audible: boolean;
}

class Metronome {
  on = false;
  tempo = 72;
  mode: ClickMode = "every";
  private next = 0;
  private beat = 0;
  private bar = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private raf = 0;
  private queue: { t: number; b: MetroBeat }[] = [];
  private nodes: AudioScheduledSourceNode[] = [];
  readonly beats = new Emitter<MetroBeat | null>();
  readonly state = new Emitter<{ on: boolean; tempo: number; mode: ClickMode }>();

  private audible(beat: number, bar: number) {
    if (this.mode === "twofour") return beat === 1 || beat === 3;
    if (this.mode === "gap") return bar % 8 < 4;
    return true;
  }
  private schedule = () => {
    if (!ctx) return;
    while (this.next < ctx.currentTime + 0.12) {
      const aud = this.audible(this.beat, this.bar);
      if (aud) click(this.next, this.beat === 0 && this.mode === "every", this.nodes);
      this.queue.push({ t: this.next, b: { beat: this.beat, bar: this.bar, audible: aud } });
      this.next += 60 / this.tempo;
      this.beat = (this.beat + 1) % 4;
      if (this.beat === 0) this.bar++;
    }
    if (this.nodes.length > 200) this.nodes.splice(0, 100);
  };
  private draw = () => {
    if (!ctx || !this.on) return;
    let ev: { t: number; b: MetroBeat } | null = null;
    while (this.queue.length && this.queue[0].t <= ctx.currentTime) ev = this.queue.shift()!;
    if (ev) this.beats.emit(ev.b);
    this.raf = requestAnimationFrame(this.draw);
  };
  private announce() {
    this.state.emit({ on: this.on, tempo: this.tempo, mode: this.mode });
  }
  start() {
    if (!ensureAudio() || !ctx) return;
    player.stop();
    this.on = true;
    this.beat = 0;
    this.bar = 0;
    this.queue = [];
    this.next = ctx.currentTime + 0.1;
    this.timer = setInterval(this.schedule, 25);
    this.schedule();
    this.raf = requestAnimationFrame(this.draw);
    void keepAwake(true);
    this.announce();
  }
  stop() {
    if (!this.on) return;
    this.on = false;
    if (this.timer) clearInterval(this.timer);
    cancelAnimationFrame(this.raf);
    stopNodes(this.nodes);
    this.queue = [];
    this.beats.emit(null);
    this.announce();
  }
  toggle() {
    if (this.on) this.stop();
    else this.start();
  }
  setTempo(t: number) {
    this.tempo = Math.max(30, Math.min(240, Math.round(t)));
    this.announce();
  }
  setMode(m: ClickMode) {
    this.mode = m;
    this.announce();
  }
}

export const metronome = new Metronome();

// ───────────────────────── Exercise player ─────────────────────────

/** Minimal shape of the abcjs objects the player uses. */
export interface AbcVisual {
  setUpAudio: (o: { qpm: number; chordsOff: boolean }) => { totalDuration: number; tracks: { cmd: string; pitch: number; start: number; duration: number; volume?: number }[][] };
  setTiming: (qpm: number, extra: number) => { type: string; milliseconds: number; elements?: (Element | Element[])[] }[];
}

export interface PlayOptions {
  id: string;
  visual: AbcVisual;
  tempo: number;
  hands: "both" | "RH" | "LH";
  twoStaves: boolean;
  loop: boolean;
  click: boolean;
  clickMode?: "every" | "twofour";
  swing?: boolean;
  gain?: number[];
  beatsPerBar?: number;
}

/** Swing: the off-beat eighth lands at 62% of the beat; notation stays straight. */
export function warp(b: number, swing?: boolean): number {
  if (!swing) return b;
  const i = Math.floor(b + 1e-9);
  const f = b - i;
  const r = 0.62;
  return i + (f <= 0.5 ? (f / 0.5) * r : r + ((f - 0.5) / 0.5) * (1 - r));
}

class Player {
  id: string | null = null;
  private run = 0;
  private nodes: AudioScheduledSourceNode[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private raf = 0;
  private queue: { t: number; els: Element[] }[] = [];
  private lit: Element[] = [];
  private end = 0;
  readonly state = new Emitter<string | null>();

  private clearLit() {
    this.lit.forEach((e) => e.classList.remove("is-on"));
    this.lit = [];
  }
  stop() {
    this.run++;
    if (this.timer) clearTimeout(this.timer);
    cancelAnimationFrame(this.raf);
    stopNodes(this.nodes);
    this.queue = [];
    this.clearLit();
    if (this.id) {
      this.id = null;
      this.state.emit(null);
    }
  }
  play(o: PlayOptions) {
    if (!ensureAudio() || !ctx) return;
    metronome.stop();
    this.stop();
    const run = this.run;
    this.id = o.id;
    this.state.emit(o.id);
    void keepAwake(true);
    const au = o.visual.setUpAudio({ qpm: o.tempo, chordsOff: true });
    const timing = o.visual.setTiming(o.tempo, 0).filter((e) => e.type === "event");
    const beat = 60 / o.tempo;
    const total = Math.round(au.totalDuration * 4 * 1000) / 1000;
    const per = o.beatsPerBar ?? 4;
    let t0 = ctx.currentTime + 0.12;
    for (let k = 0; k < per; k++) click(t0 + k * beat, k === 0, this.nodes);
    t0 += per * beat;
    const runOnce = (start: number) => {
      au.tracks.forEach((tr, vi) => {
        if (o.twoStaves && o.hands === "RH" && vi !== 0) return;
        if (o.twoStaves && o.hands === "LH" && vi !== 1) return;
        const g = o.gain?.[vi] ?? 1;
        for (const n of tr) {
          if (n.cmd !== "note") continue;
          const ts = start + warp(n.start * 4, o.swing) * beat;
          const te = start + warp((n.start + n.duration) * 4, o.swing) * beat;
          tone(ts, n.pitch, Math.max(0.06, te - ts - 0.02), Math.min(1, (n.volume ?? 90) / 110) * g, this.nodes);
        }
      });
      if (o.click) {
        for (let b = 0; b < total; b++) {
          if (o.clickMode === "twofour" && b % 4 !== 1 && b % 4 !== 3) continue;
          click(start + b * beat, false, this.nodes, true);
        }
      }
      for (const e of timing) {
        const els: Element[] = [];
        for (const a of e.elements ?? []) (Array.isArray(a) ? a : [a]).forEach((x) => x && els.push(x));
        this.queue.push({ t: start + warp(e.milliseconds / 1000 / beat, o.swing) * beat, els });
      }
      this.end = start + total * beat;
      this.queue.push({ t: this.end, els: [] });
    };
    runOnce(t0);
    const tick = () => {
      if (run !== this.run || !ctx) return;
      const now = ctx.currentTime;
      if (now > this.end - 0.3 && o.loop && this.queue.length <= 1) runOnce(this.end);
      if (now > this.end + 0.5 && !o.loop) {
        this.stop();
        return;
      }
      if (this.nodes.length > 800) this.nodes.splice(0, 400);
      this.timer = setTimeout(tick, 60);
    };
    const draw = () => {
      if (run !== this.run || !ctx) return;
      let ev: { t: number; els: Element[] } | null = null;
      while (this.queue.length && this.queue[0].t <= ctx.currentTime) ev = this.queue.shift()!;
      if (ev) {
        this.clearLit();
        ev.els.forEach((e) => {
          e.classList.add("is-on");
          this.lit.push(e);
        });
      }
      this.raf = requestAnimationFrame(draw);
    };
    tick();
    this.raf = requestAnimationFrame(draw);
  }
}

export const player = new Player();

/** Play a single chord now (ear training). */
export function playChord(pitches: number[], dur = 1.4) {
  const c = ensureAudio();
  if (!c) return;
  const b: AudioScheduledSourceNode[] = [];
  pitches.forEach((p) => tone(c.currentTime + 0.05, p, dur, 0.8, b));
}
