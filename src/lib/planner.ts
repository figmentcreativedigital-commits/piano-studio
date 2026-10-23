import type { Exercise, Lesson } from "@/content/types";
import { addDays, daysBetween } from "./schedule";

/**
 * The adaptive planner. Pure functions over the practice record, so the same
 * inputs always give the same plan, every change carries a reason, and every
 * change can be undone.
 *
 * Principles:
 * - Lessons run in sequence. A missed day never doubles the next one; the
 *   sequence simply resumes where you left off.
 * - A completed timer is not mastery. Outcomes per skill decide repetition,
 *   simplification, consolidation or progression.
 * - Review intervals stretch when a skill holds and shrink when it slips.
 */

export type Outcome = "steady" | "close" | "notyet" | "skipped";
export type Comfort = "fine" | "tense" | "lh-ache" | "pain";

export interface CheckIn {
  id: string;
  /** Local practice date, YYYY-MM-DD (America/New_York). */
  date: string;
  lessonId: string;
  version: "full" | "essential" | "partial" | "unlogged";
  minutes: number;
  outcomes: Record<string, Outcome>;
  tempo?: number;
  difficulty?: string;
  comfort: Comfort;
  recorded?: boolean;
  note?: string;
  createdAt: string;
}

export interface DayMark {
  id: string;
  kind: "missed" | "away" | "short";
  date: string;
  until?: string;
  minutes?: number;
  createdAt: string;
}

export interface PracticeRecord {
  version: 1;
  checkIns: CheckIn[];
  marks: DayMark[];
  /** Ids of planner adjustments the student has reversed. */
  undone: string[];
}

export const EMPTY_RECORD: PracticeRecord = { version: 1, checkIns: [], marks: [], undone: [] };

export type SkillStatus = "new" | "practicing" | "simplify" | "steady" | "retained";

export interface SkillState {
  skill: string;
  status: SkillStatus;
  lastDate?: string;
  lastOutcome?: Outcome;
  /** Days until the next review. */
  interval: number;
  due?: string;
  history: { date: string; outcome: Outcome; lessonId: string }[];
}

export interface Adjustment {
  id: string;
  kind: "slide" | "reentry" | "lh-rest" | "simplify" | "short-day" | "away";
  title: string;
  reason: string;
  undoLabel: string;
  skill?: string;
  lessonId?: string;
}

export interface Plan {
  today: string;
  /** The lesson to play now. Null when the authored lessons are all done. */
  lesson: Lesson | null;
  /** The lesson the calendar has for today, if any. */
  scheduled: Lesson | null;
  status: "not-started" | "on-track" | "behind" | "ahead" | "done-today" | "complete" | "away";
  behindBy: number;
  version: "full" | "essential";
  reentry: boolean;
  lhRest: boolean;
  /** Skills whose easier version should come first. */
  simplify: string[];
  due: SkillState[];
  adjustments: Adjustment[];
  completed: Set<string>;
  lastCheckIn?: CheckIn;
}

const REENTRY_GAP = 4; // days without practice before a re-entry check

const code = (id: string) => `${id.slice(0, 3)} ${id.slice(3)}`;

export function skillStates(record: PracticeRecord, today: string): Map<string, SkillState> {
  const map = new Map<string, SkillState>();
  const sorted = [...record.checkIns].sort((a, b) => (a.date === b.date ? a.createdAt.localeCompare(b.createdAt) : a.date.localeCompare(b.date)));
  for (const c of sorted) {
    for (const [skill, outcome] of Object.entries(c.outcomes)) {
      if (outcome === "skipped") continue;
      const s = map.get(skill) ?? { skill, status: "new" as SkillStatus, interval: 1, history: [] };
      const prevSteadyDate = s.history.filter((h) => h.outcome === "steady").map((h) => h.date).pop();
      s.history.push({ date: c.date, outcome, lessonId: c.lessonId });
      if (outcome === "steady") {
        if (prevSteadyDate && prevSteadyDate < c.date) {
          s.status = "retained";
          s.interval = Math.min(s.interval * 2, 14);
        } else {
          s.status = s.status === "retained" ? "retained" : "steady";
          s.interval = Math.max(s.interval, 1);
        }
      } else if (outcome === "close") {
        s.status = "practicing";
        s.interval = 1;
      } else if (outcome === "notyet") {
        s.status = "simplify";
        s.interval = 1;
      }
      s.lastDate = c.date;
      s.lastOutcome = outcome;
      s.due = addDays(c.date, s.interval);
      map.set(skill, s);
    }
  }
  void today;
  return map;
}

