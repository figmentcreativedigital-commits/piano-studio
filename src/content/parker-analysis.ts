/*
 * GENERATED: what a note-by-note reading of all 40 Omnibook solos on our three tunes shows,
 * counted through Barry Harris's ideas. Counts and places only; no notes are listed.
 * Examples marked `checked` were looked at again on the page by hand.
 */
export interface SpotRef {
  slug: string;
  page: number;
  line: number;
  bar: number;
  text?: string;
  checked?: boolean;
}

export interface Habit {
  id: string;
  /** A short figure, e.g. "71%". */
  big: string;
  label: string;
  text: string;
  examples: SpotRef[];
}

export interface Concept {
  id: string;
  /** barryharrismethod.com step number, e.g. "5.3". */
  step: string;
  name: string;
  barry: string;
  link: string;
  count: number;
  bird: string;
  examples: SpotRef[];
}

export interface ParkerAnalysis {
  solos: number;
  bars: number;
  notes: number;
  habits: Habit[];
  concepts: Concept[];
}

export const PARKER_ANALYSIS: ParkerAnalysis = { solos: 0, bars: 0, notes: 0, habits: [], concepts: [] };
