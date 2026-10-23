"use client";

import { glosser } from "./glosser";
import Link from "next/link";
import { useMemo, useState } from "react";
import { LESSONS, PHASES, SKILLS, lessonCode, themeVars } from "@/content";
import { nextStep, plan as makePlan } from "@/lib/planner";
import { daysBetween, prettyDate } from "@/lib/schedule";
import { addMark, recordStore, redoAdjustment, sessionStore, undoAdjustment, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";
import { agendaHeading, whenLine } from "@/lib/narration";
import { readable } from "@/lib/speech-text";
import { Sleeve } from "./Sleeve";
import { SleeveStage } from "./SleeveStage";
import { Tracklist } from "./Tracklist";


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

  const when = whenLine(lesson, p.status, sched ?? undefined);

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
          <p className="today-when" {...readable(when)}>
            {when}
          </p>
          <h1 className="today-title" id="today-title" {...readable(lesson.title)}>
            {lesson.title}
          </h1>
          <p className="today-objective" {...readable(lesson.objective)}>
            {glosser()(lesson.objective)}
          </p>

          <div className="notices" data-tour="today-notices">
            {record.marks.some((m) => m.kind === "missed" && m.date === today) && p.status !== "done-today" && (
              <div className="notice">
                <h3>You marked today as missed</h3>
                <p>Nothing piles up. Your next session starts with {lessonCode(lesson)}.</p>
              </div>
            )}
            {p.status === "done-today" && (
              <div className="notice">
                <h3>You checked in for today</h3>
                <p>Nothing else is due today. Want more time at the piano? Try free play or tomorrow&apos;s listening task. The plan doesn&apos;t count extra practice as homework.</p>
              </div>
            )}
            {p.status === "ahead" && (
              <div className="notice">
                <h3>You&apos;re ahead of the calendar</h3>
                <p>{lessonCode(lesson)} is next in order. Play it today, or review today and let the calendar catch up.</p>
              </div>
            )}
            {p.status === "away" && (
              <div className="notice">
                <h3>You&apos;re marked as away</h3>
                <p>Nothing is due. When you come back, you start with a short re-entry check.</p>
              </div>
            )}
            {p.reentry && (
              <div className="notice live">
                <h3>Start with a re-entry check</h3>
                <p>Before {lessonCode(lesson)}, play the last lesson from memory for 10 minutes. This shows what stuck, so new work doesn&apos;t sit on a shaky base.</p>
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
                <summary className="hint">Plan changes you undid ({record.undone.length})</summary>
                <ul>
                  {record.undone.map((id) => (
                    <li key={id}>
                      {id.split(":")[0]} {id.split(":").slice(1).join(" ")}{" "}
                      <button type="button" className="btn small ghost" onClick={() => redoAdjustment(id)}>
                        Put it back
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>

          <div className="btn-row" style={{ marginBottom: 14 }} data-tour="today-actions">
            <Link className="btn primary" href={`/session/${lesson.id}${version === "essential" ? "?v=essential" : ""}`}>
              {running ? "Continue session" : version === "essential" ? `Start the ${lesson.essential.minutes}-minute version` : "Start session"}
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
                  I missed today
                </button>
                <label className="hint" htmlFor="away-until">
                  Away until
                </label>
                <input id="away-until" className="input" style={{ width: "auto" }} type="date" value={awayUntil} min={today} onChange={(e) => setAwayUntil(e.target.value)} />
                <button type="button" className="btn small" disabled={!awayUntil} onClick={() => addMark({ kind: "away", date: today, until: awayUntil })}>
                  Mark me away
                </button>
              </div>
              <p style={{ margin: "10px 0 0" }}>Missed days don&apos;t pile up. You pick up where you left off, and the weekly review catches up.</p>
            </details>
          )}

        </div>
      </section>

      <div className="wrap">
      <section className="section" aria-labelledby="agenda-h" data-tour="today-agenda" data-read-region>
        <div className="section-head">
          <h2 id="agenda-h" {...readable(agendaHeading(version === "essential" ? lesson.essential.minutes : undefined))}>
            {agendaHeading(version === "essential" ? lesson.essential.minutes : undefined)}
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
          <h3>Time to review</h3>
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
            <p className="empty">Nothing yet. When you mark a skill steady in a check-in, it comes back here a few days later.</p>
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
            <p className="empty">Check in after each session. It takes less than a minute and shapes what comes next.</p>
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
