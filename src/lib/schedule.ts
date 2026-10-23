import type { Lesson } from "@/content/types";
import { getExercise, lessonLabel } from "@/content";

export const TZ = "America/New_York";

/** Offset of `tz` from UTC at instant `d`, in minutes (EDT → -240, EST → -300). */
export function tzOffsetMinutes(d: Date, tz = TZ): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((asUtc - d.getTime()) / 60000);
}

/** Wall-clock time in `tz` → the UTC instant. Handles daylight-saving changes. */
export function zonedToUtc(dateISO: string, hhmm: string, tz = TZ): Date {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  let t = guess - tzOffsetMinutes(new Date(guess), tz) * 60000;
  t = guess - tzOffsetMinutes(new Date(t), tz) * 60000;
  return new Date(t);
}

/** The local calendar date in `tz` for an instant, as YYYY-MM-DD. */
export function localDate(d: Date, tz = TZ): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export function addDays(dateISO: string, n: number): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return t.toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}

export function weekdayName(dateISO: string): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
}

export function prettyDate(dateISO: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
}

export function prettyTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function lessonStart(l: Lesson): Date {
  return zonedToUtc(l.date, l.start);
}

export function lessonEnd(l: Lesson): Date {
  return new Date(lessonStart(l).getTime() + l.minutes * 60000);
}

function clock(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

/** Plain-text description that works on its own in a calendar event. */
export function calendarDescription(l: Lesson, url?: string): string {
  const lines: string[] = [];
  lines.push(l.objective, "");
  let t = 0;
  for (const b of l.blocks) {
    const ex = (b.exerciseIds ?? []).map((id) => getExercise(id)).filter((e): e is NonNullable<typeof e> => !!e);
    const others = ex.filter((e) => e.title !== b.title && e.kind !== "baseline").map((e) => e.title);
    const withTempo = ex.find((e) => e.tempo.start > 0 && !!e.notation && e.kind !== "baseline");
    const tempo = withTempo ? `, ♩ = ${withTempo.tempo.start}${withTempo.tempo.target ? ` to ${withTempo.tempo.target}` : ""}` : "";
    lines.push(`${clock(t)}  ${b.title} (${b.minutes} min)${b.kind !== "break" && others.length ? `: ${others.join("; ")}` : ""}${b.kind !== "break" ? tempo : ""}`);
    t += b.minutes;
  }
  lines.push("");
  const seen = new Set<string>();
  const key = l.blocks
    .flatMap((b) => b.exerciseIds ?? [])
    .filter((id) => (seen.has(id) ? false : (seen.add(id), true)))
    .map((id) => getExercise(id))
    .filter((e): e is NonNullable<typeof e> => !!e && !!e.spelling && !["listening", "baseline", "review"].includes(e.kind) && !e.hideNotation)
    .sort((a, b) => Number(b.skills.some((x) => l.focus.includes(x))) - Number(a.skills.some((x) => l.focus.includes(x))))
    .slice(0, 4);
  if (key.length) {
    lines.push("Key material:");
    for (const e of key) lines.push(`• ${e.title}: ${e.spelling}${e.fingering ? ` Fingering: ${e.fingering}` : ""}`);
    lines.push("");
  }
  lines.push("Left hand: fingers 2–5 only, thumb off the keys. Any ache at the thumb base: right hand only.");
  lines.push(`Short on time? The ${l.essential.minutes}-minute essential version replaces this session.`);
  if (url) {
    lines.push("", `Full lesson: ${url}`);
    if (l.blocks.some((b) => b.kind === "baseline")) lines.push(`Baseline page: ${new URL("/baseline.html", url).toString()}`);
  }
  return lines.join("\n");
}

function icsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsEscape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Folds content lines at 75 octets as RFC 5545 requires. */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let cur = "";
  let curBytes = 0;
  for (const ch of line) {
    const b = new TextEncoder().encode(ch).length;
    if (curBytes + b > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = "";
      curBytes = 0;
    }
    cur += ch;
    curBytes += b;
  }
  out.push(cur);
  return out.join("\r\n ");
}

/** A static .ics export. Times are written in UTC, so daylight-saving changes are already resolved. */
export function buildIcs(lessons: Lesson[], baseUrl: string, stamp = new Date()): string {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Woodshed//Piano Studio//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Piano"];
  for (const l of lessons) {
    const url = `${baseUrl.replace(/\/$/, "")}/lessons/${l.id}`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${l.id.toLowerCase()}@woodshed-piano`,
      `DTSTAMP:${icsDate(stamp)}`,
      `DTSTART:${icsDate(lessonStart(l))}`,
      `DTEND:${icsDate(lessonEnd(l))}`,
      fold(`SUMMARY:${icsEscape(lessonLabel(l))}`),
      fold(`DESCRIPTION:${icsEscape(calendarDescription(l, url))}`),
      fold(`URL:${url}`),
      "TRANSP:OPAQUE",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
