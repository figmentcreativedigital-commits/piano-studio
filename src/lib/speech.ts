"use client";

/**
 * Read-aloud. The studio narrator (Google Chirp 3 HD, voiced on the server and
 * cached) reads when it's on; otherwise, and for anything it doesn't know,
 * the browser's own speech synthesis reads. Text is normalized first so
 * musical shorthand is spoken the way a teacher would say it.
 *
 * What gets read is marked in the markup: elements with `data-read`, in
 * document order, inside the nearest `[data-read-region]` (or the whole page).
 * The element being read gets `.is-reading`, so sighted listeners can follow.
 */

import { speechKey, toSpeech } from "./speech-text";

export { toSpeech, speechKey };

// ───────────────────────── Engine ─────────────────────────

export interface ReadItem {
  text: string;
  el?: HTMLElement | null;
}

export type ReaderState = { status: "idle" | "speaking" | "paused"; index: number; total: number; label?: string };

type Listener = (s: ReaderState) => void;

const PREFS = "woodshed.speech.v1";

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
}

function loadPrefs(): { rate: number; voice?: string; autoRead: boolean } {
  try {
    const raw = localStorage.getItem(PREFS);
    if (raw) return { rate: 1, autoRead: false, ...JSON.parse(raw) };
  } catch {
    /* storage blocked: defaults */
  }
  return { rate: 1, autoRead: false };
}

/**
 * English voices, best first. Edge's "Online (Natural)" voices and macOS
 * Premium or Enhanced voices are neural and far more natural than the
 * defaults, so they rank first when the device has them.
 */
export function voiceRank(v: { name: string; lang: string; localService: boolean }): number {
  return (
    (/natural|neural|premium|enhanced/i.test(v.name) ? 0 : 6) +
    (/en-US/i.test(v.lang) ? 0 : 1) +
    (/google us english|samantha|ava|zoe|aria|jenny|guy|andrew|emma|brian/i.test(v.name) ? -2 : 0) +
    (/compact|eloquence|novelty|bells|bad news|whisper|zarvox|trinoids|albert|bubbles|cellos|organ|jester|superstar|wobble/i.test(v.name) ? 20 : 0)
  );
}

export function englishVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return [];
  return window.speechSynthesis
    .getVoices()
    .filter((v) => /^en(-|_|$)/i.test(v.lang))
    .sort((a, b) => voiceRank(a) - voiceRank(b));
}

/** Calls back when the device's voice list arrives or changes (Chrome loads it late). */
export function onVoices(cb: () => void): () => void {
  if (!speechSupported()) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", cb);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", cb);
}

function pickVoice(want?: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  if (want) {
    const v = voices.find((x) => x.voiceURI === want);
    if (v) return v;
  }
  return englishVoices()[0] ?? voices[0];
}

// ───────────────────────── Studio narrator ─────────────────────────

export interface NarratorInfo {
  enabled: boolean;
  voices: { name: string; trait: string }[];
  default: string;
}

let narrator: NarratorInfo = { enabled: false, voices: [], default: "" };
let narratorLoad: Promise<NarratorInfo> | null = null;
const narratorListeners = new Set<(n: NarratorInfo) => void>();

/** Asks the server once whether the studio narrator is on. */
export function loadNarrator(): Promise<NarratorInfo> {
  if (typeof window === "undefined") return Promise.resolve(narrator);
  if (!narratorLoad) {
    narratorLoad = fetch("/api/voice/status")
      .then((r) => (r.ok ? r.json() : narrator))
      .catch(() => narrator)
      .then((n: NarratorInfo) => {
        narrator = n;
        narratorListeners.forEach((l) => l(n));
        return n;
      });
  }
  return narratorLoad;
}

export function onNarrator(l: (n: NarratorInfo) => void): () => void {
  narratorListeners.add(l);
  l(narrator);
  void loadNarrator();
  return () => {
    narratorListeners.delete(l);
  };
}

export function narratorUrl(text: string, voice: string): string {
  return `/api/voice/${speechKey(text)}?v=${encodeURIComponent(voice)}`;
}

class Reader {
  private items: ReadItem[] = [];
  private i = 0;
  private lit: HTMLElement | null = null;
  private run = 0;
  private audio: HTMLAudioElement | null = null;
  private warm: HTMLAudioElement | null = null;
  private override: string | null = null;
  private listeners = new Set<Listener>();
  state: ReaderState = { status: "idle", index: 0, total: 0 };
  prefs = { rate: 1, voice: undefined as string | undefined, autoRead: false };
  private loaded = false;

  private ensurePrefs() {
    if (this.loaded || typeof window === "undefined") return;
    this.prefs = { ...this.prefs, ...loadPrefs() };
    this.loaded = true;
    void loadNarrator();
  }

  getPrefs() {
    this.ensurePrefs();
    return this.prefs;
  }

