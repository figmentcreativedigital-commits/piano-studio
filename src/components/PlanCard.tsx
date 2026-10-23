import Link from "next/link";
import { PHASES, PHASE_THEMES, themeVars } from "@/content";
import { RoadmapNow } from "./RoadmapNow";

/** "Your 12-week plan": the way into the roadmap from Progress. */
export function PlanCard() {
  return (
    <section className="plan-card" aria-labelledby="plan-h" data-tour="progress-plan">
      <div className="plan-card-text">
        <p className="plan-kicker">12 weeks, 4 phases</p>
        <h2 id="plan-h" className="plan-title">
          Your <span className="nowrap">12-week</span> plan
        </h2>
        <p className="plan-lede">See what each phase works on, and the milestone you play at the end of it.</p>
        <Link className="btn primary" href="/roadmap">
          See the whole plan <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="plan-card-weeks" aria-hidden="true">
        <div className="timeline plan-timeline">
          {Array.from({ length: 12 }, (_, i) => (
            <RoadmapNow key={i} week={i + 1} />
          ))}
        </div>
        <ol className="plan-phases">
          {PHASES.map((p) => (
            <li key={p.id} style={{ ...themeVars(PHASE_THEMES[p.id]), gridColumn: `span ${p.weeks[1] - p.weeks[0] + 1}` }}>
              <b>{p.name}</b>
              <span>
                Weeks {p.weeks[0]}–{p.weeks[1]}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
