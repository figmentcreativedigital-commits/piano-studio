"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BLOCK_LABEL, LESSONS, getExercise, getLesson, lessonCode, lessonLabel } from "@/content";
import type { Block } from "@/content/types";
import { chime, keepAwake } from "@/lib/audio";
import { plan as makePlan } from "@/lib/planner";
import { recordStore, sessionStore, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";
import { ExerciseCard } from "./ExerciseCard";
import { SleeveStage } from "./SleeveStage";
import { Tracklist } from "./Tracklist";

function fmt(sec: number) {
  const s = Math.abs(Math.round(sec));
  return `${sec < 0 ? "+" : ""}${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function SessionRunner({ id }: { id: string }) {
  const lesson = getLesson(id)!;
  const params = useSearchParams();
  const router = useRouter();
  const version = params.get("v") === "essential" ? "essential" : "full";
  const today = useToday();
  const record = useStore(recordStore);
  const p = useMemo(() => makePlan(LESSONS, record, today), [record, today]);
  const saved = useStore(sessionStore).current;

  const blocks: Block[] = useMemo(() => {
    const base = version === "essential" ? lesson.essential.blocks : lesson.blocks;
    if (!p.reentry || version === "essential" || p.lesson?.id !== lesson.id) return base;
    // Re-entry: the first teaching block gives up ten minutes to retrieval of the last lesson's focus.
    const last = p.lastCheckIn ? getLesson(p.lastCheckIn.lessonId) : undefined;
    const re: Block = {
      id: "reentry",
      kind: "review",
      title: "Re-entry check",
      minutes: 10,
      text: ["From memory, no warm-up: play each item from your last session once and note what held.", ...(last ? [`Last session: ${lessonLabel(last)}.`] : [])],
      exerciseIds: last ? [...new Set(last.blocks.flatMap((b) => b.exerciseIds ?? []))].filter((x) => getExercise(x)?.kind !== "listening").slice(0, 3) : [],
    };
    const idx = base.findIndex((b) => !["checkin", "setup", "break", "retrieval"].includes(b.kind) && b.minutes > 10);
    return base.flatMap((b, i) => (i === idx ? [re, { ...b, minutes: b.minutes - 10 }] : [b]));
  }, [lesson, version, p.reentry, p.lesson, p.lastCheckIn]);

  const resume = saved && saved.lessonId === lesson.id && saved.version === version && saved.date === today ? saved : null;
  const [idx, setIdx] = useState(resume?.block ?? 0);
  const [remaining, setRemaining] = useState(resume?.remaining ?? blocks[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const endsAt = useRef<number | null>(null);
  const chimed = useRef(false);
  const block = blocks[Math.min(idx, blocks.length - 1)];

  // Persist progress so a reload or a phone call doesn't lose the place.
  useEffect(() => {
    sessionStore.set({ current: { lessonId: lesson.id, version, date: today, block: idx, remaining: Math.round(remaining), running } });
  }, [lesson.id, version, today, idx, running, Math.round(remaining / 5)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!running) return;
    endsAt.current = Date.now() + remaining * 1000;
    void keepAwake(true);
    const t = setInterval(() => {
      const r = ((endsAt.current ?? Date.now()) - Date.now()) / 1000;
      setRemaining(r);
      if (r <= 0 && !chimed.current) {
        chimed.current = true;
        chime();
      }
    }, 250);
    return () => clearInterval(t);
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (i: number) => {
    const n = Math.max(0, Math.min(blocks.length - 1, i));
    setIdx(n);
    setRemaining(blocks[n].minutes * 60);
    chimed.current = false;
    if (running) endsAt.current = Date.now() + blocks[n].minutes * 60 * 1000;
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const finish = () => {
    setRunning(false);
    sessionStore.set({ current: null });
    void keepAwake(false);
    router.push(`/check-in?lesson=${lesson.id}&v=${version}&done=1`);
  };

  const exercises = (block.exerciseIds ?? []).map((x) => getExercise(x)).filter((e): e is NonNullable<typeof e> => !!e);
  const isLast = idx >= blocks.length - 1;
  const total = blocks.reduce((s, b) => s + b.minutes, 0);

  return (
    <div className="wrap session">
      <aside className="lesson-aside" aria-label="Session">
        <div style={{ maxWidth: 260, marginBottom: 18 }}>
          <SleeveStage lesson={lesson} spinning={running} slide={false} />
        </div>
        <p className="lesson-id">
          {lessonLabel(lesson)}
          {version === "essential" ? ` (${lesson.essential.minutes}-minute version)` : ""}
        </p>
        <Tracklist blocks={blocks} current={idx} />
        <p className="hint">
          {total} minutes, breaks included. <Link href={`/lessons/${lesson.id}`}>Full lesson</Link>
        </p>
      </aside>

      <div className="now-block">
        <span className="now-kind">
          {BLOCK_LABEL[block.kind]}, block {idx + 1} of {blocks.length}
          {block.side ? `, side ${block.side}` : ""}
        </span>
        <h1 className="now-title">{block.title}</h1>
        <div className={`timer${running ? " running" : ""}${remaining <= 0 ? " overtime" : ""}`} role="timer" aria-live="off">
          <span className="timer-read">{fmt(remaining)}</span>
          <div className="btn-row">
            <button type="button" className="btn primary" onClick={() => setRunning((r) => !r)} aria-pressed={running}>
              {running ? "Pause" : remaining < block.minutes * 60 ? "Resume" : "Start timer"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setRemaining((r) => r + 60);
                if (endsAt.current) endsAt.current += 60000;
                chimed.current = false;
              }}
            >
              +1 min
            </button>
            {!isLast ? (
              <button type="button" className={`btn${remaining <= 0 ? " primary" : ""}`} onClick={() => go(idx + 1)}>
                Next: {blocks[idx + 1].title}
              </button>
            ) : (
              <button type="button" className={`btn${remaining <= 0 ? " primary" : ""}`} onClick={finish}>
                Finish and check in
              </button>
            )}
            {idx > 0 && (
              <button type="button" className="btn ghost" onClick={() => go(idx - 1)}>
                Back
              </button>
            )}
          </div>
        </div>
        {remaining <= 0 && <p className="hint" style={{ margin: 0 }}>Time&apos;s up for this block. Finish the rep you&apos;re on, then move on.</p>}
        <ul className="now-text">
          {block.text.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
        {p.lhRest && <p className="care">Left hand rests today. Left-hand parts switch to right-hand-only versions.</p>}
        {exercises.map((e) => (
          <ExerciseCard key={e.id} ex={e} lhRest={p.lhRest} simplify={e.skills.some((s) => p.simplify.includes(s))} />
        ))}
        {block.kind === "break" && <p className="prose muted">Off the bench. Shake out both hands; look at something far away.</p>}
        <p className="hint" style={{ marginTop: 20 }}>
          Session for {lessonCode(lesson)}. Your place is saved on this device.
        </p>
      </div>
    </div>
  );
}
