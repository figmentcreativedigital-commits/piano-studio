import { EXERCISES, LESSONS, PHASES, PROGRAM, SKILLS, VEHICLES, getVehicle } from "@/content";
import type { Exercise } from "@/content/types";
import { LIBRARY, LIBRARY_INTRO, LIBRARY_TITLE, RECORDINGS_CARD } from "@/content/library";
import { METHOD, METHOD_INTRO, METHOD_TITLE, plain } from "@/content/method";
import { TOUR, type TourStep } from "@/content/tour";
import type { Block, Lesson } from "@/content/types";
import { prettyDate, prettyTime, weekdayName } from "./schedule";
import { speechKey } from "./speech-text";

/*
 * The narrator. Lesson text is voiced by Google's Chirp 3 HD voices on the
 * server, once per passage, and cached. Only passages listed here can be
 * voiced, so the key behind the site can't be used to say anything else.
 * Pages build what they read from these same functions, so the words always
 * match. Anything not listed falls back to the device's own voice.
 */

export const NARRATOR_VOICES = [
  { name: "Sadaltager", trait: "Knowledgeable" },
  { name: "Charon", trait: "Informative" },
  { name: "Gacrux", trait: "Mature" },
  { name: "Sulafat", trait: "Warm" },
  { name: "Algenib", trait: "Gravelly" },
  { name: "Achird", trait: "Friendly" },
] as const;

export const NARRATOR_DEFAULT = "Sadaltager";

export const NARRATOR_SAMPLE =
  "W01 D02: Movement + Blues Guide Tones. Left hand: F7 is E♭3 and A3, short on beat 1, with the click on 2 and 4 at ♩ = 60. Then the right hand answers with the riff.";

// ───────────────────────── Shared page text ─────────────────────────

export const TUNES_TITLE = "Three tunes";
export const TUNES_INTRO =
  "Every skill in the program gets used in the same three tunes. They are Rhythm changes, the blues in major and minor, and “Indiana” with “Donna Lee”. Learn them well, and you learn most of the chords that bebop uses.";

export const ROADMAP_TITLE = "Twelve weeks";
export const ROADMAP_INTRO =
  "This is a first-draft plan in 4 phases. It promises a good way to work, not a date when you will have it all down. Each milestone is a check you can play. The plan changes when what you can actually play changes.";

/** The Method page's name in the navigation and on the page. */
export const HOW_TITLE = "How it works";

export const COMMON_MISTAKES = "Common mistakes";

/** What an exercise card's "More help" reads aloud, in order. */
export function moreHelpReadings(e: Exercise): { listenFor?: string; feelFor?: string; easier: string; harder?: string; skills?: string } {
  const skills = e.skills.map((s) => SKILLS[s]?.name ?? s).join(", ");
  return {
    listenFor: e.listenFor ? `Listen for: ${e.listenFor}` : undefined,
    feelFor: e.feelFor ? `Feel for: ${e.feelFor}` : undefined,
    easier: `Easier: ${e.easier}`,
    harder: e.harder ? `Harder: ${e.harder}` : undefined,
    skills: skills ? `Skills it builds: ${skills}` : undefined,
  };
}

export const COMPLETE_LINE = "You have finished every lesson written so far. The next week comes after your check-in.";

