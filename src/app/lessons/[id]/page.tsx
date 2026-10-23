import { glosser } from "@/components/glosser";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BLOCK_LABEL, LESSONS, getExercise, getLesson, getVehicle, lessonCode, lessonLabel, themeVars } from "@/content";
import type { Block, Lesson } from "@/content/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExerciseCard } from "@/components/ExerciseCard";
import { OnThisPage, type TocItem } from "@/components/OnThisPage";
import { Sleeve } from "@/components/Sleeve";
import { Tracklist } from "@/components/Tracklist";
import { ReadButton } from "@/components/ReadAloud";
import { lessonIdLine } from "@/lib/narration";
import { readable } from "@/lib/speech-text";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const l = getLesson(id);
  return l ? { title: lessonLabel(l), description: l.objective } : {};
}

/** The lesson's blocks in their sides (A, then B), or one group for a single-sided session. */
function sides(blocks: Block[]): { side?: "A" | "B"; id: string; blocks: Block[]; minutes: number }[] {
  const out: { side?: "A" | "B"; id: string; blocks: Block[]; minutes: number }[] = [];
  for (const b of blocks) {
    const g = out[out.length - 1];
    if (g && g.side === b.side) {
      g.blocks.push(b);
      g.minutes += b.minutes;
    } else out.push({ side: b.side, id: b.side ? `side-${b.side.toLowerCase()}` : "session-plan", blocks: [b], minutes: b.minutes });
  }
  return out;
}

function PagerLink({ l, dir }: { l?: Lesson; dir: "prev" | "next" }) {
  if (!l)
    return (
      <Link className={`pager-link ${dir} is-all`} href="/lessons">
        <span className="pager-dir">{dir === "prev" ? "Start of the plan" : "Last lesson so far"}</span>
        <span className="pager-title">All lessons</span>
      </Link>
    );
  return (
    <Link className={`pager-link ${dir}`} href={`/lessons/${l.id}`} rel={dir}>
      <span className="pager-dir">
        {dir === "prev" ? "Previous lesson" : "Next lesson"}, {lessonCode(l)}
      </span>
      <span className="pager-title">{l.title}</span>
    </Link>
  );
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) notFound();
  const seen = new Set<string>();
  const idx = LESSONS.findIndex((l) => l.id === lesson.id);
  const prev = LESSONS[idx - 1];
  const next = LESSONS[idx + 1];

  const gHero = glosser();
  const gBody = glosser();
  const groups = sides(lesson.blocks);
  const short = `${lesson.essential.minutes} min`;
  const toc: TocItem[] = [
    { id: "overview", label: "Overview" },
    ...groups.map((g) => ({ id: g.id, label: g.side ? `Side ${g.side}` : "The session" })),
    { id: "essential", label: `The ${lesson.essential.minutes}-minute version`, short },
  ];
  return (
    <>
      <section className="hero lesson-hero" id="overview" aria-labelledby="lesson-h1" style={themeVars(lesson.theme)}>
        <div className="hero-field">
          <div className="sleeve-stage">
            <Sleeve lesson={lesson} />
          </div>
        </div>
        <div className="hero-main" data-tour="lesson-main" data-read-region>
          <Breadcrumbs
            tour="breadcrumbs"
            items={[{ label: "Lessons", href: "/lessons" }, { label: `Week ${lesson.week}`, href: `/lessons#w${lesson.week}` }, { label: lessonCode(lesson) }]}
          />
          <p className="lesson-id" {...readable(lessonIdLine(lesson))}>
            {lessonIdLine(lesson)}
          </p>
          <h1 className="lesson-h1" id="lesson-h1" {...readable(lesson.title)}>
            {lesson.title}
          </h1>
          <p className="today-objective" {...readable(lesson.objective)}>
            {gHero(lesson.objective)}
          </p>
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
            <ReadButton label="Read the overview" what={`lesson-${lesson.id}`} />
          </div>
          <dl className="facts">
            <dt>How long</dt>
            <dd>{lesson.minutes} minutes, breaks included</dd>
            <dt>What you need first</dt>
            <dd>{lesson.prerequisites.join(" · ")}</dd>
            <dt>How the time is split</dt>
            <dd {...readable(`How the time is split: ${lesson.balance}`)}>
              {lesson.balance}
            </dd>
            <dt>Try it in music</dt>
            <dd {...readable(`Try it in music: ${lesson.application}`)}>
              {gHero(lesson.application)}
            </dd>
            <dt>Tunes</dt>
            <dd data-tour="lesson-tunes">
              {lesson.applies.length ? (
                lesson.applies.map((v, i) => (
                  <span key={v}>
                    {i > 0 ? ", " : ""}
                    <Link href={`/tunes#${v}`}>{getVehicle(v).name.replace(/"/g, "")}</Link>
                  </span>
                ))
              ) : (
                <span>Baseline day. The tunes start tomorrow.</span>
              )}
            </dd>
            <dt>Last thing</dt>
            <dd>{lesson.retrieval}</dd>
          </dl>
        </div>
      </section>

      <div className="wrap">
        <OnThisPage items={toc} tour="lesson-toc" />
        <div className="lesson-body">
          <aside className="lesson-aside" aria-label="Session plan">
            <Tracklist blocks={lesson.blocks} linkBase={`/lessons/${lesson.id}`} />
          </aside>
          <div>
            {groups.map((g) => (
              <div key={g.id} id={g.id} className="side-group">
                {g.side && (
                  <p className="side-mark">
                    <span>Side {g.side}</span>
                    <small>{g.minutes} minutes</small>
                  </p>
                )}
                {g.blocks.map((b) => {
                  const fresh = (b.exerciseIds ?? []).filter((x) => !seen.has(x));
                  const repeat = (b.exerciseIds ?? []).filter((x) => seen.has(x));
                  fresh.forEach((x) => seen.add(x));
                  return (
                    <section key={b.id} id={`b-${b.id}`} className="block-section" aria-labelledby={`h-${b.id}`}>
                      <header>
                        <h2 id={`h-${b.id}`} {...readable(b.title)}>
                          {b.title}
                        </h2>
                        <span className="kind">
                          {BLOCK_LABEL[b.kind]}, {b.minutes} min{b.side ? `, side ${b.side}` : ""}
                        </span>
                      </header>
                      <ul>
                        {b.text.map((t, i) => (
                          <li key={i} {...readable(t)}>
                            {gBody(t)}
                          </li>
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
              </div>
            ))}

            <section className="block-section essential" id="essential" aria-labelledby="h-essential">
              <header>
                <h2 id="h-essential">The {lesson.essential.minutes}-minute version</h2>
                <span className="kind">For a busy day. It replaces the full session, and nothing carries over as homework.</span>
              </header>
              <Tracklist blocks={lesson.essential.blocks} />
              <ul>
                {lesson.essential.blocks.map((b) => (
                  <li key={b.id}>
                    <strong>{b.title}</strong> ({b.minutes} min): {b.text.join(" ")}
                  </li>
                ))}
              </ul>
              <div className="btn-row">
                <Link className="btn primary" href={`/session/${lesson.id}?v=essential`}>
                  Start the {lesson.essential.minutes}-minute version
                </Link>
              </div>
            </section>
          </div>
        </div>

        <nav className="pager" aria-label="Lessons before and after" data-tour="lesson-pager">
          <PagerLink l={prev} dir="prev" />
          <PagerLink l={next} dir="next" />
        </nav>
      </div>
    </>
  );
}
