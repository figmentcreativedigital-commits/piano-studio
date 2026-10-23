import { EXERCISES, LESSONS, PHASES, VEHICLES } from "@/content";

/**
 * The musical facts of the program: everything except the wording. Used to
 * prove that a plain-language rewrite changed words, not music.
 */

const PROSE = new Set([
  "title", "subtitle", "objective", "balance", "application", "retrieval", "prerequisites", "text", "note", "steps", "listenFor",
  "feelFor", "errors", "cue", "check", "easier", "harder", "lhCare", "reps", "spelling", "fingering", "caption", "question",
  "label", "summary", "jazz", "bach", "technique", "ear", "checks", "name", "tune", "detail", "family", "uses", "form",
]);

export function musicTokens(text: string | undefined): string[] {
  if (!text) return [];
  const t = text.replace(/♭/g, "b").replace(/♯/g, "#");
  const notes = t.match(/\b[A-G](b|#)?\d\b/g) ?? [];
  const fingers = t.match(/\b\d(?:-\d)+\b/g) ?? [];
  const tempos = (t.match(/♩\s*=\s*\d+/g) ?? []).map((x) => x.replace(/\s/g, ""));
  return [...notes, ...fingers, ...tempos].sort();
}

function strip(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(strip);
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) if (!PROSE.has(k)) out[k] = strip(x);
    return out;
  }
  return v;
}

export function facts() {
  const exercises: Record<string, unknown> = {};
  for (const e of EXERCISES) {
    exercises[e.id] = {
      data: strip(e),
      tokens: {
        spelling: musicTokens(e.spelling),
        fingering: musicTokens(e.fingering),
        steps: musicTokens(e.steps.join(" ")),
        check: musicTokens(e.check),
        easier: musicTokens(e.easier),
        captions: musicTokens((e.keyboard ?? []).map((k) => k.caption).join(" ")),
      },
    };
  }
  const lessons: Record<string, unknown> = {};
  for (const l of LESSONS) {
    lessons[l.id] = {
      data: strip({ ...l, theme: undefined }),
      tokens: {
        objective: musicTokens(l.objective),
        application: musicTokens(l.application),
        blocks: [...l.blocks, ...l.essential.blocks].map((b) => musicTokens(b.text.join(" "))),
      },
    };
  }
  return { exercises, lessons, phases: strip(PHASES), vehicles: strip(VEHICLES) };
}
