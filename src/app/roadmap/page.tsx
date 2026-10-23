import type { Metadata } from "next";
import Link from "next/link";
import { BASELINE, PHASES, getVehicle } from "@/content";
import { RoadmapNow } from "@/components/RoadmapNow";
import { ROADMAP_INTRO, ROADMAP_TITLE } from "@/lib/narration";
import { readable } from "@/lib/speech-text";
import { Gloss } from "@/components/Gloss";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = { title: "Your 12-week plan", description: "Twelve weeks in four phases, with milestones you can hear and check." };

export default function RoadmapPage() {
  return (
    <>
      <div className="wrap page-head">
        <Breadcrumbs items={[{ label: "Progress", href: "/progress" }, { label: "Your 12-week plan" }]} />
        <h1 {...readable(ROADMAP_TITLE)}>{ROADMAP_TITLE}</h1>
        <p {...readable(ROADMAP_INTRO)}>{ROADMAP_INTRO}</p>
      </div>
      <div className="wrap">
        <div className="timeline" aria-hidden="true" data-tour="roadmap-timeline">
          {Array.from({ length: 12 }, (_, i) => (
            <RoadmapNow key={i} week={i + 1} />
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
                <h2 id={`ph-${p.id}`} {...readable(p.name)}>
                  {p.name}
                </h2>
                <p className="prose" style={{ marginTop: 10 }} {...readable(p.summary)}>
                  <Gloss text={p.summary} />
                </p>
              </div>
              <div className="phase-cols">
                <div className="phase-tunes">
                  <h3>The three tunes</h3>
                  <ul>
                    {p.tunes.map((t) => (
                      <li key={t.vehicle} {...readable(`${getVehicle(t.vehicle).name}: ${t.text}`)}>
                        <Link href={`/tunes#${t.vehicle}`}>{getVehicle(t.vehicle).name.replace(/"/g, "")}</Link>: {t.text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Jazz</h3>
                  <ul>{p.jazz.map((x) => <li key={x}><Gloss text={x} /></li>)}</ul>
                </div>
                <div>
                  <h3>Bach</h3>
                  <ul>{p.bach.map((x) => <li key={x}><Gloss text={x} /></li>)}</ul>
                </div>
                <div>
                  <h3>Technique</h3>
                  <ul>{p.technique.map((x) => <li key={x}><Gloss text={x} /></li>)}</ul>
                </div>
                <div>
                  <h3>Ears</h3>
                  <ul>{p.ear.map((x) => <li key={x}><Gloss text={x} /></li>)}</ul>
                </div>
              </div>
              <div className="milestone">
                <h3 {...readable(`Milestone: ${p.milestone.title}`)}>Milestone: {p.milestone.title}</h3>
                <ol>
                  {p.milestone.checks.map((c) => (
                    <li key={c} {...readable(c)}>
                      {c}
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
