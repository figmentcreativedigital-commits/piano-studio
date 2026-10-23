/**
 * Reading level, so the site stays readable for a 7th-grade piano student.
 * Flesch–Kincaid grade on the words people read; note names, chord symbols,
 * fingerings and tempo marks are taken out first, since those are exact
 * musical data rather than prose.
 */

const MUSIC = [
  /♩\s*=\s*\d+(\s*(–|to)\s*\d+)?/g, // tempo marks
  /\b\d+(-\d+){1,}\b/g, // fingerings 1-2-3-4
  /\b[A-G](♭|♯|b|#)?(m7♭5|m7b5|maj7|m7|m6|°7|°|ø|7♭9|7b9|\d)?\b/g, // notes and chords
  /\bW\d\d\s*D\d\d\b/g, // lesson codes
  /\bBWV\s*\d+\b/g,
  /\bmm?\.\s*\d+(\s*[–-]\s*\d+)?/g,
  /\b\d+(\.\d+)?\b/g, // bare numbers
];

export function clean(text: string): string {
  let s = text;
  for (const re of MUSIC) s = s.replace(re, " ");
  return s.replace(/[“”"‘’()]/g, " ").replace(/\s+/g, " ").trim();
}

/** A plain English syllable estimate; good enough for grade levels. */
export function syllables(word: string): number {
  let w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = w.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

export function words(text: string): string[] {
  return clean(text)
    .split(/\s+/)
    .map((w) => w.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, ""))
    .filter((w) => /[A-Za-z]/.test(w));
}

export function sentences(text: string): string[] {
  return clean(text)
    .split(/(?<=[.!?:;])\s+/)
    .map((s) => s.trim())
    .filter((s) => words(s).length > 0);
}

export function grade(text: string): { words: number; sentences: number; syllables: number; grade: number } {
  const w = words(text);
  const s = Math.max(1, sentences(text).length);
  const syl = w.reduce((n, x) => n + syllables(x), 0);
  const g = w.length ? 0.39 * (w.length / s) + 11.8 * (syl / w.length) - 15.59 : 0;
  return { words: w.length, sentences: s, syllables: syl, grade: Math.round(g * 10) / 10 };
}

export function longestSentence(text: string): number {
  return Math.max(0, ...sentences(text).map((s) => words(s).length));
}
