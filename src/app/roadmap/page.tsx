import type { Metadata } from "next";
import { BASELINE, PHASES, WEEK_COLORS } from "@/content";
import { RoadmapNow } from "@/components/RoadmapNow";

export const metadata: Metadata = { title: "Roadmap", description: "Twelve weeks in four phases, with milestones you can hear and check." };

export default function RoadmapPage() {
  return (
    <>
      <div className="wrap page-head">
        <h1>Twelve weeks</h1>
        <p>A provisional plan in four phases. It promises a sound process, not a date for mastery: each milestone is a check you can play, and the plan moves when the evidence does.</p>
      </div>
      <div className="wrap">
        <div className="timeline" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <RoadmapNow key={i} week={i + 1} color={WEEK_COLORS[i]} />
          ))}
        </div>

        <section className="section" aria-labelledby="base-h" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <h2 id="base-h">Starting point</h2>
            <span className="muted">{BASELINE.status === "provisional" ? "Provisional until the baseline session" : "Confirmed"}</span>
          </div>
          <div className="grid-3">
            <div className="panel" style={{ gridColumn: "span 2" }}>
              <p className="prose" style={{ margin: "0 0 12px" }}>
                {BASELINE.summary}
              </p>
              <dl className="facts" style={{ marginTop: 0 }}>
                {BASELINE.findings.map((f) => (
                  <div key={f.area} style={{ display: "contents" }}>
                    <dt>{f.area}</dt>
                    <dd>{f.level}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="panel">
              <h3>What that means for the teaching</h3>
              <ul style={{ fontFamily: "var(--serif)" }}>
                {BASELINE.teaching.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="phases">
          {PHASES.map((p) => (
            <section key={p.id} className="phase" aria-labelledby={`ph-${p.id}`}>
              <div>
                <span className="weeks">
                  Weeks {p.weeks[0]}–{p.weeks[1]}
                </span>
                <h2 id={`ph-${p.id}`}>{p.name}</h2>
                <p className="prose" style={{ marginTop: 10 }}>
                  {p.summary}
                </p>
              </div>
              <div className="phase-cols">
                <div>
                  <h3>Jazz</h3>
                  <ul>{p.jazz.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
                <div>
                  <h3>Bach</h3>
                  <ul>{p.bach.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
                <div>
                  <h3>Technique</h3>
                  <ul>{p.technique.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
                <div>
                  <h3>Ears</h3>
                  <ul>{p.ear.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              </div>
              <div className="milestone">
                <h3>Milestone: {p.milestone.title}</h3>
                <ol>{p.milestone.checks.map((c) => <li key={c}>{c}</li>)}</ol>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