export function plan(lessons: Lesson[], record: PracticeRecord, today: string): Plan {
  const undone = new Set(record.undone);
  const checkIns = [...record.checkIns].sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
  const completed = new Set(checkIns.map((c) => c.lessonId));
  const adjustments: Adjustment[] = [];

  // Undoing a slide means "I did it, I just didn't log it": treat it as completed.
  for (const id of undone) if (id.startsWith("slide:")) completed.add(id.split(":")[2]);

  const ordered = [...lessons].sort((a, b) => a.date.localeCompare(b.date));
  const scheduled = ordered.find((l) => l.date === today) ?? null;
  const next = ordered.find((l) => !completed.has(l.id)) ?? null;
  const lastCheckIn = checkIns[checkIns.length - 1];
  const doneToday = checkIns.some((c) => c.date === today);

  const first = ordered[0];
  let status: Plan["status"] = "on-track";
  let behindBy = 0;

  const away = record.marks.find((m) => m.kind === "away" && m.date <= today && (m.until ?? m.date) >= today && !undone.has(`away:${m.id}`));

  if (!next) status = "complete";
  else if (first && today < first.date) status = "not-started";
  else if (away) status = "away";
  else if (doneToday) status = "done-today";
  else if (scheduled && next.date < scheduled.date) {
    status = "behind";
    behindBy = ordered.filter((l) => l.date >= next.date && l.date < scheduled.date && !completed.has(l.id)).length;
    const id = `slide:${today}:${next.id}`;
    if (!undone.has(id)) {
      adjustments.push({
        id,
        kind: "slide",
        lessonId: next.id,
        title: `Today runs ${code(next.id)} instead of the calendar's ${code(scheduled.id)}`,
        reason: `${code(next.id)} isn't logged yet, and its material comes before ${code(scheduled.id)}. The plan slides rather than stacking two sessions into one; the weekly review absorbs the difference.`,
        undoLabel: `I did ${code(next.id)}; mark it done`,
      });
    }
  } else if (scheduled && next.date > scheduled.date) {
    status = "ahead";
  }

  if (away) {
    adjustments.push({
      id: `away:${away.id}`,
      kind: "away",
      title: `Away until ${away.until ?? away.date}`,
      reason: "Nothing is scheduled while you're away. The plan resumes with a short re-entry check.",
      undoLabel: "I'm back early",
    });
  }

  // Re-entry after a gap.
  let reentry = false;
  if (lastCheckIn && next && status !== "not-started") {
    const gap = daysBetween(lastCheckIn.date, today);
    const id = `reentry:${lastCheckIn.date}`;
    if (gap > REENTRY_GAP && !undone.has(id)) {
      reentry = true;
      adjustments.push({
        id,
        kind: "reentry",
        title: "A short re-entry check comes first",
        reason: `It's been ${gap} days since your last session. Ten minutes of retrieval on the last lesson's material shows what held before anything new arrives.`,
        undoLabel: "Skip the re-entry check",
      });
    }
  }

  // Left-hand rest after an ache in either of the last two check-ins.
  let lhRest = false;
  const recent = checkIns.slice(-2);
  const ache = recent.find((c) => c.comfort === "lh-ache" || c.comfort === "pain");
  if (ache) {
    const id = `lh-rest:${ache.id}`;
    if (!undone.has(id)) {
      lhRest = true;
      adjustments.push({
        id,
        kind: "lh-rest",
        title: "Left hand rests today",
        reason: `Your check-in on ${ache.date} noted ${ache.comfort === "lh-ache" ? "an ache in the left hand" : "pain"}. Left-hand parts switch to their right-hand-only versions for the next two sessions.`,
        undoLabel: "My hand is fine; restore the left hand",
      });
    }
  }

  // Simplify skills that came back "not yet".
  const states = skillStates(record, today);
  const simplify: string[] = [];
  for (const s of states.values()) {
    if (s.status === "simplify") {
      const id = `simplify:${s.skill}:${s.lastDate}`;
      if (!undone.has(id)) {
        simplify.push(s.skill);
        adjustments.push({
          id,
          kind: "simplify",
          skill: s.skill,
          title: "Easier version first",
          reason: `On ${s.lastDate} this was marked 'not yet'. Exercises for it open with their easier version; move on to the full version when the easier one is clean three times.`,
          undoLabel: "Use the full version",
        });
      }
    }
  }

  // Short-day mark for today.
  const short = record.marks.find((m) => m.kind === "short" && m.date === today && !undone.has(`short:${m.id}`));
  const version: Plan["version"] = short ? "essential" : "full";
  if (short) {
    adjustments.push({
      id: `short:${short.id}`,
      kind: "short-day",
      title: `${short.minutes ?? 20} minutes today`,
      reason: "Today uses the essential version. Nothing carries over as homework; the full lesson's main skill comes back in the next review.",
      undoLabel: "I have the full time after all",
    });
  }

  const due = [...states.values()]
    .filter((s) => (s.status === "steady" || s.status === "retained" || s.status === "practicing") && s.due && s.due <= today)
    .sort((a, b) => (a.due ?? "").localeCompare(b.due ?? ""));

  return { today, lesson: next, scheduled, status, behindBy, version, reentry, lhRest, simplify, due, adjustments, completed, lastCheckIn };
}

/** What the next step for a skill should be, in plain words. */
export function nextStep(s: SkillState | undefined): { label: string; detail: string } {
  if (!s) return { label: "New", detail: "Not practiced yet." };
  switch (s.status) {
    case "simplify":
      return { label: "Simplify", detail: "Start from the easier version until it's clean three times." };
    case "practicing":
      return { label: "Repeat", detail: "Same version again; aim for three clean in a row." };
    case "steady":
      return { label: "Consolidate", detail: "Clean once. Check it from memory on a later day." };
    case "retained":
      return { label: "Progress", detail: "Held across days. Raise the tempo or move it to a new key." };
    default:
      return { label: "New", detail: "Not practiced yet." };
  }
}

/** Exercises in a lesson that use the left hand, for the left-hand rest switch. */
export function usesLeftHand(e: Exercise): boolean {
  return e.hands === "LH" || e.hands === "both";
}
