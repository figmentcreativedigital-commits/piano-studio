"use client";

import { useMemo, useState } from "react";
import type { BachPiece } from "@/content/bach";
import type { Exercise, NotationSpec } from "@/content/types";
import { ExercisePlayer } from "./ExercisePlayer";

/*
 * A whole Bach piece with playback, or one section of it. Bach's music is in the public
 * domain, so the full score is shown. Sections keep the right clef when they start in the
 * middle of a clef change, and Prelude 1 can show its chord names above the staff.
 */

const CLEF = /\[K:[^\]]*clef=(treble|bass)\]\s*/;

function clefAt(bars: string[], index: number, start: "treble" | "bass"): "treble" | "bass" {
  let clef = start;
  for (let i = 0; i <= index && i < bars.length; i++) {
    const m = bars[i].match(CLEF);
    if (m) clef = m[1] as "treble" | "bass";
  }
  return clef;
}

function slice(piece: BachPiece, from: number, to: number, chords: boolean): NotationSpec {
  const n = piece.notation;
  const rh = n.rh!.slice(from - 1, to);
  const lh = n.lh!.slice(from - 1, to);
  // Start the left hand in the clef it was in at the first bar of the section.
  const lhClef = clefAt(n.lh!, from - 1, "bass");
  if (lhClef === "treble" && !CLEF.test(lh[0])) lh[0] = `[K:${n.key} clef=treble] ${lh[0]}`;
  const withChords =
    chords && piece.harmony
      ? rh.map((bar, i) => `"${piece.harmony![from - 1 + i].replace(/"/g, "")}"${bar}`)
      : rh;
  // Number the bars as they are numbered in the book.
  const directives = from > 1 ? [...(n.directives ?? []), `%%setbarnb ${from}`] : n.directives;
  return { ...n, rh: withChords, lh, directives };
}

export function BachScore({ piece }: { piece: BachPiece }) {
  const [range, setRange] = useState<[number, number]>([1, piece.bars]);
  const [chords, setChords] = useState(!!piece.harmony);
  const ex: Exercise = useMemo(
    () => ({
      id: `bach-${piece.id}-${range[0]}-${range[1]}${chords ? "-c" : ""}`,
      title: piece.title,
      kind: "bach",
      source: { kind: "bach", note: `${piece.title}, ${piece.bwv}` },
      hands: "both",
      key: piece.key,
      tempo: { start: piece.notation.tempo },
      reps: "",
      steps: [],
      errors: [],
      cue: "",
      check: "",
      easier: "",
      notation: slice(piece, range[0], range[1], chords),
      skills: [],
    }),
    [piece, range, chords],
  );
  const all = range[0] === 1 && range[1] === piece.bars;
  return (
    <div className="bach-score">
      <div className="bach-controls">
        <span className="seg bach-sections" role="group" aria-label="Choose the bars to play">
          <button type="button" aria-pressed={all} onClick={() => setRange([1, piece.bars])}>
            All {piece.bars} bars
          </button>
          {piece.sections.map((s) => (
            <button
              key={s.bars.join("-")}
              type="button"
              aria-pressed={range[0] === s.bars[0] && range[1] === s.bars[1]}
              onClick={() => setRange(s.bars)}
            >
              {s.bars[0]}–{s.bars[1]}
            </button>
          ))}
        </span>
        {piece.harmony && (
          <label className="chip">
            <input type="checkbox" checked={chords} onChange={(e) => setChords(e.target.checked)} />
            <span>Show the chords</span>
          </label>
        )}
      </div>
      <ExercisePlayer key={ex.id} ex={ex} />
    </div>
  );
}
