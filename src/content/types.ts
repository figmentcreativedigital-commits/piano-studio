/**
 * Content schema for Woodshed.
 *
 * Lessons and exercises are teacher-authored data. The app renders them,
 * the planner sequences them, and the calendar descriptions are derived
 * from them, so every surface shows the same notes, fingerings and times.
 *
 * Pitch names use scientific pitch notation: C4 is middle C.
 * Finger numbers are 1 (thumb) to 5 (little finger) and never mean scale degrees.
 */

export type Hand = "RH" | "LH" | "both";

/** Where a piece of material comes from. Shown on every exercise. */
export type SourceKind =
  | "harris" // a Barry Harris concept, as documented in his teaching
  | "adaptation" // my exercise built on a named concept or source
  | "original" // an original study written for this course
  | "bach" // notes from J.S. Bach's score
  | "recording" // a listening task tied to a specific, verified recording
  | "baseline"; // the diagnostic

export interface Source {
  kind: SourceKind;
  /** One line a reader can check. */
  note: string;
  /** How well the claim is verified. */
  status?: "verified" | "checked-in-class" | "secondary-sources" | "pending-primary-check";
  refs?: { label: string; url?: string }[];
}

export type BlockKind =
  | "checkin"
  | "setup"
  | "technique"
  | "jazz"
  | "harris"
  | "blues"
  | "bach"
  | "ear"
  | "listening"
  | "reading"
  | "baseline"
  | "review"
  | "free"
  | "break"
  | "retrieval";

/** A chord written as pitch names, e.g. ["C4","E4","G4","A4"]. */
export interface ChordSpec {
  notes: string[];
  /** Length in quarter notes. */
  beats: number;
  symbol?: string;
  fingers?: number[];
}

export interface NotationSpec {
  meter?: string; // default 4/4
  /** ABC unit note length, e.g. "1/4". */
  unit: string;
  key: string; // ABC key, e.g. "C", "F", "Bb"
  tempo: number; // quarter notes per minute
  tempoText?: string;
  swing?: boolean;
  /** Click pattern during playback. */
  clickMode?: "every" | "twofour";
  /** Single staff. */
  bars?: string[];
  clef?: "treble" | "bass";
  /** Grand staff. */
  rh?: string[];
  lh?: string[];
  /** Generated from pitch names (single staff, right hand unless clef is bass). */
  chords?: ChordSpec[];
  /** Raw body for special cases such as repeat signs. */
  raw?: string;
  /** Barline after each bar, e.g. "||" at the end of a section. Defaults to "|". */
  barlines?: string[];
  /** Extra ABC directives placed after the key line. */
  directives?: string[];
  /** Wrap at most this many bars per system on wide screens. */
  barsPerLine?: number;
  /** Dense material wraps sooner on narrow screens. */
  dense?: boolean;
  /** Playback gain per voice, RH first. */
  gain?: number[];
  /** Which hand plays by default when the exercise has both staves. */
  defaultHands?: Hand;
}

export interface KeyboardSpec {
  from: string;
  to: string;
  /** [pitch, hand, label] — label is a finger number unless noted. */
  marks?: [string, "R" | "L", string][];
  /** Neutral outlined markers, e.g. a starting note. */
  targets?: [string, string][];
  caption: string;
}

export interface Exercise {
  id: string;
  title: string;
  /** Short line under the title. */
  subtitle?: string;
  kind: BlockKind;
  source: Source;
  hands: Hand;
  /** The tune this exercise applies its material to, if any. */
  vehicle?: VehicleId;
  /** Plain-language spelling of the material, so nothing depends on reading notation. */
  spelling?: string;
  fingering?: string;
  key?: string;
  tempo: { start: number; target?: number; note?: string };
  reps: string;
  /** Ordered practice steps. */
  steps: string[];
  listenFor?: string;
  feelFor?: string;
  errors: string[];
  cue: string;
  /** Measurable completion check. */
  check: string;
  easier: string;
  harder?: string;
  /** For left-hand material: what to do if the thumb base aches. */
  lhCare?: string;
  notation?: NotationSpec;
  /** Hide notation until the player chooses to show it (ear and recall tasks). */
  hideNotation?: boolean;
  keyboard?: KeyboardSpec[];
  /** Listening tasks. */
  recording?: RecordingRef;
  /** Skills this exercise builds; drives review scheduling. */
  skills: string[];
  /** Internal link, e.g. to the baseline page. */
  link?: { label: string; href: string };
}

