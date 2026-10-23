import Link from "next/link";
import type { Metadata } from "next";
import { PHASES, VEHICLES, themeVars } from "@/content";
import { TuneChart } from "@/components/TuneChart";
import { ReadButton } from "@/components/ReadAloud";
import { TUNES_INTRO, TUNES_TITLE } from "@/lib/narration";
import { readable } from "@/lib/speech-text";

export const metadata: Metadata = {
  title: "The three tunes",
  description: "Rhythm changes, the blues in major and minor, and \"Indiana\" with \"Donna Lee\": the tunes every technique in Woodshed is applied to.",
};

const phaseName = (id: string) => {
  const p = PHASES.find((x) => x.id === id);
  return p ? `Weeks ${p.weeks[0]}–${p.weeks[1]}, ${p.name}` : id;
};

const search = (q: string) => encodeURIComponent(q);

export default function TunesPage() {
  return (
    <>
      <div className="wrap page-head flush" data-tour="tunes-intro" data-read-region>
        <h1 {...readable(TUNES_TITLE)}>{TUNES_TITLE}</h1>
        <p {...readable(TUNES_INTRO)}>{TUNES_INTRO}</p>
        <nav className="tune-jump" aria-label="Tunes on this page">
          {VEHICLES.map((v) => (
            <a key={v.id} href={`#${v.id}`}>
              {v.name.replace(/"/g, "")}
            </a>
          ))}
        </nav>
      </div>

      {VEHICLES.map((v) => (
        <section key={v.id} id={v.id} className="tune" aria-labelledby={`${v.id}-h`} style={themeVars(v.theme)}>
          <header className="tune-head" data-read-region>
            <div className="wrap tune-head-in">
              <div>
                <p className="tune-kicker" {...readable(v.tune)}>
                  {v.tune}
                </p>
                <h2 className="tune-name" id={`${v.id}-h`} {...readable(v.name)}>
                  {v.name}
                </h2>
              </div>
              <div>
                <dl className="tune-facts">
                  <dt>Key</dt>
                  <dd>
                    {v.key}
                    {v.alt ? `, then ${v.alt.key}` : ""}
                  </dd>
                  <dt>Form</dt>
                  <dd>{v.form}</dd>
                </dl>
                <p className="tune-summary" {...readable(v.summary)}>
                  {v.summary}
                </p>
                <ReadButton label="Read about this tune" what={`tune-${v.id}`} />
              </div>
            </div>
          </header>

          <div className="wrap tune-body">
            <div data-tour={v.id === VEHICLES[0].id ? "tune-chart" : undefined}>
              <TuneChart v={v} />
              <p className="hint tune-source">
                {v.source.note}
                {v.source.url ? (
                  <>
                    {" "}
                    <a href={v.source.url} target="_blank" rel="noreferrer">
                      Source
                    </a>
                  </>
                ) : null}
              </p>
            </div>
            <div className="tune-side">
              <h3>Across the twelve weeks</h3>
              <ol className="tune-uses">
                {v.uses.map((u) => (
                  <li key={u.phase}>
                    <b>{phaseName(u.phase)}</b>
                    <span>{u.text}</span>
                  </li>
                ))}
              </ol>
              <h3>On record</h3>
              <ul className="tune-records">
                {v.recordings.map((r) => (
                  <li key={r.title + r.artist}>
                    <b>
                      {r.artist}, &ldquo;{r.title}&rdquo;
                    </b>
                    <span className="muted">{r.recorded}. {r.detail}</span>
                    <span>{r.note}</span>
                    <span className="btn-row">
                      <a className="btn small" href={`https://open.spotify.com/search/${search(`${r.artist.split(",")[0]} ${r.title}`)}`} target="_blank" rel="noreferrer">
                        Find on Spotify
                      </a>
                      <a className="btn small" href={`https://www.youtube.com/results?search_query=${search(`${r.artist.split(",")[0]} ${r.title}`)}`} target="_blank" rel="noreferrer">
                        Find on YouTube
                      </a>
                      {r.sourceUrl && (
                        <a className="btn small ghost" href={r.sourceUrl} target="_blank" rel="noreferrer">
                          Session details
                        </a>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <h3>Same changes</h3>
              <p className="tune-family">{v.family.join("; ")}.</p>
            </div>
          </div>
        </section>
      ))}

      <div className="wrap" style={{ paddingBottom: 24 }}>
        <p className="hint">
          Chord progressions aren&apos;t copyrighted; melodies of protected tunes are never printed here. Heads are learned by ear from the records. See <Link href="/roadmap">the roadmap</Link> for when each tune comes in.
        </p>
      </div>
    </>
  );
}
