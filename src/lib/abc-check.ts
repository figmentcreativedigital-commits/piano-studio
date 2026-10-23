/**
 * Minimal ABC duration checker for the subset this course uses:
 * notes, rests, chords in brackets, accidentals, octave marks, decorations,
 * chord symbols, and lengths such as 2, /, /2, 3/2.
 * Returns the length of a bar in quarter notes.
 */

function parseLength(s: string, i: number): [number, number] {
  // Returns [multiplier, nextIndex]
  let num = "";
  while (i < s.length && /\d/.test(s[i])) num += s[i++];
  let mult = num ? parseInt(num, 10) : 1;
  if (s[i] === "/") {
    let slashes = 0;
    while (s[i] === "/") {
      slashes++;
      i++;
    }
    let den = "";
    while (i < s.length && /\d/.test(s[i])) den += s[i++];
    if (den) mult = mult / parseInt(den, 10) / Math.pow(2, slashes - 1);
    else mult = mult / Math.pow(2, slashes);
  }
  return [mult, i];
}

export function barLength(bar: string, unit: string): number {
  const [un, ud] = unit.split("/").map(Number);
  const unitQ = (4 * un) / ud;
  let total = 0;
  let i = 0;
  const s = bar;
  while (i < s.length) {
    const c = s[i];
    if (c === "!") {
      const j = s.indexOf("!", i + 1);
      if (j < 0) throw new Error(`Unclosed decoration in "${bar}"`);
      i = j + 1;
      continue;
    }
    if (c === '"') {
      const j = s.indexOf('"', i + 1);
      if (j < 0) throw new Error(`Unclosed chord symbol in "${bar}"`);
      i = j + 1;
      continue;
    }
    if (c === "[") {
      const j = s.indexOf("]", i + 1);
      if (j < 0) throw new Error(`Unclosed chord in "${bar}"`);
      const inner = s.slice(i + 1, j);
      if (!/[A-Ga-g]/.test(inner)) throw new Error(`Empty chord in "${bar}"`);
      const [m, k] = parseLength(s, j + 1);
      total += m * unitQ;
      i = k;
      continue;
    }
    if (c === "^" || c === "_" || c === "=") {
      i++;
      continue;
    }
    if (/[A-Ga-gzx]/.test(c)) {
      i++;
      while (s[i] === "," || s[i] === "'") i++;
      const [m, k] = parseLength(s, i);
      total += m * unitQ;
      i = k;
      continue;
    }
    if (/[\s\-()]/.test(c)) {
      i++;
      continue;
    }
    throw new Error(`Unexpected "${c}" in bar "${bar}"`);
  }
  return total;
}

/** Splits a raw body like "|: a b :|" into bars, dropping barline tokens. */
export function splitRaw(raw: string): string[] {
  return raw
    .split(/\|\]|:\||\|:|\|/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);
}