export interface RecordingRef {
  artist: string;
  title: string;
  album: string;
  recorded: string;
  personnel?: string;
  label?: string;
  /** Where to start listening, with how the cue was verified. */
  cue?: string;
  question: string;
  sourceUrl?: string;
}

export interface Block {
  id: string;
  kind: BlockKind;
  title: string;
  minutes: number;
  /** Side A or B for two-hour sessions. */
  side?: "A" | "B";
  exerciseIds?: string[];
  /** Instructions for this block, in order. */
  text: string[];
}

export interface Lesson {
  id: string; // e.g. "W01D01"
  week: number;
  day: number;
  /** Local date in America/New_York, YYYY-MM-DD. */
  date: string;
  /** Local start time, HH:MM, America/New_York. */
  start: string;
  minutes: 60 | 120;
  title: string;
  objective: string;
  prerequisites: string[];
  /** Why the time is split the way it is. */
  balance: string;
  blocks: Block[];
  /** A short musical application of the day's material. */
  application: string;
  /** Final retrieval or recording task. */
  retrieval: string;
  /** 15–20 minute alternative session for busy days. */
  essential: { minutes: number; blocks: Block[] };
  /** Main skills; outcomes logged in the check-in. */
  focus: string[];
  /** The tunes this lesson's material is applied to. Only the baseline day may leave this empty. */
  applies: VehicleId[];
  /** Sleeve design; filled in from SLEEVE_THEMES when not set. */
  theme?: SleeveTheme;
}

/** Named inks from the cover. See globals.css. */
export type Ink = "cobalt" | "cyan" | "orchid" | "white" | "navy" | "night" | "slate" | "steel" | "ice";

export interface SleeveTheme {
  bg: Ink;
  ink: Ink;
  acc: Ink;
  /** The color field the sleeve sits on in a hero. */
  field: Ink;
}

/**
 * The three application vehicles. Every technique in the program is put to
 * work on one of these: Rhythm changes, the blues (major and minor), and
 * "Indiana" with "Donna Lee", its bebop line.
 */
export type VehicleId = "rhythm" | "blues" | "minor-blues" | "indiana";

export interface ChartSection {
  /** Rehearsal letter as written on the part: A, B, C. */
  mark?: string;
  /** One chord symbol per bar; two in a bar are separated by a space. */
  bars: string[];
  repeat?: boolean;
}

export interface VehicleRecording {
  artist: string;
  title: string;
  recorded: string;
  detail: string;
  note: string;
  sourceUrl?: string;
}

export interface Vehicle {
  id: VehicleId;
  /** The family, e.g. "Rhythm changes". */
  name: string;
  /** The parent tune. */
  tune: string;
  key: string;
  /** abcjs key for the chart. */
  abcKey: string;
  form: string;
  tempo: number;
  summary: string;
  chart: ChartSection[];
  /** What the program puts on this tune, phase by phase. */
  uses: { phase: string; text: string }[];
  /** Tunes built on the same changes. */
  family: string[];
  recordings: VehicleRecording[];
  theme: SleeveTheme;
  /** A second key for the same chart, e.g. "Donna Lee" in A♭. */
  alt?: { label: string; key: string; abcKey: string; steps: number; semitones: number; note: string };
  source: { note: string; url?: string };
}

export interface Milestone {
  id: string;
  week: number;
  title: string;
  checks: string[];
}

export interface Phase {
  id: string;
  name: string;
  weeks: [number, number];
  summary: string;
  jazz: string[];
  bach: string[];
  /** Charlie Parker study: Omnibook solos on the three tunes (concert-key page numbers). */
  bird: string[];
  technique: string[];
  ear: string[];
  /** How each of the three tunes is used in this phase. */
  tunes: { vehicle: VehicleId; text: string }[];
  milestone: Milestone;
}
