"use client";

import { useMemo, useState } from "react";
import type { Exercise, Vehicle } from "@/content/types";
import { chartChords, chartSpec, prettyChord, transposeChart } from "@/lib/changes";
import { ExercisePlayer } from "./ExercisePlayer";

/** A tune's changes as an exercise the player can engrave and play. */
export function chartExercise(v: Vehicle, alt = false): Exercise {
  const a = alt && v.alt ? v.alt : null;
  const chart = a ? transposeChart(v.chart, a.steps, a.semitones) : v.chart;
  const key = a ? a.abcKey : v.abcKey;
  const spec = chartSpec(chart, key, v.tempo);
  const { voicings: _voicings, ...notation } = spec;
  void _voicings;
  const symbols = chartChords(chart).map((c) => prettyChord(c.symbol));
  return {
    id: `tune-${v.id}${a ? "-alt" : ""}`,
    title: `${v.name}, changes in ${a ? a.key : v.key}`,
    kind: "jazz",
    source: { kind: "original", note: v.source.note },
    hands: "LH",
    vehicle: v.id,
    key,
    spelling: symbols.join(", "),
    tempo: { start: v.tempo },
    reps: "One chorus",
    steps: [],
    errors: [],
    cue: "",
    check: "",
    easier: "",
    notation,
    skills: [],
  };
}

export function TuneChart({ v }: { v: Vehicle }) {
  const [alt, setAlt] = useState(false);
  const ex = useMemo(() => chartExercise(v, alt), [v, alt]);
  return (
    <div className="tune-chart">
      <div className="tune-chart-head">
        <h3>
          The changes in {alt && v.alt ? v.alt.key : v.key}
          <span className="hint">, left-hand guide tones under the symbols</span>
        </h3>
        {v.alt && (
          <span className="seg" role="group" aria-label="Key">
            <button type="button" aria-pressed={!alt} onClick={() => setAlt(false)}>
              {v.key}
            </button>
            <button type="button" aria-pressed={alt} onClick={() => setAlt(true)}>
              {v.alt.key}, {v.alt.label}
            </button>
          </span>
        )}
      </div>
      {alt && v.alt && <p className="hint">{v.alt.note}</p>}
      <div className="ex tune-ex" key={ex.id}>
        <ExercisePlayer ex={ex} />
      </div>
    </div>
  );
}