export function endTime(start: string, minutes: number): string {
  const [h, m] = start.split(":").map(Number);
  const t = h * 60 + m + minutes;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

/** The line above today's title. */
export function whenLine(lesson: Lesson, status: string, scheduled?: { id: string; start: string }): string {
  if (status === "not-started")
    return `First session: ${weekdayName(lesson.date)}, ${prettyDate(lesson.date, { month: "long", day: "numeric" })}, ${prettyTime(lesson.start)} to ${prettyTime(endTime(lesson.start, lesson.minutes))}`;
  if (status === "complete") return COMPLETE_LINE;
  if (scheduled && scheduled.id === lesson.id) return `Today, ${prettyTime(lesson.start)} to ${prettyTime(endTime(lesson.start, lesson.minutes))}`;
  return `Today, in your usual slot${scheduled ? ` (${prettyTime(scheduled.start)})` : ""}`;
}

/** "W01 D02, Sunday, October 25, 1 pm" */
export function lessonIdLine(l: Lesson): string {
  const code = `W${String(l.week).padStart(2, "0")} D${String(l.day).padStart(2, "0")}`;
  return `${code}, ${prettyDate(l.date, { weekday: "long", month: "long", day: "numeric" })}, ${prettyTime(l.start)}`;
}

export function blockReading(b: Block): string {
  return [b.title, ...b.text].join(". ");
}

export function tourReading(s: TourStep, withWhy: boolean): string {
  return [s.title, s.body, withWhy && s.why ? s.why : ""].filter(Boolean).join(". ");
}

export const agendaHeading = (minutes?: number) => (minutes ? `The ${minutes}-minute version` : "The session");

// ───────────────────────── The whitelist ─────────────────────────

export function narrationTexts(): string[] {
  const out: string[] = [NARRATOR_SAMPLE, TUNES_TITLE, TUNES_INTRO, ROADMAP_TITLE, ROADMAP_INTRO, COMPLETE_LINE, agendaHeading(), HOW_TITLE, COMMON_MISTAKES];
  out.push(LIBRARY_TITLE, LIBRARY_INTRO, RECORDINGS_CARD.name, RECORDINGS_CARD.blurb);
  for (const e of LIBRARY) out.push(e.name, e.blurb, e.intro);
  const starts = new Set(Object.values(PROGRAM.schedule).map((s) => s.start));
  for (const l of LESSONS) {
    out.push(l.title, l.objective, `How the time is split: ${l.balance}`, `Try it in music: ${l.application}`, lessonIdLine(l), agendaHeading(l.essential.minutes));
    out.push(whenLine(l, "not-started"), whenLine(l, "today", { id: l.id, start: l.start }), whenLine(l, "today"));
    for (const s of starts) out.push(whenLine(l, "today", { id: "other", start: s }));
    for (const b of [...l.blocks, ...l.essential.blocks]) out.push(b.title, ...b.text, blockReading(b));
  }
  for (const e of EXERCISES) {
    out.push(e.title, ...e.steps, `Cue: ${e.cue}`, `Done when: ${e.check}`);
    if (e.spelling) out.push(e.spelling);
    if (e.fingering) out.push(`Fingering: ${e.fingering}`);
    if (e.recording) out.push(e.recording.title, e.recording.question);
    const more = moreHelpReadings(e);
    out.push(...e.errors, ...[more.listenFor, more.feelFor, more.easier, more.harder, more.skills].filter((x): x is string => !!x));
  }
  for (const v of VEHICLES) out.push(v.tune, v.name, v.summary);
  for (const p of PHASES) {
    out.push(p.name, p.summary, `Milestone: ${p.milestone.title}`, ...p.milestone.checks);
    for (const t of p.tunes) out.push(`${getVehicle(t.vehicle).name}: ${t.text}`);
  }
  for (const c of TOUR) for (const s of c.steps) out.push(tourReading(s, false), tourReading(s, true));
  out.push(METHOD_TITLE, METHOD_INTRO);
  for (const m of METHOD) {
    out.push(m.heading, ...m.paragraphs.map(plain), ...(m.after ?? []).map(plain));
    for (const i of m.list ?? []) out.push(`${i.term}: ${i.text}`);
  }
  return out.filter(Boolean);
}

let index: Map<string, string> | null = null;

/** The passage for a key, if it's one the narrator may voice. */
export function narrationFor(key: string): string | undefined {
  if (!index) {
    index = new Map();
    for (const t of narrationTexts()) index.set(speechKey(t), t);
  }
  return index.get(key);
}
