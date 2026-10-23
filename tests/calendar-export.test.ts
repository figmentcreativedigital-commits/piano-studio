import { it } from "vitest";
import fs from "node:fs";
import { LESSONS, lessonLabel } from "@/content";
import { calendarDescription } from "@/lib/schedule";

// Writes calendar event payloads for the authored lessons. Runs only with CAL=1.
it.runIf(process.env.CAL === "1")("export calendar events", () => {
  const base = process.env.SITE_URL;
  const out = LESSONS.map((l) => {
    const [h, m] = l.start.split(":").map(Number);
    const end = h * 60 + m + l.minutes;
    return {
      id: l.id,
      summary: lessonLabel(l),
      start: `${l.date}T${l.start}:00`,
      end: `${l.date}T${String(Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}:00`,
      description: calendarDescription(l, base ? `${base}/lessons/${l.id}` : undefined),
    };
  });
  fs.mkdirSync("tests/.audit", { recursive: true });
  fs.writeFileSync("tests/.audit/events.json", JSON.stringify(out, null, 1));
});
