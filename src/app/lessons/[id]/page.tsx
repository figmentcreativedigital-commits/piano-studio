import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BLOCK_LABEL, LESSONS, getExercise, getLesson, lessonLabel } from "@/content";
import { ExerciseCard } from "@/components/ExerciseCard";
import { Sleeve } from "@/components/Sleeve";
import { Tracklist } from "@/components/Tracklist";
import { prettyDate, prettyTime } from "@/lib/schedule";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const l = getLesson(id);
  return l ? { title: lessonLabel(l), description: l.objective } : {};
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) notFound();
  const seen = new Set<string>();
  const idx = LESSONS.findIndex((l) => l.id === lesson.id);
  const prev = LESSONS[idx - 1];
  const next = LESSONS[idx + 1];

  return (
    <div className="wrap">
      <section className="lesson-top">
        <div className="sleeve-stage">
          <Sleeve lesson={lesson} />
        </div>
        <div>
          <p className="lesson-id">{lessonLabel(lesson)}</p>
          <h1 className="lesson-h1">{lesson.title}</h1>
          <p className="today-objective">{lesson.objective}</p>
          <div className="btn-row">
            <Link className="btn primary" href={`/session/${lesson.id}`}>
              Start session
            </Link>
            <Link className="btn" href={`/session/${lesson.id}?v=essential`}>
              {lesson.essential.minutes}-minute version
            </Link>
            <Link className="btn ghost" href={`/check-in?lesson=${lesson.id}`}>
              Check in
            </Link>
          </div>
          <dl className="facts">
            <dt>When</dt>
            <dd>
              {prettyDate(lesson.date, { weekday: "long", month: "long", day: "numeric" })}, {prettyTime(lesson.start)}, {lesson.minutes} minutes
            </dd>
            <dt>Builds on</dt>
            <dd>{lesson.prerequisites.join("; ")}</dd>
            <dt>Time balance</dt>
            <dd>{lesson.balance}</dd>
            <dt>Application</dt>
            <dd>{lesson.application}</dd>
            <dt>Last task</dt>
            <dd>{lesson.retrieval}</dd>
          </dl>
        </div>
      </section>

      <div className="lesson-body">
        <aside className="lesson-aside" aria-label="Agenda">
          <Tracklist blocks={lesson.blocks} linkBase={`/lessons/${lesson.id}`} />
          <nav className="btn-row" aria-label="Other sessions" style={{ marginTop: 14 }}>
            {prev && (
              <Link className="btn small ghost" href={`/lessons/${prev.id}`}>
                Previous session
              </Link>
            )}
            {next && (
              <Link className="btn small ghost" href={`/lessons/${next.id}`}>
                Next session
              </Link>
            )}
          </nav>
        </aside>
        <div>
          {lesson.blocks.map((b) => {
            const fresh = (b.exerciseIds ?? []).filter((x) => !seen.has(x));
            const repeat = (b.exerciseIds ?? []).filter((x) => seen.has(x));
            fresh.forEach((x) => seen.add(x));
            return (
              <section key={b.id} id={`b-${b.id}`} className="block-section" aria-labelledby={`h-${b.id}`}>
                <header>
                  <h2 id={`h-${b.id}`}>{b.title}</h2>
                  <span className="kind">
                    {BLOCK_LABEL[b.kind]}, {b.minutes} min{b.side ? `, side ${b.side}` : ""}
                  </span>
                </header>
                <ul>
                  {b.text.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                  {repeat.map((x) => (
                    <li key={x}>
                      <a href={`#ex-${x}`}>{getExercise(x)?.title}</a> (shown earlier in this lesson)
                    </li>
                  ))}
                </ul>
                {fresh.map((x) => {
                  const e = getExercise(x);
                  return e ? <ExerciseCard key={x} ex={e} /> : null;
                })}
              </section>
            );
          })}

          <section className="block-section" id="essential" aria-labelledby="h-essential">
            <header>
              <h2 id="h-essential">The {lesson.essential.minutes}-minute version</h2>
              <span className="kind">For a busy day. It replaces the session; nothing carries over as homework.</span>
            </header>
            <Tracklist blocks={lesson.essential.blocks} />
            <ul>
              {lesson.essential.blocks.map((b) => (
                <li key={b.id}>
                  <strong>{b.title}</strong> ({b.minutes} min): {b.text.join(" ")}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
