import Link from "next/link";
import type { Metadata } from "next";
import { EXERCISES, LESSONS, lessonCode } from "@/content";
import { readable } from "@/lib/speech-text";

export const metadata: Metadata = { title: "Listening", description: "Recordings with one specific question each." };

export default function ListeningPage() {
  const tasks = EXERCISES.filter((e) => e.recording);
  return (
    <>
      <div className="wrap page-head">
        <h1>Listening</h1>
        <p>Each recording comes with one question to answer at the keys or out loud. Session details are checked against discographies; no copies of recordings are hosted here.</p>
      </div>
      <div className="wrap" style={{ paddingBottom: 40 }}>
        {tasks.map((e) => {
          const r = e.recording!;
          const used = LESSONS.filter((l) => l.blocks.some((b) => b.exerciseIds?.includes(e.id)));
          const q = encodeURIComponent(`${r.artist.split("(")[0]} ${r.title}`);
          return (
            <article key={e.id} className="liner">
              <div>
                <span className="artist">{r.artist}</span>
                <dl>
                  <dt>Album</dt>
                  <dd>{r.album}</dd>
                  <dt>Recorded</dt>
                  <dd>{r.recorded}</dd>
                  {r.personnel && (
                    <>
                      <dt>With</dt>
                      <dd>{r.personnel}</dd>
                    </>
                  )}
                </dl>
              </div>
              <div>
                <h2 {...readable(r.title)}>{r.title}</h2>
                <p className="prose" style={{ fontSize: "var(--step-2)" }} {...readable(r.question)}>
                  {r.question}
                </p>
                {r.cue && <p className="hint">{r.cue}.</p>}
                <p className="hint">Listen for: {e.listenFor}</p>
                <div className="btn-row">
                  <a className="btn small" href={`https://open.spotify.com/search/${q}`} target="_blank" rel="noreferrer">
                    Find on Spotify
                  </a>
                  <a className="btn small" href={`https://www.youtube.com/results?search_query=${q}`} target="_blank" rel="noreferrer">
                    Find on YouTube
                  </a>
                  {r.sourceUrl && (
                    <a className="btn small ghost" href={r.sourceUrl} target="_blank" rel="noreferrer">
                      Session details
                    </a>
                  )}
                  {used.map((l) => (
                    <Link key={l.id} className="btn small ghost" href={`/lessons/${l.id}#ex-${e.id}`}>
                      In {lessonCode(l)}
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
