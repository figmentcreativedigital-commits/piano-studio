"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LESSONS, PHASES, SKILLS, lessonCode, themeVars } from "@/content";
import { nextStep, plan as makePlan } from "@/lib/planner";
import { daysBetween, prettyDate, prettyTime, weekdayName } from "@/lib/schedule";
import { addMark, recordStore, redoAdjustment, sessionStore, undoAdjustment, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";
import { Sleeve } from "./Sleeve";
import { SleeveStage } from "./SleeveStage";
import { Tracklist } from "./Tracklist";

function endTime(start: string, minutes: number) {
  const [h, m] = start.split(":").map(Number);
  const t = h * 60 + m + minutes;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

export function TodayView() {
  const today = useToday();
  const record = useStore(recordStore);
  const session = useStore(sessionStore).current;
  const p = useMemo(() => makePlan(LESSONS, record, today), [record, today]);
  const [awayUntil, setAwayUntil] = useState("");
  const lesson = p.lesson ?? LESSONS[LESSONS.length - 1];
  const version = p.version;
  const blocks = version === "essential" ? lesson.essential.blocks : lesson.blocks;
  const running = !!session?.running && session.lessonId === lesson.id;
  const sched = p.scheduled;

  let when: string;
  if (p.status === "not-started") when = `First session: ${weekdayName(lesson.date)}, ${prettyDate(lesson.date, { month: "long", day: "numeric" })}, ${prettyTime(lesson.start)} to ${prettyTime(endTime(lesson.start, lesson.minutes))}`;
  else if (p.status === "complete") when = "Every authored lesson is done. The next week arrives after your check-in.";
  else if (sched && sched.id === lesson.id) when = `Today, ${prettyTime(lesson.start)} to ${prettyTime(endTime(lesson.start, lesson.minutes))}`;
  else when = `Today, in your usual slot${sched ? ` (${prettyTime(sched.start)})` : ""}`;

  const week = LESSONS.filter((l) => l.week === lesson.week);
  const phase = PHASES.find((ph) => lesson.week >= ph.weeks[0] && lesson.week <= ph.weeks[1]) ?? PHASES[0];
  const recent = [...record.checkIns].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);

  return (
    <>
      <section className="hero" aria-labelledby="today-title" style={themeVars(lesson.theme)}>
        <div className="hero-field" data-tour="today-record">
          <SleeveStage lesson={lesson} spinning={running} />
        </div>
        <div className="hero-main" data-read-region data-tour="today-main">
          <p className="today-when" data-read>{when}</p>
          <h1 className="today-title" id="today-title" data-read>
            {lesson.title}
          </h1>
          <p className="today-objective" data-read>
            {lesson.objective}
          </p>

          <div className="notices" data-tour="today-notices">
            {record.marks.some((m) => m.kind === "missed" && m.date === today) && p.status !== "done-today" && (
              <div className="notice">
                <h3>Marked as missed</h3>
                <p>Nothing doubles up. Your next session picks up with {lessonCode(lesson)}.</p>
              </div>
            )}
            {p.status === "done-today" && (
              <div className="notice">
                <h3>Today&apos;s session is logged</h3>
                <p>Nothing else is due today. If you want more time at the keys, use free play or tomorrow&apos;s listening task; the plan doesn&apos;t count extra work as homework.</p>
              </div>
            )}
            {p.status === "ahead" && (
              <div className="notice">
                <h3>You&apos;re ahead of the calendar</h3>
                <p>{lessonCode(lesson)} is next in the sequence. Play it today, or use today for review and let the calendar catch up.</p>
              </div>
            )}
            {p.status === "away" && (
              <div className="notice">
                <h3>You&apos;re marked away</h3>
                <p>Nothing is due. When you&apos;re back, the plan starts with a short re-entry check.</p>
              </div>
            )}
            {p.reentry && (
              <div className="notice live">
                <h3>Start with a re-entry check</h3>
                <p>Before {lessonCode(lesson)}, spend ten minutes on the last lesson&apos;s material from memory. It shows what held, so nothing new lands on a shaky base.</p>
              </div>
            )}
            {p.adjustments.map((a) => (
              <div key={a.id} className={`notice${a.kind === "lh-rest" || a.kind === "slide" ? " live" : ""}`}>
                <h3>{a.title}</h3>
                <p>{a.reason}</p>
                <div className="btn-row">
                  <button type="button" className="btn small" onClick={() => undoAdjustment(a.id)}>
                    {a.undoLabel}
                  </button>
                </div>
              </div>
            ))}
            {record.undone.length > 0 && (
              <details>
                <summary className="hint">Reversed plan changes ({record.undone.length})</summary>
                <ul>
                  {record.undone.map((id) => (
                    <li key={id}>
                      {id.split(":")[0]} {id.split(":").slice(1).join(" ")}{" "}
                      <button type="button" className="btn small ghost" onClick={() => redoAdjustment(id)}>
                        Restore
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>

          <div className="btn-row" style={{ marginBottom: 14 }} data-tour="today-actions">
            <Link className="btn primary" href={`/session/${lesson.id}${version === "essential" ? "?v=essential" : ""}`}>
              {running ? "Resume session" : version === "essential" ? `Start the ${lesson.essential.minutes}-minute version` : "Start session"}
            </Link>
            {version === "full" && (
              <Link className="btn" href={`/session/${lesson.id}?v=essential`}>
                {lesson.essential.minutes}-minute version
              </Link>
            )}
            <Link className="btn ghost" href={`/lessons/${lesson.id}`}>
              Read the lesson
            </Link>
            <Link className="btn ghost" href={`/check-in?lesson=${lesson.id}`}>
              Check in
            </Link>
          </div>

          {p.status !== "not-started" && p.status !== "complete" && (
            <details className="hint" style={{ marginBottom: 0 }} data-tour="today-cant">
              <summary>Can&apos;t practice as planned today?</summary>
              <div className="btn-row" style={{ marginTop: 10 }}>
                <button type="button" className="btn small" onClick={() => addMark({ kind: "short", date: today, minutes: 20 })}>
                  Only 20 minutes today
                </button>
                <button type="button" className="btn small" onClick={() => addMark({ kind: "missed", date: today })}>
                  Missed today
                </button>
                <label className="hint" htmlFor="away-until">
                  Away until
                </label>
                <input id="away-until" className="input" style={{ width: "auto" }} type="date" value={awayUntil} min={today} onChange={(e) => setAwayUntil(e.target.value)} />
                <button type="button" className="btn small" disabled={!awayUntil} onClick={() => addMark({ kind: "away", date: today, until: awayUntil })}>
                  Mark away
                </button>
              </div>
              <p style={{ margin: "10px 0 0" }}>Missed days don&apos;t pile up. The sequence resumes where you left off, and the weekly review absorbs the slack.</p>
            </details>
          )}

        </div>
      </section>

      <div className="wrap">
      <section className="section" aria-labelledby="agenda-h" data-tour="today-agenda" data-read-region>
        <div className="section-head">
          <h2 id="agenda-h" data-read>
            {version === "essential" ? `The ${lesson.essential.minutes}-minute version` : "The session"}
          </h2>
          <span className="muted">
            {blocks.reduce((t, b) => t + b.minutes, 0)} minutes, breaks included
          </span>
        </div>
        <Tracklist blocks={blocks} linkBase={`/lessons/${lesson.id}`} current={running ? session!.block : -1} />
      </section>

      <section className="section" aria-labelledby="week-h" data-tour="today-week">
        <div className="section-head">
          <h2 id="week-h">Week {lesson.week}</h2>
          <span className="muted">
            {phase.name}, weeks {phase.weeks[0]}–{phase.weeks[1]}
          </span>
        </div>
        <div className="week-strip">
          {week.map((l) => {
            const done = p.completed.has(l.id);
            const isPast = daysBetween(l.date, today) > 0;
            const isNow = l.id === lesson.id;
            return (
              <Link key={l.id} href={`/lessons/${l.id}`} className={`day-cell${done ? " is-done" : ""}${isPast ? " is-past" : ""}`}>
                <div className="sleeve-stage">
                  <Sleeve lesson={l} mini done={done} />
                </div>
                <span className="meta">
                  <b>
                    <span className={`status-dot${done ? " done" : isNow ? " now" : ""}`} aria-hidden="true" />
                    {prettyDate(l.date)}
                  </b>
                  {l.title}
                  <span className="sr-only">{done ? " (done)" : isNow ? " (next)" : ""}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section grid-3" aria-label="Review, milestone and recent check-ins">
        <div className="panel">
          <h3>Due for review</h3>
          {p.due.length ? (
            <ul>
              {p.due.slice(0, 6).map((s) => (
                <li key={s.skill}>
                  <strong>{SKILLS[s.skill]?.name ?? s.skill}</strong>
                  <br />
                  <span className="hint">{nextStep(s).detail}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">Nothing yet. Skills you mark steady in a check-in come back here on a spaced schedule.</p>
          )}
        </div>
        <div className="panel">
          <h3>Next milestone: {phase.milestone.title}</h3>
          <ul>
            {phase.milestone.checks.map((c, i) => (
              <li key={i} style={{ fontFamily: "var(--serif)" }}>
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h3>Recent check-ins</h3>
          {recent.length ? (
            <ul>
              {recent.map((c) => (
                <li key={c.id}>
                  <strong>
                    {c.lessonId.slice(0, 3)} {c.lessonId.slice(3)}
                  </strong>{" "}
                  {prettyDate(c.date)}, {c.minutes} min
                  {c.difficulty ? <span className="hint">. {c.difficulty}</span> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">Check in after each session. It takes under a minute and drives what comes next.</p>
          )}
          <p style={{ margin: "12px 0 0" }}>
            <Link href="/progress">Progress and backups</Link>
          </p>
        </div>
      </section>
      </div>
    </>
  );
}
