import Link from "next/link";
import type { Metadata } from "next";
import { LESSONS, PHASES } from "@/content";
import { Sleeve } from "@/components/Sleeve";
import { prettyDate, prettyTime } from "@/lib/schedule";

export const metadata: Metadata = { title: "Lessons", description: "Every lesson so far, in order." };

export default function LessonsPage() {
  const weeks = [...new Set(LESSONS.map((l) => l.week))];
  return (
    <>
      <div className="wrap page-head">
        <h1>Lessons</h1>
        <p>Every lesson is written out in full. It shows what to play, which fingers to use, and how fast. It also says what to listen for and how you&apos;ll know you&apos;re done. New weeks are added after each weekly check.</p>
      </div>
      <div className="wrap">
        {weeks.map((w) => {
          const phase = PHASES.find((p) => w >= p.weeks[0] && w <= p.weeks[1]);
          return (
            <section key={w} className="section" aria-labelledby={`w${w}`}>
              <div className="section-head">
                <h2 id={`w${w}`}>Week {w}</h2>
                {phase && <span className="muted">{phase.name}</span>}
              </div>
              <div className="week-strip" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 230px), 1fr))" }}>
                {LESSONS.filter((l) => l.week === w).map((l) => (
                  <Link key={l.id} href={`/lessons/${l.id}`} className="day-cell">
                    <div className="sleeve-stage">
                      <Sleeve lesson={l} />
                    </div>
                    <span className="meta">
                      <b>{prettyDate(l.date, { weekday: "long", month: "short", day: "numeric" })}</b>
                      {prettyTime(l.start)}, {l.minutes} minutes
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
