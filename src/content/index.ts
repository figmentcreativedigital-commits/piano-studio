import { EXERCISES_W01 } from "./exercises/week01";
import { LESSONS_W01 } from "./lessons/week01";
import { WEEK_COLORS } from "./program";
import type { Exercise, Lesson } from "./types";

export * from "./types";
export { PROGRAM, BASELINE, PHASES, SKILLS, WEEK_COLORS } from "./program";

export const EXERCISES: Exercise[] = [...EXERCISES_W01];
export const LESSONS: Lesson[] = [...LESSONS_W01].map((l) => ({ ...l, color: l.color ?? WEEK_COLORS[(l.week - 1) % WEEK_COLORS.length] }));

const exById = new Map(EXERCISES.map((e) => [e.id, e]));
const lessonById = new Map(LESSONS.map((l) => [l.id, l]));

export function getExercise(id: string): Exercise | undefined {
  return exById.get(id);
}

export function getLesson(id: string): Lesson | undefined {
  return lessonById.get(id);
}

export function lessonExercises(lesson: Lesson): Exercise[] {
  const ids = new Set<string>();
  for (const b of lesson.blocks) for (const id of b.exerciseIds ?? []) ids.add(id);
  return [...ids].map((id) => exById.get(id)).filter((e): e is Exercise => !!e);
}

/** "Piano · W01 D02 · Movement + Blues Guide Tones" */
export function lessonLabel(l: Lesson): string {
  return `Piano · W${String(l.week).padStart(2, "0")} D${String(l.day).padStart(2, "0")} · ${l.title}`;
}

export function lessonCode(l: Pick<Lesson, "week" | "day">): string {
  return `W${String(l.week).padStart(2, "0")} D${String(l.day).padStart(2, "0")}`;
}

export const BLOCK_LABEL: Record<string, string> = {
  checkin: "Check-in",
  setup: "Setup",
  technique: "Technique",
  jazz: "Jazz",
  harris: "Harris",
  blues: "Blues",
  bach: "Bach",
  ear: "Ear",
  listening: "Listening",
  reading: "Reading",
  baseline: "Baseline",
  review: "Review",
  free: "Free play",
  break: "Break",
  retrieval: "Retrieval",
};

export const SOURCE_LABEL: Record<string, string> = {
  harris: "Barry Harris",
  adaptation: "Adaptation",
  original: "Original study",
  bach: "Bach score",
  recording: "Recording",
  baseline: "Baseline",
};
