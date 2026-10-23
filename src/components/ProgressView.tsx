"use client";

import { useMemo, useRef, useState } from "react";
import { BASELINE, LESSONS, SKILLS, lessonCode, getLesson } from "@/content";
import { nextStep, skillStates } from "@/lib/planner";
import { prettyDate } from "@/lib/schedule";
import { downloadFile, exportData, importData, recordStore, removeCheckIn, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";
import { checkInText } from "./CheckInForm";

const STATUS_LABEL: Record<string, string> = { new: "New", practicing: "Practicing", simplify: "Easier first", steady: "Steady", retained: "Remembered" };
const AREA_LABEL: Record<string, string> = { technique: "Technique", jazz: "Jazz", bach: "Bach", ear: "Ear", reading: "Reading", time: "Time" };

export function ProgressView() {
  const today = useToday();
  const record = useStore(recordStore);
  const states = useMemo(() => skillStates(record, today), [record, today]);
  const [msg, setMsg] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const history = [...record.checkIns].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const totalMin = record.checkIns.reduce((s, c) => s + c.minutes, 0);
  const lessonsDone = new Set(record.checkIns.map((c) => c.lessonId)).size;

  const onImport = async (f: File) => {
    try {
      const r = importData(JSON.parse(await f.text()));
      setMsg(`Added ${r.checkIns} check-ins and ${r.marks} day marks. Nothing you already had was changed.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "That file couldn't be read.");
    }
  };

  const copyAll = async () => {
    const text = history.map(checkInText).join("\n");
    try {
      await navigator.clipboard.writeText(text || "No check-ins yet.");
      setMsg("All check-ins copied as text.");
    } catch {
      setMsg("This browser couldn't copy it.");
    }
  };

  return (
    <div className="wrap">
      <section className="section grid-3" aria-label="Totals">
        <div className="panel">
          <h3>{totalMin} minutes</h3>
          <p className="empty">at the piano, over {record.checkIns.length} check-ins</p>
        </div>
        <div className="panel">
          <h3>
            {lessonsDone} of {LESSONS.length} sessions
          </h3>
          <p className="empty">in the plan so far</p>
        </div>
        <div className="panel">
          <h3>Baseline: {BASELINE.status === "provisional" ? "first draft" : "confirmed"}</h3>
          <p className="empty">{BASELINE.status === "provisional" ? "Based on your first answers. The baseline session will confirm it." : `Confirmed ${BASELINE.updated}.`}</p>
        </div>
      </section>

      <section className="section" aria-labelledby="ledger-h" data-tour="progress-ledger">
        <div className="section-head">
          <h2 id="ledger-h">Skills</h2>
          <span className="muted">These are your own ratings from check-ins. The app doesn&apos;t measure anything here unless it says so.</span>
        </div>
        <div className="table-wrap">
          <table className="ledger">
            <thead>
              <tr>
                <th scope="col">Skill</th>
                <th scope="col">Area</th>
                <th scope="col">Status</th>
                <th scope="col">Last rated</th>
                <th scope="col">Next step</th>
                <th scope="col">Next review</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(SKILLS).map(([id, s]) => {
                const st = states.get(id);
                const ns = nextStep(st);
                return (
                  <tr key={id}>
                    <th scope="row" style={{ fontWeight: 600 }}>
                      {s.name}
                    </th>
                    <td>{AREA_LABEL[s.area]}</td>
                    <td>
                      <span className={`pill ${st?.status ?? "new"}`}>{STATUS_LABEL[st?.status ?? "new"]}</span>
                    </td>
                    <td>{st?.lastDate ? `${prettyDate(st.lastDate)} (your rating)` : "—"}</td>
                    <td>
                      <strong>{ns.label}.</strong> <span className="hint">{ns.detail}</span>
                    </td>
                    <td>{st?.due ? (st.due <= today ? "Today" : prettyDate(st.due)) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" aria-labelledby="hist-h">
        <div className="section-head">
          <h2 id="hist-h">Check-ins</h2>
          <button type="button" className="btn small" onClick={copyAll}>
            Copy all as text
          </button>
        </div>
        {history.length ? (
          <div className="table-wrap">
            <table className="ledger">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Session</th>
                  <th scope="col">Minutes</th>
                  <th scope="col">Hands felt</th>
                  <th scope="col">Hardest part and notes</th>
                  <th scope="col">
                    <span className="sr-only">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((c) => {
                  const l = getLesson(c.lessonId);
                  return (
                    <tr key={c.id}>
                      <td>{prettyDate(c.date)}</td>
                      <td>
                        {l ? `${lessonCode(l)} ${l.title}` : c.lessonId}
                        <br />
                        <span className="hint">{c.version}</span>
                      </td>
                      <td>{c.minutes}</td>
                      <td>{c.comfort === "fine" ? "Fine" : c.comfort === "tense" ? "Felt tight" : c.comfort === "lh-ache" ? "Left hand ached" : "Pain"}</td>
                      <td style={{ fontFamily: "var(--serif)" }}>{[c.difficulty, c.note].filter(Boolean).join(". ") || "—"}</td>
                      <td>
                        <button type="button" className="btn small ghost" onClick={() => removeCheckIn(c.id)} aria-label={`Remove check-in from ${c.date}`}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="prose muted">No check-ins yet. After each session, a check-in takes less than a minute. It decides your next step: repeat it, go easier, make it solid, or learn something new.</p>
        )}
      </section>

      <section className="section" aria-labelledby="data-h" data-tour="progress-backup">
        <div className="section-head">
          <h2 id="data-h">Your data</h2>
        </div>
        <div className="prose" style={{ marginBottom: 14 }}>
          <p>Your check-ins, ratings and run counts stay in this browser, on this device. They are never sent anywhere. Export a backup now and then. To keep going on another device, import the backup there.</p>
        </div>
        <div className="btn-row">
          <button type="button" className="btn primary" onClick={() => downloadFile(`woodshed-backup-${today}.json`, JSON.stringify(exportData(), null, 2), "application/json")}>
            Export backup
          </button>
          <button type="button" className="btn" onClick={() => file.current?.click()}>
            Import a backup
          </button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files?.[0] && void onImport(e.target.files[0])} />
          <a className="btn ghost" href="/calendar.ics">
            Download calendar file
          </a>
        </div>
        <p className="hint" aria-live="polite">
          {msg}
        </p>
      </section>
    </div>
  );
}
