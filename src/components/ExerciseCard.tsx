"use client";

import Link from "next/link";
import { SOURCE_LABEL, SKILLS } from "@/content";
import type { Exercise } from "@/content/types";
import { EarCheck } from "./EarCheck";
import { ExercisePlayer } from "./ExercisePlayer";

const STATUS: Record<string, string> = {
  verified: "verified",
  "secondary-sources": "from secondary sources",
  "pending-primary-check": "primary source check pending",
};

function searchLinks(q: string) {
  const s = encodeURIComponent(q);
  return [
    { label: "Find on Spotify", href: `https://open.spotify.com/search/${s}` },
    { label: "Find on YouTube", href: `https://www.youtube.com/results?search_query=${s}` },
  ];
}

export function ExerciseCard({ ex, lhRest = false, simplify = false }: { ex: Exercise; lhRest?: boolean; simplify?: boolean }) {
  const lhOnly = ex.hands === "LH";
  const r = ex.recording;
  return (
    <article className="ex" id={`ex-${ex.id}`} aria-labelledby={`ex-${ex.id}-t`}>
      <header className="ex-head">
        <h3 className="ex-title" id={`ex-${ex.id}-t`}>
          {ex.title}
        </h3>
        {ex.subtitle && <p className="ex-sub">{ex.subtitle}</p>}
        <span className={`source ${ex.source.kind}`}>
          <b>{SOURCE_LABEL[ex.source.kind]}</b>
          <span>
            {ex.source.note}
            {ex.source.status && ` (${STATUS[ex.source.status]})`}
          </span>
        </span>
        {ex.spelling && !ex.hideNotation && <p className="ex-spell">{ex.spelling}</p>}
        {ex.fingering && <p className="ex-spell">Fingering: {ex.fingering}</p>}
      </header>

      {lhRest && (ex.hands === "LH" || ex.hands === "both") && (
        <div className="care" style={{ margin: "0 20px 14px" }}>
          Left hand rests today. {lhOnly ? "Sing this part, or tap the rhythm on your knee, instead of playing it." : "Play the right-hand part only; playback is set to RH."}
        </div>
      )}
      {simplify && (
        <div className="care" style={{ margin: "0 20px 14px", borderLeftColor: "var(--felt)" }}>
          Start with the easier version: {ex.easier} Move to the full version after three clean runs.
        </div>
      )}

      {r && (
        <div className="recording">
          <span>
            <strong>{r.artist}</strong>, &ldquo;{r.title}&rdquo;
          </span>
          <span className="muted">
            {r.album}. Recorded {r.recorded}.{r.personnel ? ` ${r.personnel}.` : ""}
          </span>
          {r.cue && <span>{r.cue}.</span>}
          <p className="q">{r.question}</p>
          <span className="btn-row">
            {searchLinks(`${r.artist.split("(")[0]} ${r.title}`).map((l) => (
              <a key={l.href} className="btn small" href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
            {r.sourceUrl && (
              <a className="btn small ghost" href={r.sourceUrl} target="_blank" rel="noreferrer">
                Session details
              </a>
            )}
          </span>
        </div>
      )}

      {ex.id === "ear-quality" ? <EarCheck /> : <ExercisePlayer ex={ex} lhRest={lhRest} />}

      {ex.link && (
        <div style={{ padding: "14px 20px 0" }}>
          <Link className="btn primary" href={ex.link.href}>
            {ex.link.label}
          </Link>
        </div>
      )}

      <div className="ex-body">
        <div>
          <h4>How to practice</h4>
          <ol>
            {ex.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          {(ex.listenFor || ex.feelFor) && (
            <>
              {ex.listenFor && (
                <>
                  <h4>Listen for</h4>
                  <p>{ex.listenFor}</p>
                </>
              )}
              {ex.feelFor && (
                <>
                  <h4>Feel for</h4>
                  <p>{ex.feelFor}</p>
                </>
              )}
            </>
          )}
          <h4>Common errors</h4>
          <ul>
            {ex.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Cue</h4>
          <p className="cue">{ex.cue}</p>
          <div className="done-when">
            <h4>Done when</h4>
            <p>{ex.check}</p>
            <p className="hint" style={{ margin: 0 }}>
              Start at ♩ = {ex.tempo.start || "record tempo"}
              {ex.tempo.target ? `, aim for ♩ = ${ex.tempo.target}` : ""}. {ex.reps}.{ex.tempo.note ? ` ${ex.tempo.note}.` : ""}
            </p>
          </div>
          <h4>Easier</h4>
          <p>{ex.easier}</p>
          {ex.harder && (
            <>
              <h4>Harder</h4>
              <p>{ex.harder}</p>
            </>
          )}
          {ex.lhCare && <div className="care">{ex.lhCare}</div>}
          {ex.skills.length > 0 && (
            <p className="hint">Builds: {ex.skills.map((s) => SKILLS[s]?.name ?? s).join(", ")}</p>
          )}
        </div>
      </div>
    </article>
  );
}
