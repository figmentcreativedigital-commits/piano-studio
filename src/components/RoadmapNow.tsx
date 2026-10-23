"use client";

import { PROGRAM } from "@/content";
import { daysBetween } from "@/lib/schedule";
import { useToday } from "@/lib/useToday";

export function RoadmapNow({ week, color }: { week: number; color: string }) {
  const today = useToday();
  const current = Math.max(1, Math.floor(daysBetween(PROGRAM.startDate, today) / 7) + 1);
  return (
    <div className={`tl-week${current === week ? " now" : ""}`} style={{ background: color, opacity: week < current ? 0.55 : 1 }}>
      W{week}
    </div>
  );
}
