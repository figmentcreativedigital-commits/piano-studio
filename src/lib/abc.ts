import type { ChordSpec, NotationSpec } from "@/content/types";

/**
 * Builds ABC notation from a NotationSpec. One source for notation and
 * playback: the player reads pitches from the abcjs object made from this text.
 */

export const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
export type Letter = (typeof LETTERS)[number];

/** Key-signature accidentals: +1 sharp, -1 flat. */
export const KEY_SIGNATURES: Record<string, Partial<Record<Letter, number>>> = {
  C: {},
  G: { F: 1 },
  D: { F: 1, C: 1 },
  A: { F: 1, C: 1, G: 1 },
  E: { F: 1, C: 1, G: 1, D: 1 },
  F: { B: -1 },
  Bb: { B: -1, E: -1 },
  Eb: { B: -1, E: -1, A: -1 },
  Ab: { B: -1, E: -1, A: -1, D: -1 },
  Db: { B: -1, E: -1, A: -1, D: -1, G: -1 },
  Am: {},
  Dm: { B: -1 },
  Gm: { B: -1, E: -1 },
  Cm: { B: -1, E: -1, A: -1 },
};

export interface Pitch {
  letter: Letter;
  accidental: number; // -1, 0, +1
  octave: number;
}

/** "Ab4" → { letter: "A", accidental: -1, octave: 4 }. Accepts b/♭ and #/♯. */
export function parsePitch(name: string): Pitch {
  const m = /^([A-G])(bb|##|b|#|♭|♯|n)?(-?\d)$/.exec(name.trim());
  if (!m) throw new Error(`Bad pitch name: ${name}`);
  const acc = m[2];
  const accidental = acc === "b" || acc === "♭" ? -1 : acc === "#" || acc === "♯" ? 1 : acc === "bb" ? -2 : acc === "##" ? 2 : 0;
  return { letter: m[1] as Letter, accidental, octave: parseInt(m[3], 10) };
}

export const SEMITONES: Record<Letter, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export function midiOf(name: string): number {
  const p = parsePitch(name);
  return 12 * (p.octave + 1) + SEMITONES[p.letter] + p.accidental;
}

/** Display form: "Ab4" → "A♭4". */
export function prettyPitch(name: string): string {
  return name.replace(/([A-G])bb/, "$1𝄫").replace(/([A-G])##/, "$1𝄪").replace(/([A-G])b/, "$1♭").replace(/([A-G])#/, "$1♯");
}

/** Letter + octave in ABC: C4 → "C", C5 → "c", C6 → "c'", C3 → "C,", C2 → "C,,". */
export function abcLetter(letter: Letter, octave: number): string {
  if (octave >= 5) return letter.toLowerCase() + "'".repeat(octave - 5);
  return letter + ",".repeat(Math.max(0, 4 - octave));
}

function unitQuarters(unit: string): number {
  const [n, d] = unit.split("/").map(Number);
  return (4 * n) / d;
}

/** Duration suffix for a length in quarter notes, relative to the unit length. */
export function lengthSuffix(beats: number, unit: string): string {
  const units = beats / unitQuarters(unit);
  if (Math.abs(units - 1) < 1e-9) return "";
  if (Number.isInteger(units)) return String(units);
  if (Math.abs(units - 0.5) < 1e-9) return "/";
  // Express as a fraction.
  for (const d of [2, 4, 8]) {
    const n = units * d;
    if (Math.abs(n - Math.round(n)) < 1e-9) return `${Math.round(n)}/${d}`;
  }
  throw new Error(`Unsupported length ${beats} with unit ${unit}`);
}

/**
 * Chords → bars. Accidentals follow engraving practice: written when a note
 * differs from the key signature or from an earlier accidental on the same
 * staff position in the bar; carried to the end of the bar.
 */
export function chordsToBars(chords: ChordSpec[], key: string, unit: string, beatsPerBar = 4): string[] {
  const sig = KEY_SIGNATURES[key];
  if (!sig) throw new Error(`Unknown key ${key}`);
  const bars: string[] = [];
  let tokens: string[] = [];
  let beatCount = 0;
  let inBar = new Map<string, number>();
  for (const c of chords) {
    const parts = c.notes.map((n, i) => {
      const p = parsePitch(n);
      const slot = `${p.letter}${p.octave}`;
      const current = inBar.has(slot) ? (inBar.get(slot) as number) : sig[p.letter] ?? 0;
      let acc = "";
      if (p.accidental !== current) {
        acc = p.accidental === -1 ? "_" : p.accidental === 1 ? "^" : p.accidental === -2 ? "__" : p.accidental === 2 ? "^^" : "=";
        inBar.set(slot, p.accidental);
      }
      const finger = c.fingers && c.fingers[i] ? `!${c.fingers[i]}!` : "";
      return finger + acc + abcLetter(p.letter, p.octave);
    });
    const symbol = c.symbol ? `"${c.symbol}"` : "";
    const body = parts.length === 1 ? parts[0] : `[${parts.join("")}]`;
    tokens.push(symbol + body + lengthSuffix(c.beats, unit));
    beatCount += c.beats;
    if (beatCount >= beatsPerBar - 1e-9) {
      if (Math.abs(beatCount - beatsPerBar) > 1e-9) throw new Error("Chord crosses a barline");
      bars.push(tokens.join(" "));
      tokens = [];
      beatCount = 0;
      inBar = new Map();
    }
  }
  if (tokens.length) bars.push(tokens.join(" "));
  return bars;
}

export function beatsPerBar(meter = "4/4"): number {
  if (meter === "C") return 4;
  if (meter === "C|") return 2;
  const [n, d] = meter.split("/").map(Number);
  return (n * 4) / d;
}

export const FORMAT = [
  "%%measurenb 0",
  "%%stretchlast 1",
  "%%gchordfont Helvetica 17 bold",
  "%%annotationfont Helvetica 14 bold",
  "%%tempofont Helvetica 14 bold",
  "%%measurefont Times 12 italic",
];

/** Bars of a spec, with chords expanded. */
export function specBars(spec: NotationSpec): { rh?: string[]; lh?: string[]; bars?: string[] } {
  if (spec.chords) return { bars: chordsToBars(spec.chords, spec.key, spec.unit, beatsPerBar(spec.meter)) };
  if (spec.rh && spec.lh) return { rh: spec.rh, lh: spec.lh };
  return { bars: spec.bars };
}

export function buildAbc(spec: NotationSpec, barsPerLine: number, opts: { showTempo?: boolean } = {}): string {
  const showTempo = opts.showTempo ?? true;
  const h = ["X:1", ...FORMAT, `M:${spec.meter ?? "4/4"}`, `L:${spec.unit}`];
  if (showTempo) h.push(`Q:${spec.tempoText ? `"${spec.tempoText}" ` : ""}1/4=${spec.tempo}`);
  const b = specBars(spec);
  const twoStaves = !!(b.rh && b.lh);
  h.push(`K:${spec.key}${!twoStaves && spec.clef === "bass" ? " clef=bass" : ""}`);
  if (spec.directives) h.push(...spec.directives);
  if (spec.raw) {
    h.push(spec.raw);
    return h.join("\n");
  }
  if (twoStaves) {
    h.push("%%score {RH | LH}", "V:RH clef=treble", "V:LH clef=bass");
    const n = b.rh!.length;
    for (let i = 0; i < n; i += barsPerLine) {
      const end = i + barsPerLine >= n;
      h.push(`[V:RH] ${b.rh!.slice(i, i + barsPerLine).join(" | ")}${end ? " |]" : " |"}`);
      h.push(`[V:LH] ${b.lh!.slice(i, i + barsPerLine).join(" | ")}${end ? " |]" : " |"}`);
    }
  } else {
    const bars = b.bars ?? [];
    for (let i = 0; i < bars.length; i += barsPerLine) {
      const end = i + barsPerLine >= bars.length;
      if (spec.barlines) {
        const chunk = bars.slice(i, i + barsPerLine).map((bar, k) => {
          const at = i + k;
          return `${bar} ${at === bars.length - 1 ? "|]" : spec.barlines![at] ?? "|"}`;
        });
        h.push(chunk.join(" "));
      } else h.push(`${bars.slice(i, i + barsPerLine).join(" | ")}${end ? " |]" : " |"}`);
    }
  }
  return h.join("\n");
}
