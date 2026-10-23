"use client";

/**
 * Read-aloud. Uses the browser's own speech synthesis (Web Speech API), so
 * nothing leaves the device and nothing needs an account. Text is normalized
 * first so musical shorthand is spoken the way a teacher would say it.
 *
 * What gets read is marked in the markup: elements with `data-read`, in
 * document order, inside the nearest `[data-read-region]` (or the whole page).
 * The element being read gets `.is-reading`, so sighted listeners can follow.
 */

// ───────────────────────── Text ─────────────────────────

const ROOT = "([A-G])(♭|♯|b|#)?";
const ACC: Record<string, string> = { "♭": " flat", b: " flat", "♯": " sharp", "#": " sharp" };

/** Musical shorthand → words for a speech engine. Pure, so it's tested. */
export function toSpeech(input: string): string {
  let s = ` ${input} `;
  s = s.replace(/\bW0?(\d+)\s*D0?(\d+)\b/g, "Week $1, Day $2");
  s = s.replace(/♩\s*=\s*/g, "quarter note equals ");
  s = s.replace(/♩/g, "quarter note");
  s = s.replace(/\bmm\.\s*(\d+)\s*[–-]\s*(\d+)/g, "measures $1 to $2");
  s = s.replace(/\bmm\.\s*/g, "measures ");
  s = s.replace(/\bm\.\s*(\d+)/g, "measure $1");
  s = s.replace(/\bpp\.\s*(\d+)\s*[–-]\s*(\d+)/g, "pages $1 to $2");
  s = s.replace(/\bp\.\s*(\d+)/g, "page $1");
  s = s.replace(/\bBWV\b/g, "B W V");
  s = s.replace(/\bRH\b/g, "right hand");
  s = s.replace(/\bLH\b/g, "left hand");
  s = s.replace(/\bii[–-]V[–-]I\b/g, "two five one");
  s = s.replace(/\bii[–-]V\b/g, "two five");
  s = s.replace(/\bii7\b/g, "two seven");
  // Chord qualities, before plain accidentals.
  s = s.replace(new RegExp(`\\b${ROOT}m7(♭|b)5`, "g"), (_, l, a) => `${l}${a ? ACC[a] : ""} minor seven flat five`);
  s = s.replace(new RegExp(`\\b${ROOT}maj7`, "g"), (_, l, a) => `${l}${a ? ACC[a] : ""} major seven`);
  s = s.replace(new RegExp(`\\b${ROOT}m(\\d)`, "g"), (_, l, a, n) => `${l}${a ? ACC[a] : ""} minor ${n}`);
  s = s.replace(new RegExp(`\\b${ROOT}°7?`, "g"), (_, l, a) => `${l}${a ? ACC[a] : ""} diminished`);
  s = s.replace(new RegExp(`\\b${ROOT}ø7?`, "g"), (_, l, a) => `${l}${a ? ACC[a] : ""} half-diminished`);
  s = s.replace(/°/g, " diminished");
  // Pitches and chords: a letter, an accidental, a number ("A♭4", "B♭7", "C6").
  s = s.replace(new RegExp(`\\b${ROOT}(\\d)\\b`, "g"), (_, l, a, n) => `${l}${a ? ACC[a] : ""} ${n}`);
  s = s.replace(/([A-G])𝄫/g, "$1 double flat");
  s = s.replace(/([A-G])♭/g, "$1 flat");
  s = s.replace(/([A-G])♯/g, "$1 sharp");
  s = s.replace(/♭(\d)/g, "flat $1");
  s = s.replace(/♯(\d)/g, "sharp $1");
  // Fingerings: 1-2-3-4 → 1, 2, 3, 4
  s = s.replace(/\b\d(?:-\d)+\b/g, (m) => m.split("-").join(", "));
  // Ranges and dashes
  s = s.replace(/(\d)\s*–\s*(\d)/g, "$1 to $2");
  s = s.replace(/([A-Za-z0-9])–([A-Za-z])/g, "$1 to $2");
  s = s.replace(/\s+[–—]\s+/g, ", ");
  s = s.replace(/\s*→\s*/g, ", then ");
  s = s.replace(/\s*·\s*/g, ", ");
  s = s.replace(/×/g, " times ");
  s = s.replace(/\s*\|\s*/g, ", ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

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

/** Picks a clear English voice: the one the listener chose, else a natural-sounding local voice. */
function pickVoice(want?: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  if (want) {
    const v = voices.find((x) => x.voiceURI === want);
    if (v) return v;
  }
  const en = voices.filter((v) => /^en(-|_|$)/i.test(v.lang));
  const rank = (v: SpeechSynthesisVoice) =>
    (/natural|neural|premium|enhanced/i.test(v.name) ? 0 : 4) + (/en-US/i.test(v.lang) ? 0 : 1) + (v.localService ? 0 : 1) + (/google us english|samantha|aria|jenny/i.test(v.name) ? -2 : 0);
  return en.sort((a, b) => rank(a) - rank(b))[0] ?? voices[0];
}

class Reader {
  private items: ReadItem[] = [];
  private i = 0;
  private lit: HTMLElement | null = null;
  private run = 0;
  private listeners = new Set<Listener>();
  state: ReaderState = { status: "idle", index: 0, total: 0 };
  prefs = { rate: 1, voice: undefined as string | undefined, autoRead: false };
  private loaded = false;

  private ensurePrefs() {
    if (this.loaded || typeof window === "undefined") return;
    this.prefs = { ...this.prefs, ...loadPrefs() };
    this.loaded = true;
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

  speak(items: ReadItem[], label?: string) {
    if (!speechSupported()) return;
    this.ensurePrefs();
    this.stop(false);
    this.items = items.filter((x) => x.text.trim());
    if (!this.items.length) return;
    this.i = 0;
    this.emit({ status: "speaking", index: 0, total: this.items.length, label });
    this.say();
  }

  private say() {
    const run = ++this.run;
    const item = this.items[this.i];
    if (!item) return this.stop();
    const u = new SpeechSynthesisUtterance(toSpeech(item.text));
    u.rate = this.prefs.rate;
    u.lang = "en-US";
    const v = pickVoice(this.prefs.voice);
    if (v) u.voice = v;
    u.onend = () => {
      if (run !== this.run || this.state.status !== "speaking") return;
      this.i++;
      if (this.i >= this.items.length) return this.stop();
      this.emit({ ...this.state, index: this.i });
      this.say();
    };
    u.onerror = () => {
      if (run === this.run) this.stop();
    };
    this.light(item.el);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  pause() {
    if (this.state.status !== "speaking") return;
    window.speechSynthesis.pause();
    this.emit({ ...this.state, status: "paused" });
  }

  resume() {
    if (this.state.status !== "paused") return;
    window.speechSynthesis.resume();
    this.emit({ ...this.state, status: "speaking" });
  }

  jump(delta: number) {
    if (this.state.status === "idle") return;
    this.i = Math.max(0, Math.min(this.items.length - 1, this.i + delta));
    this.emit({ ...this.state, status: "speaking", index: this.i });
    this.say();
  }

  stop(announce = true) {
    this.run++;
    if (speechSupported()) window.speechSynthesis.cancel();
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
