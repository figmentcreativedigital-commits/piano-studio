/**
 * Text for speech, shared by the browser and the narration server so both
 * agree on exactly what is spoken and how each passage is keyed.
 */

const ROOT = "([A-G])(♭|♯|b|#)?";
const ACC: Record<string, string> = { "♭": " flat", b: " flat", "♯": " sharp", "#": " sharp" };

/** Musical shorthand → words for a speech engine. Pure, so it's tested. */
export function toSpeech(input: string): string {
  let s = ` ${input} `;
  s = s.replace(/\bW0?(\d+)\s*D0?(\d+)\b/g, "Week $1, Day $2");
  s = s.replace(/♩\s*=\s*/g, "quarter note equals ");
  s = s.replace(/♩/g, "quarter note");
  s = s.replace(/\bmm\.\s*(\d+)\s*[–-]\s*(\d+)/g, "measures $1 to $2");
  s = s.replace(/\bmm\.\s*/g, "measures ");
  s = s.replace(/\bm\.\s*(\d+)/g, "measure $1");
  s = s.replace(/\bpp\.\s*(\d+)\s*[–-]\s*(\d+)/g, "pages $1 to $2");
  s = s.replace(/\bp\.\s*(\d+)/g, "page $1");
  s = s.replace(/\bBWV\b/g, "B W V");
  s = s.replace(/\bRH\b/g, "right hand");
  s = s.replace(/\bLH\b/g, "left hand");
  s = s.replace(/\bii[–-]V[–-]I\b/g, "two five one");
  s = s.replace(/\bii[–-]V\b/g, "two five");
  s = s.replace(/\bii7\b/g, "two seven");
  // Chord qualities, before plain accidentals.
  s = s.replace(new RegExp(`\\b${ROOT}m7(♭|b)5`, "g"), (_, l, a) => `${l}${a ? ACC[a] : ""} minor seven flat five`);
  s = s.replace(new RegExp(`\\b${ROOT}maj7`, "g"), (_, l, a) => `${l}${a ? ACC[a] : ""} major seven`);
  s = s.replace(new RegExp(`\\b${ROOT}m(\\d)`, "g"), (_, l, a, n) => `${l}${a ? ACC[a] : ""} minor ${n}`);
  s = s.replace(new RegExp(`\\b${ROOT}°7?`, "g"), (_, l, a) => `${l}${a ? ACC[a] : ""} diminished`);
  s = s.replace(new RegExp(`\\b${ROOT}ø7?`, "g"), (_, l, a) => `${l}${a ? ACC[a] : ""} half-diminished`);
  s = s.replace(/°/g, " diminished");
  // Pitches and chords: a letter, an accidental, a number ("A♭4", "B♭7", "C6").
  s = s.replace(new RegExp(`\\b${ROOT}(\\d)\\b`, "g"), (_, l, a, n) => `${l}${a ? ACC[a] : ""} ${n}`);
  s = s.replace(/([A-G])𝄫/g, "$1 double flat");
  s = s.replace(/([A-G])♭/g, "$1 flat");
  s = s.replace(/([A-G])♯/g, "$1 sharp");
  s = s.replace(/♭(\d)/g, "flat $1");
  s = s.replace(/♯(\d)/g, "sharp $1");
  // Fingerings: 1-2-3-4 → 1, 2, 3, 4
  s = s.replace(/\b\d(?:-\d)+\b/g, (m) => m.split("-").join(", "));
  // Ranges and dashes
  s = s.replace(/(\d)\s*–\s*(\d)/g, "$1 to $2");
  s = s.replace(/([A-Za-z0-9])–([A-Za-z])/g, "$1 to $2");
  s = s.replace(/\s+[–—]\s+/g, ", ");
  s = s.replace(/\s*→\s*/g, ", then ");
  s = s.replace(/\s*·\s*/g, ", ");
  s = s.replace(/×/g, " times ");
  s = s.replace(/\s*\|\s*/g, ", ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

/** A short stable key for a passage, from its spoken form (cyrb53, base 36). */
export function speechKey(text: string): string {
  const str = toSpeech(text);
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/** Props that mark an element for read-aloud with an exact passage. */
export function readable(text: string): { "data-read": string; "data-read-text": string } {
  return { "data-read": "", "data-read-text": text };
}
