import type { ChartSection, NotationSpec } from "@/content/types";
import { KEY_SIGNATURES, LETTERS, SEMITONES, abcLetter, type Letter } from "./abc";

/**
 * Chord charts for the three tunes. A chart is written once as chord symbols;
 * from it come the engraved part (bass clef, left-hand guide tones under the
 * symbols) and the audio, so the two cannot disagree.
 *
 * Guide tones are the 3rd and 7th of each chord (3rd and 6th for sixth and
 * diminished chords), voiced between B♭2 and E♭4 and moved by the smallest
 * steps, which is how Week 1 plays the blues: F7 = E♭3 + A3, B♭7 = D3 + A♭3,
 * C7 = E3 + B♭3.
 */

export type Quality = "6" | "7" | "maj7" | "m7" | "m6" | "dim7" | "m7b5" | "7b9";

export interface Chord {
  letter: Letter;
  acc: number;
  quality: Quality;
}

const ROOT = /^([A-G])(b|♭|#|♯)?(.*)$/;

const QUALITY: Record<string, Quality> = {
  "": "6",
  "6": "6",
  "7": "7",
  maj7: "maj7",
  "Δ": "maj7",
  m7: "m7",
  m6: "m6",
  m: "m6",
  "°": "dim7",
  "°7": "dim7",
  dim7: "dim7",
  ø: "m7b5",
  "ø7": "m7b5",
  m7b5: "m7b5",
  "m7♭5": "m7b5",
  "7b9": "7b9",
  "7♭9": "7b9",
};

export function parseChord(symbol: string): Chord {
  const m = ROOT.exec(symbol.trim());
  if (!m) throw new Error(`Bad chord symbol: ${symbol}`);
  const quality = QUALITY[m[3]];
  if (!quality) throw new Error(`Unknown chord quality "${m[3]}" in ${symbol}`);
  const acc = m[2] === "b" || m[2] === "♭" ? -1 : m[2] === "#" || m[2] === "♯" ? 1 : 0;
  return { letter: m[1] as Letter, acc, quality };
}

const ACC_TEXT: Record<number, string> = { [-1]: "♭", 0: "", 1: "♯" };
const QUALITY_TEXT: Record<Quality, string> = { "6": "6", "7": "7", maj7: "maj7", m7: "m7", m6: "m6", dim7: "°7", m7b5: "m7♭5", "7b9": "7♭9" };

/** "Bb6" → "B♭6", "E°7" stays, "Em7b5" → "Em7♭5". */
export function prettyChord(symbol: string): string {
  const c = parseChord(symbol);
  return `${c.letter}${ACC_TEXT[c.acc]}${QUALITY_TEXT[c.quality]}`;
}

/** ABC chord-symbol text; abcjs turns b and # into ♭ and ♯. */
function abcSymbol(c: Chord): string {
  const acc = c.acc === -1 ? "b" : c.acc === 1 ? "#" : "";
  const q = c.quality === "m7b5" ? "m7b5" : c.quality === "7b9" ? "7b9" : c.quality === "dim7" ? "°7" : c.quality;
  return `${c.letter}${acc}${q}`;
}

const pcOf = (letter: Letter, acc: number) => (((SEMITONES[letter] + acc) % 12) + 12) % 12;

interface Spelled {
  letter: Letter;
  acc: number;
}

/** The note `steps` letters and `semis` semitones above a root, spelled plainly. */
function above(root: Spelled, steps: number, semis: number): Spelled {
  const li = LETTERS.indexOf(root.letter);
  const letter = LETTERS[(li + steps) % 7];
  const target = (pcOf(root.letter, root.acc) + semis) % 12;
  let acc = target - SEMITONES[letter];
  if (acc > 6) acc -= 12;
  if (acc < -6) acc += 12;
  // Prefer a plain spelling over a double accidental or a white-key flat or sharp.
  if (Math.abs(acc) > 1 || (letter === "F" && acc === -1) || (letter === "C" && acc === -1) || (letter === "E" && acc === 1) || (letter === "B" && acc === 1)) {
    return respell(target, acc < 0);
  }
  return { letter, acc };
}

function respell(pc: number, flats: boolean): Spelled {
  const natural = LETTERS.find((l) => SEMITONES[l] === pc);
  if (natural) return { letter: natural, acc: 0 };
  const l = LETTERS.find((x) => (SEMITONES[x] + (flats ? -1 : 1) + 12) % 12 === pc)!;
  return { letter: l, acc: flats ? -1 : 1 };
}

/** The two guide tones of a chord, lower-in-the-chord first (3rd, then 6th or 7th). */
export function guideTones(symbol: string): [Spelled, Spelled] {
  const c = parseChord(symbol);
  const root = { letter: c.letter, acc: c.acc };
  const minor3 = ["m7", "m6", "dim7", "m7b5"].includes(c.quality);
  const third = above(root, 2, minor3 ? 3 : 4);
  const top =
    c.quality === "6" || c.quality === "m6" ? above(root, 5, 9) : c.quality === "dim7" ? above(root, 6, 9) : above(root, 6, c.quality === "maj7" ? 11 : 10);
  return [third, top];
}

const midi = (s: Spelled, octave: number) => 12 * (octave + 1) + SEMITONES[s.letter] + s.acc;

export interface Voiced {
  notes: { letter: Letter; acc: number; octave: number }[];
  midi: [number, number];
}

const LOW = 46; // B♭2
const HIGH = 63; // E♭4

/** Places a chord's guide tones as a dyad close to the previous one. */
export function voice(symbol: string, prev?: [number, number]): Voiced {
  const [a, b] = guideTones(symbol);
  const options: { lo: Spelled; hi: Spelled; lo8: number; hi8: number; m: [number, number] }[] = [];
  for (const [lo, hi] of [
    [a, b],
    [b, a],
  ] as const) {
    for (let o = 2; o <= 4; o++) {
      const lm = midi(lo, o);
      let ho = o;
      while (midi(hi, ho) <= lm) ho++;
      const hm = midi(hi, ho);
      if (lm >= LOW && hm <= HIGH) options.push({ lo, hi, lo8: o, hi8: ho, m: [lm, hm] });
    }
  }
  if (!options.length) throw new Error(`No voicing for ${symbol}`);
  const centre: [number, number] = prev ?? [51, 57];
  const cost = (m: [number, number]) => Math.abs(m[0] - centre[0]) + Math.abs(m[1] - centre[1]) + (m[1] - m[0] > 6 ? 5 : 0);
  options.sort((x, y) => cost(x.m) - cost(y.m));
  const best = options[0];
  return {
    notes: [
      { letter: best.lo.letter, acc: best.lo.acc, octave: best.lo8 },
      { letter: best.hi.letter, acc: best.hi.acc, octave: best.hi8 },
    ],
    midi: best.m,
  };
}

/** Moves a chord symbol by a number of letter steps and semitones (F → A♭ is 2 steps, 3 semitones). */
export function transposeSymbol(symbol: string, steps: number, semis: number): string {
  const c = parseChord(symbol);
  const r = above({ letter: c.letter, acc: c.acc }, steps, semis);
  return abcSymbol({ ...c, letter: r.letter, acc: r.acc });
}

export function transposeChart(chart: ChartSection[], steps: number, semis: number): ChartSection[] {
  return chart.map((s) => ({ ...s, bars: s.bars.map((bar) => bar.split(/\s+/).map((x) => transposeSymbol(x, steps, semis)).join(" ")) }));
}

/** Chord symbols in order, with their length in beats. */
export function chartChords(chart: ChartSection[]): { symbol: string; beats: number; bar: number }[] {
  const out: { symbol: string; beats: number; bar: number }[] = [];
  let bar = 0;
  for (const s of chart) {
    for (const b of s.bars) {
      const parts = b.split(/\s+/).filter(Boolean);
      for (const p of parts) out.push({ symbol: p, beats: 4 / parts.length, bar });
      bar++;
    }
  }
  return out;
}

/**
 * The engraved part: bass clef, chord symbols above, each guide-tone dyad
 * short on the chord's first beat. Rehearsal letters at each section, a double
 * bar between sections. Line breaks are left to the score, so phones get two
 * bars to a line and wide screens four.
 */
export function chartSpec(chart: ChartSection[], key: string, tempo: number): NotationSpec & { voicings: [number, number][] } {
  const sig = KEY_SIGNATURES[key];
  if (!sig) throw new Error(`Unknown key ${key}`);
  let prev: [number, number] | undefined;
  const voicings: [number, number][] = [];
  const bars: string[] = [];
  const barlines: string[] = [];
  chart.forEach((section, si) => {
    section.bars.forEach((bar, bi) => {
      const parts = bar.split(/\s+/).filter(Boolean);
      const inBar = new Map<string, number>();
      const tokens = parts.map((sym) => {
        const v = voice(sym, prev);
        prev = v.midi;
        voicings.push(v.midi);
        const notes = v.notes.map((n) => {
          const slot = `${n.letter}${n.octave}`;
          const current = inBar.has(slot) ? inBar.get(slot)! : (sig[n.letter] ?? 0);
          let acc = "";
          if (n.acc !== current) {
            acc = n.acc === -1 ? "_" : n.acc === 1 ? "^" : "=";
            inBar.set(slot, n.acc);
          }
          return acc + abcLetter(n.letter, n.octave);
        });
        return `"${abcSymbol(parseChord(sym))}"[${notes.join("")}]${parts.length === 1 ? " z z2" : " z"}`;
      });
      const mark = bi === 0 && section.mark ? `[P:${section.mark}] ` : "";
      bars.push(mark + tokens.join(" "));
      barlines.push(bi === section.bars.length - 1 && si < chart.length - 1 ? "||" : "|");
    });
  });
  return {
    unit: "1/4",
    key,
    tempo,
    clef: "bass",
    swing: true,
    clickMode: "twofour",
    barsPerLine: 4,
    bars,
    barlines,
    directives: ["%%partsfont Times 18 bold italic", "%%partsbox 1"],
    voicings,
  };
}
