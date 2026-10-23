"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { LESSONS, SKILLS, getExercise, getLesson, lessonCode, lessonLabel } from "@/content";
import { plan as makePlan, type CheckIn, type Comfort, type Outcome } from "@/lib/planner";
import { addCheckIn, recordStore, repStore, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";

const OUTCOMES: { v: Outcome; label: string }[] = [
  { v: "steady", label: "Steady" },
  { v: "close", label: "Close" },
  { v: "notyet", label: "Not yet" },
  { v: "skipped", label: "Skipped" },
];
const COMFORT: { v: Comfort; label: string }[] = [
  { v: "fine", label: "Fine" },
  { v: "tense", label: "Some tension" },
  { v: "lh-ache", label: "Left hand ached" },
  { v: "pain", label: "Pain, I stopped" },
];
const MINUTES = [15, 20, 30, 45, 60, 90, 120];

export function checkInText(c: CheckIn): string {
  const l = getLesson(c.lessonId);
  const outcomes = Object.entries(c.outcomes)
    .map(([k, v]) => `${SKILLS[k]?.name ?? k}: ${OUTCOMES.find((o) => o.v === v)?.label}`)
    .join("; ");
  return [
    `Check-in ${c.date}: ${l ? lessonLabel(l) : c.lessonId} (${c.version}), ${c.minutes} min.`,
    outcomes && `Outcomes: ${outcomes}.`,
    c.tempo ? `Comfortable tempo: ♩ = ${c.tempo}.` : "",
    c.difficulty ? `Main difficulty: ${c.difficulty}.` : "",
    `Comfort: ${COMFORT.find((x) => x.v === c.comfort)?.label}.`,
    c.recorded ? "Recorded a clip." : "",
    c.note ? `Note: ${c.note}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function CheckInForm() {
  const params = useSearchParams();
  const today = useToday();
  const record = useStore(recordStore);
  const reps = useStore(repStore).days[today] ?? {};
  const p = useMemo(() => makePlan(LESSONS, record, today), [record, today]);
  const initial = params.get("lesson") ?? p.lesson?.id ?? LESSONS[0].id;
  const [lessonId, setLessonId] = useState(initial);
  const lesson = getLesson(lessonId) ?? LESSONS[0];
  const [version, setVersion] = useState<CheckIn["version"]>(params.get("v") === "essential" ? "essential" : "full");
  const [minutes, setMinutes] = useState<number>(params.get("v") === "essential" ? lesson.essential.minutes : lesson.minutes);
  const [outcomes, setOutcomes] = useState<Record<string, Outcome>>(() => {
    // Suggest "steady" where today's rep log shows three clean in a row.
    const o: Record<string, Outcome> = {};
    for (const b of lesson.blocks)
      for (const id of b.exerciseIds ?? []) {
        const r = reps[id];
        const e = getExercise(id);
        if (r && e) for (const s of e.skills) if (lesson.focus.includes(s)) o[s] = r.best >= 3 ? "steady" : r.clean > 0 ? "close" : o[s] ?? "notyet";
      }
    return o;
  });
  const [tempo, setTempo] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [comfort, setComfort] = useState<Comfort>("fine");
  const [recorded, setRecorded] = useState(false);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState<CheckIn | null>(null);
  const [copied, setCopied] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = addCheckIn({
      date: today,
      lessonId,
      version,
      minutes,
      outcomes: Object.fromEntries(Object.entries(outcomes).filter(([k]) => lesson.focus.includes(k))),
      tempo: tempo ? Number(tempo) : undefined,
      difficulty: difficulty.trim() || undefined,
      comfort,
      recorded,
      note: note.trim() || undefined,
    });
    setSaved(c);
    window.scrollTo({ top: 0 });
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied("Copied. Paste it into our conversation.");
    } catch {
      setCopied("Couldn't copy automatically; select the text above and copy it.");
    }
  };

  if (saved) {
    const next = makePlan(LESSONS, recordStore.get(), today);
    const text = checkInText(saved);
    return (
      <div className="form" data-tour="checkin-copy">
        <div className="notice live">
          <h3>Logged</h3>
          <p>
            {next.lesson ? `Next up: ${lessonLabel(next.lesson)}.` : "That's every authored lesson."} {next.adjustments.length ? `The plan made ${next.adjustments.length} change${next.adjustments.length > 1 ? "s" : ""}; see Today for why.` : "No plan changes needed."}
          </p>
        </div>
        <div className="field">
          <label htmlFor="ci-text">For our conversation</label>
          <textarea id="ci-text" className="input" readOnly value={text} rows={4} />
          <div className="btn-row">
            <button type="button" className="btn primary" onClick={() => copy(text)}>
              Copy check-in
            </button>
            <Link className="btn" href="/">
              Back to Today
            </Link>
          </div>
          <span className="hint" aria-live="polite">
            {copied}
          </span>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} data-tour="checkin-form">
      {params.get("done") && (
        <div className="notice live">
          <h3>Session finished</h3>
          <p>Under a minute: how did it go?</p>
        </div>
      )}
      <div className="field">
        <label htmlFor="ci-lesson">Session</label>
        <select id="ci-lesson" className="input" value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
          {LESSONS.map((l) => (
            <option key={l.id} value={l.id}>
              {lessonCode(l)}: {l.title}
            </option>
          ))}
        </select>
      </div>
      <fieldset className="field">
        <legend>Which version</legend>
        <div className="chips">
          {(["full", "essential", "partial"] as const).map((v) => (
            <label className="chip" key={v}>
              <input type="radio" name="version" checked={version === v} onChange={() => setVersion(v)} />
              <span>{v === "full" ? "Full session" : v === "essential" ? `${lesson.essential.minutes}-minute version` : "Part of it"}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="field">
        <legend>Minutes at the piano</legend>
        <div className="chips">
          {MINUTES.map((m) => (
            <label className="chip" key={m}>
              <input type="radio" name="minutes" checked={minutes === m} onChange={() => setMinutes(m)} />
              <span>{m}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="field">
        <legend>How each focus went</legend>
        <span className="hint">Steady: met the check. Close: nearly. Not yet: the easier version comes first next time.</span>
        {lesson.focus.map((s) => (
          <div className="outcome-row" key={s}>
            <span style={{ fontWeight: 600 }}>{SKILLS[s]?.name ?? s}</span>
            <div className="chips" role="radiogroup" aria-label={SKILLS[s]?.name ?? s}>
              {OUTCOMES.map((o) => (
                <label className="chip" key={o.v}>
                  <input type="radio" name={`o-${s}`} checked={outcomes[s] === o.v} onChange={() => setOutcomes((x) => ({ ...x, [s]: o.v }))} />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </fieldset>
      <fieldset className="field">
        <legend>Comfort</legend>
        <div className="chips">
          {COMFORT.map((c) => (
            <label className="chip" key={c.v}>
              <input type="radio" name="comfort" checked={comfort === c.v} onChange={() => setComfort(c.v)} />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
        {(comfort === "lh-ache" || comfort === "pain") && <p className="care">Noted. The next two sessions switch left-hand parts to right-hand-only versions. If pain persists, check with your hand specialist before playing the left hand again.</p>}
      </fieldset>
      <div className="field">
        <label htmlFor="ci-tempo">
          Comfortable tempo <span className="hint">optional, for the main exercise</span>
        </label>
        <input id="ci-tempo" className="input" style={{ maxWidth: 140 }} type="number" inputMode="numeric" min={20} max={240} value={tempo} onChange={(e) => setTempo(e.target.value)} placeholder="♩ =" />
      </div>
      <div className="field">
        <label htmlFor="ci-diff">Main difficulty</label>
        <input id="ci-diff" className="input" type="text" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} placeholder="e.g. A♭ to A in the scale; left hand late at bar 9" />
      </div>
      <label className="check">
        <input type="checkbox" checked={recorded} onChange={(e) => setRecorded(e.target.checked)} /> I recorded a clip
      </label>
      <div className="field">
        <label htmlFor="ci-note">
          Anything else <span className="hint">optional</span>
        </label>
        <textarea id="ci-note" className="input" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <div className="btn-row" data-tour="checkin-save">
        <button type="submit" className="btn primary">
          Log check-in
        </button>
        <Link className="btn ghost" href="/">
          Cancel
        </Link>
      </div>
    </form>
  );
}
