"use client";

import { PROGRAM, PHASES, PHASE_THEMES, themeVars } from "@/content";
import { daysBetween } from "@/lib/schedule";
import { useToday } from "@/lib/useToday";

export function RoadmapNow({ week }: { week: number }) {
  const today = useToday();
  const current = Math.max(1, Math.floor(daysBetween(PROGRAM.startDate, today) / 7) + 1);
  const phase = PHASES.find((p) => week >= p.weeks[0] && week <= p.weeks[1])?.id ?? "P1";
  return (
    <div className={`tl-week${current === week ? " now" : ""}${week < current ? " past" : ""}`} style={themeVars(PHASE_THEMES[phase])}>
      <span>
        <span className="tl-w">W</span>
        {week}
      </span>
    </div>
  );
}
