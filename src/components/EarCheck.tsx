"use client";

import { useState } from "react";
import { midiOf } from "@/lib/abc";
import { playChord } from "@/lib/audio";

const C6 = [
  ["C4", "E4", "G4", "A4"],
  ["E4", "G4", "A4", "C5"],
  ["G4", "A4", "C5", "E5"],
  ["A4", "C5", "E5", "G5"],
];
const DIM = [
  ["D4", "F4", "Ab4", "B4"],
  ["F4", "Ab4", "B4", "D5"],
  ["Ab4", "B4", "D5", "F5"],
  ["B4", "D5", "F5", "Ab5"],
];

type Q = { kind: "C6" | "B°"; notes: string[] };

function pick(): Q {
  const dim = Math.random() < 0.5;
  const set = dim ? DIM : C6;
  return { kind: dim ? "B°" : "C6", notes: set[Math.floor(Math.random() * set.length)] };
}

/** Ten-chord ear check: settled (C6) or leaning (B°)? */
export function EarCheck() {
  const [q, setQ] = useState<Q | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, done: 0 });
  const finished = score.done >= 10;

  const next = () => {
    const nq = pick();
    setQ(nq);
    setAnswer(null);
    playChord(nq.notes.map(midiOf));
  };
  const guess = (k: "C6" | "B°") => {
    if (!q || answer) return;
    setAnswer(k);
    setScore((s) => ({ right: s.right + (k === q.kind ? 1 : 0), done: s.done + 1 }));
  };

  return (
    <div className="paper" style={{ padding: 18 }}>
      <div className="btn-row" style={{ marginBottom: 12 }}>
        {!finished && (
          <button type="button" className="btn primary" onClick={q && !answer ? () => playChord(q.notes.map(midiOf)) : next} style={{ borderColor: "var(--paper-ink)" }}>
            {!q ? "Play the first chord" : !answer ? "Play it again" : "Next chord"}
          </button>
        )}
        <button type="button" className="btn" disabled={!q || !!answer} onClick={() => guess("C6")} style={{ borderColor: "var(--paper-ink)", color: "var(--paper-ink)" }}>
          C6 (settled)
        </button>
        <button type="button" className="btn" disabled={!q || !!answer} onClick={() => guess("B°")} style={{ borderColor: "var(--paper-ink)", color: "var(--paper-ink)" }}>
          B° (leaning)
        </button>
      </div>
      <p aria-live="polite" style={{ margin: 0, fontFamily: "var(--serif)" }}>
        {answer && q && (answer === q.kind ? `Yes, ${q.kind}: ${q.notes.join(" ").replace(/b(\d)/g, "♭$1")}. ` : `That was ${q.kind}: ${q.notes.join(" ").replace(/b(\d)/g, "♭$1")}. Play it and sing the top note. `)}
        {score.done > 0 && `${score.right} of ${score.done} right.`}
        {finished && (
          <>
            {" "}
            {score.right >= 9 ? "Done. You passed the check." : "Not 9 out of 10 yet. Try another round tomorrow."}{" "}
            <button type="button" className="btn small" onClick={() => { setScore({ right: 0, done: 0 }); setQ(null); setAnswer(null); }}>
              New round
            </button>
          </>
        )}
      </p>
    </div>
  );
}
