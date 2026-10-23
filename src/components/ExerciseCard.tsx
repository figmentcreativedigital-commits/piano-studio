"use client";

import Link from "next/link";
import { SOURCE_LABEL } from "@/content";
import type { Exercise } from "@/content/types";
import { EarCheck } from "./EarCheck";
import { ExercisePlayer } from "./ExercisePlayer";
import { ReadButton } from "./ReadAloud";
import { readable } from "@/lib/speech-text";
import { COMMON_MISTAKES, moreHelpReadings } from "@/lib/narration";
import { glosser } from "./glosser";

const STATUS: Record<string, string> = {
  verified: "checked",
  "checked-in-class": "checked against Barry in class",
  "secondary-sources": "from secondhand sources",
  "pending-primary-check": "not yet checked against the original",
};

function searchLinks(q: string) {
  const s = encodeURIComponent(q);
  return [
    { label: "Find on Spotify", href: `https://open.spotify.com/search/${s}` },
    { label: "Find on YouTube", href: `https://www.youtube.com/results?search_query=${s}` },
  ];
}

/** What's inside "More help", so it's clear what opening it gives you. */
function helpHint(ex: Exercise): string {
  return [ex.listenFor && "Listen for", ex.feelFor && "Feel for", "Mistakes", "Easier", ex.harder && "Harder"].filter(Boolean).join(" · ");
}

export function ExerciseCard({ ex, lhRest = false, simplify = false }: { ex: Exercise; lhRest?: boolean; simplify?: boolean }) {
  const lhOnly = ex.hands === "LH";
  const r = ex.recording;
  const g = glosser();
  const more = moreHelpReadings(ex);
  return (
    <article className="ex" id={`ex-${ex.id}`} aria-labelledby={`ex-${ex.id}-t`} data-tour="exercise" data-read-region>
      <header className="ex-head">
        <div className="ex-title-row">
          <h3 className="ex-title" id={`ex-${ex.id}-t`} {...readable(ex.title)}>
            {ex.title}
          </h3>
          <ReadButton label="Read aloud" what={`ex-${ex.id}`} collapsed />
        </div>
        {ex.subtitle && <p className="ex-sub">{ex.subtitle}</p>}
        <span className={`source ${ex.source.kind}`} data-tour="exercise-source">
          <b>{SOURCE_LABEL[ex.source.kind]}</b>
          <span>
            {ex.source.note}
            {ex.source.status && ` (${STATUS[ex.source.status]})`}
          </span>
        </span>
        {ex.spelling && !ex.hideNotation && (
          <p className="ex-spell" {...readable(ex.spelling)}>
            {ex.spelling}
          </p>
        )}
        {ex.fingering && (
          <p className="ex-spell" {...readable(`Fingering: ${ex.fingering}`)}>
            Fingering: {ex.fingering}
          </p>
        )}
      </header>

      {lhRest && (ex.hands === "LH" || ex.hands === "both") && (
        <div className="care" style={{ margin: "0 20px 14px" }}>
          Left hand rests today. {lhOnly ? "Sing this part, or tap the rhythm on your knee, instead of playing it." : "Play the right-hand part only. Playback is set to the right hand."}
        </div>
      )}
      {simplify && (
        <div className="care" style={{ margin: "0 20px 14px" }}>
          Start with the easier version: {ex.easier} Move to the full version after 3 clean runs.
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
              <li key={i} {...readable(s)}>
                {g(s)}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h4>Cue</h4>
          <p className="cue" {...readable(`Cue: ${ex.cue}`)}>
            {g(ex.cue)}
          </p>
          <div className="done-when" data-tour="done-when">
            <h4>Done when</h4>
            <p {...readable(`Done when: ${ex.check}`)}>
              {g(ex.check)}
            </p>
            <p className="hint" style={{ margin: 0 }}>
              Start at ♩ = {ex.tempo.start || "the recording's tempo"}
              {ex.tempo.target ? `, aim for ♩ = ${ex.tempo.target}` : ""}. {ex.reps}.{ex.tempo.note ? ` ${ex.tempo.note}.` : ""}
            </p>
          </div>
          {ex.lhCare && <div className="care">{ex.lhCare}</div>}
        </div>
      </div>

      {/* Tips stay one tap away, so the card shows only what you need while playing. */}
      <details className="more-help" data-tour="more-help">
        <summary>
          <span className="more-help-label">More help</span>
          <span className="more-help-hint">{helpHint(ex)}</span>
          <span className="more-help-chev" aria-hidden="true" />
        </summary>
        <div className="more-help-body">
          {more.listenFor && (
            <section>
              <h4>Listen for</h4>
              <p {...readable(more.listenFor)}>{g(ex.listenFor!)}</p>
            </section>
          )}
          {more.feelFor && (
            <section>
              <h4>Feel for</h4>
              <p {...readable(more.feelFor)}>{g(ex.feelFor!)}</p>
            </section>
          )}
          <section>
            <h4 {...readable(COMMON_MISTAKES)}>{COMMON_MISTAKES}</h4>
            <ul>
              {ex.errors.map((e, i) => (
                <li key={i} {...readable(e)}>
                  {g(e)}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h4>Easier</h4>
            <p {...readable(more.easier)}>{g(ex.easier)}</p>
          </section>
          {more.harder && (
            <section>
              <h4>Harder</h4>
              <p {...readable(more.harder)}>{g(ex.harder!)}</p>
            </section>
          )}
          {more.skills && (
            <section>
              <h4>Skills it builds</h4>
              <p className="hint" {...readable(more.skills)}>
                {more.skills.replace(/^Skills it builds: /, "")}
              </p>
            </section>
          )}
        </div>
      </details>
    </article>
  );
}
