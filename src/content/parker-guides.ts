/*
 * GENERATED from a note-by-note reading of the concert-key Omnibook (private data, not in
 * this repo). Each entry describes one phrase in words: where it is, which chord tones it
 * starts and ends on, and which of Barry Harris's devices it uses. No notes are listed.
 */
export interface GuidePhrase {
  sec: "head" | "solo";
  chorus: number;
  page: number;
  line: number;
  bar: number;
  where: string;
  text: string;
}

export const PARKER_GUIDES: Record<string, GuidePhrase[]> = {};