  setPrefs(p: Partial<{ rate: number; voice?: string; autoRead: boolean }>) {
    this.ensurePrefs();
    this.prefs = { ...this.prefs, ...p };
    try {
      localStorage.setItem(PREFS, JSON.stringify(this.prefs));
    } catch {
      /* ignore */
    }
    if (this.audio && p.rate) this.audio.playbackRate = p.rate;
    this.emit(this.state);
  }

  on(l: Listener) {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  }

  private emit(s: ReaderState) {
    this.state = s;
    this.listeners.forEach((l) => l(s));
  }

  private light(el?: HTMLElement | null) {
    this.lit?.classList.remove("is-reading");
    this.lit = el ?? null;
    if (!el) return;
    el.classList.add("is-reading");
    const r = el.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight - 90) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }
  }

  /** The narrator voice to use, or null for the device's own voice. */
  private narratorVoice(): string | null {
    if (this.override) return this.override;
    if (!narrator.enabled) return null;
    const v = this.prefs.voice;
    if (!v) return narrator.default;
    if (v.startsWith("narrator:")) {
      const name = v.slice(9);
      return narrator.voices.some((x) => x.name === name) ? name : narrator.default;
    }
    return null;
  }

  speak(items: ReadItem[], label?: string, voiceOverride?: string) {
    this.ensurePrefs();
    if (!speechSupported() && !narrator.enabled && !voiceOverride) return;
    this.stop(false);
    this.override = voiceOverride ?? null;
    this.items = items.filter((x) => x.text.trim());
    if (!this.items.length) return;
    this.i = 0;
    this.emit({ status: "speaking", index: 0, total: this.items.length, label });
    this.say();
  }

  private next(run: number) {
    if (run !== this.run || this.state.status === "idle") return;
    this.i++;
    if (this.i >= this.items.length) return this.stop();
    this.emit({ ...this.state, status: "speaking", index: this.i });
    this.say();
  }

  private say() {
    const run = ++this.run;
    const item = this.items[this.i];
    if (!item) return this.stop();
    this.light(item.el);
    const voice = this.narratorVoice();
    if (voice) {
      if (speechSupported()) window.speechSynthesis.cancel();
      const a = new Audio(narratorUrl(item.text, voice));
      a.playbackRate = this.prefs.rate;
      this.audio = a;
      let fellBack = false;
      const fallback = () => {
        if (fellBack || run !== this.run) return;
        fellBack = true;
        this.audio = null;
        this.sayOnDevice(run, item);
      };
      a.onended = () => this.next(run);
      a.onerror = fallback;
      a.play().catch(fallback);
      const upcoming = this.items[this.i + 1];
      if (upcoming) {
        const w = new Audio();
        w.preload = "auto";
        w.src = narratorUrl(upcoming.text, voice);
        this.warm = w;
      }
      return;
    }
    this.sayOnDevice(run, item);
  }

  private sayOnDevice(run: number, item: ReadItem) {
    if (!speechSupported()) return this.next(run);
    const u = new SpeechSynthesisUtterance(toSpeech(item.text));
    u.rate = this.prefs.rate;
    u.lang = "en-US";
    const v = pickVoice(this.prefs.voice?.startsWith("narrator:") ? undefined : this.prefs.voice);
    if (v) u.voice = v;
    u.onend = () => this.next(run);
    u.onerror = () => {
      if (run === this.run) this.stop();
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  pause() {
    if (this.state.status !== "speaking") return;
    if (this.audio) this.audio.pause();
    else if (speechSupported()) window.speechSynthesis.pause();
    this.emit({ ...this.state, status: "paused" });
  }

  resume() {
    if (this.state.status !== "paused") return;
    if (this.audio) void this.audio.play();
    else if (speechSupported()) window.speechSynthesis.resume();
    this.emit({ ...this.state, status: "speaking" });
  }

  jump(delta: number) {
    if (this.state.status === "idle") return;
    this.i = Math.max(0, Math.min(this.items.length - 1, this.i + delta));
    this.halt();
    this.emit({ ...this.state, status: "speaking", index: this.i });
    this.say();
  }

  private halt() {
    if (this.audio) {
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio.pause();
      this.audio = null;
    }
    this.warm = null;
    if (speechSupported()) window.speechSynthesis.cancel();
  }

  stop(announce = true) {
    this.run++;
    this.halt();
    this.override = null;
    this.light(null);
    this.items = [];
    if (announce || this.state.status !== "idle") this.emit({ status: "idle", index: 0, total: 0 });
  }
}

export const reader = new Reader();

/** The readable elements inside a region, in order, skipping anything hidden. */
export function collectReadable(root: ParentNode = document): ReadItem[] {
  const els = Array.from(root.querySelectorAll<HTMLElement>("[data-read]"));
  const out: ReadItem[] = [];
  for (const el of els) {
    if (!el.getClientRects().length) continue;
    if (el.closest("[aria-hidden='true']")) continue;
    const text = el.getAttribute("data-read-text") || el.innerText;
    if (text && text.trim()) out.push({ text: text.trim(), el });
  }
  return out;
}
