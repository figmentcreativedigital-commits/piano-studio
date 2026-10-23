import type { Phase } from "./types";

export const PROGRAM = {
  name: "Woodshed",
  tagline: "A practice studio for bebop piano and Bach.",
  student: "Walter Gross",
  timeZone: "America/New_York",
  startDate: "2026-10-24",
  hoursPerWeek: 9,
  /** Default practice windows (local time). Weekday sessions run before the 9–5 workday. */
  schedule: {
    weekday: { start: "07:30", minutes: 60 },
    saturday: { start: "10:00", minutes: 120 },
    sunday: { start: "13:00", minutes: 120 },
  },
  instrument: {
    name: "Casio Privia PX-130",
    notes: [
      "88 weighted, scaled hammer-action keys.",
      "Touch response has three settings plus Off. The setting that gives more volume for less force lets the left hand play lightly.",
      "Built-in metronome; USB port for MIDI.",
      "Damper pedal jack; the optional SP-32 unit adds soft and sostenuto pedals.",
    ],
  },
} as const;

/**
 * Provisional baseline, from the intake answers. Confirmed or revised by the
 * D0 baseline session on day one.
 */
export const BASELINE = {
  status: "provisional" as "provisional" | "confirmed",
  updated: "2026-10-23",
  summary:
    "An experienced musician (Berklee, jazz composition; guitar as first instrument) with advanced harmony and a deep listening background, whose piano technique and reading lag far behind his ear.",
  findings: [
    { area: "Harmony and theory", level: "Advanced", source: "intake" },
    { area: "Ear and line vocabulary", level: "Strong, built on guitar", source: "intake" },
    { area: "Reading", level: "Very slow in both clefs; needs slow tempos", source: "intake" },
    { area: "Right hand", level: "Assumed comfortable; reach to be measured", source: "intake" },
    {
      area: "Left hand",
      level: "Thumb kept off the keys for now; shapes within a fourth; short bouts",
      source: "intake",
    },
    { area: "Time feel", level: "Expected strong from gigging; to be measured at the keys", source: "intake" },
  ],
  teaching: [
    "Right hand carries lines and Barry Harris chord movement from the start.",
    "Left hand plays light guide tones and single notes with fingers 2–5, short on the beat, the way Bud Powell and Horace Silver often punctuate.",
    "New reading arrives in four-bar pieces at ♩ = 40–60, and most jazz material is taught by ear and shape first, with notation as the reference.",
    "Bach: Invention No. 1 in C major, BWV 772, learned in small sections, hands separately long before hands together.",
  ],
};

/** Week colors for lesson sleeves, chosen to read well with dark ink and white type. */
export const WEEK_COLORS = [
  "#2B44D8", // W1 ultramarine
  "#C2410C", // W2 burnt orange
  "#0F766E", // W3 teal
  "#6D28D9", // W4 violet
  "#B45309", // W5 amber
  "#1D4ED8", // W6 cobalt
  "#9F1239", // W7 crimson
  "#3F6212", // W8 olive
  "#0E7490", // W9 cyan
  "#7C2D12", // W10 rust
  "#4338CA", // W11 indigo
  "#111827", // W12 ink
];

export const PHASES: Phase[] = [
  {
    id: "P1",
    name: "The Bench",
    weeks: [1, 3],
    summary:
      "Sound and time at the keyboard. The sixth-diminished scale in the right hand, the blues form under light left-hand guide tones, Lester Young by ear, and the opening of Bach's first invention.",
    jazz: [
      "C major sixth-diminished scale as a line and as chord movement (Barry Harris)",
      "F blues: left-hand guide tones, short on beat 1; a right-hand riff that takes turns with the left",
      "Harmonizing a short melody with sixth and diminished chords",
      "Transfer to F and B♭",
    ],
    bach: ["Invention No. 1, BWV 772: mm. 1–4, each hand alone, then m. 1 hands together"],
    technique: ["Arm-weight touch", "Thumb travel in the right hand", "Light left-hand shapes with fingers 2–5"],
    ear: ["Sing then play", "Lester Young, 'Oh, Lady Be Good!' (1936), first phrases", "Chord quality by ear: sixth or diminished"],
    milestone: {
      id: "M1",
      week: 3,
      title: "End of Week 3",
      checks: [
        "C6–B° chord movement, right hand, up and down one octave in half notes at ♩ = 60, three clean runs in a row, and once from memory the next day.",
        "F blues: two choruses with left-hand guide tones and the right-hand riff, click on 2 and 4 at ♩ = 80, without stopping.",
        "Bach, Invention No. 1, mm. 1–4, each hand alone at ♩ = 50, three clean runs.",
        "Sing and then play Lester's first two phrases by ear.",
      ],
    },
  },
  {
    id: "P2",
    name: "Lines",
    weeks: [4, 6],
    summary:
      "Bebop lines that land chord tones on the beat, built from Harris's scale rules, over the blues and ii–V–I in F and B♭. Left-hand guide tones start to move with the harmony.",
    jazz: [
      "Harris dominant scale with added half steps, verified against his own teaching before use",
      "Sixth-diminished movement in F and B♭",
      "A four-bar line in the style of Bud Powell, then your own",
      "Lester phrases moved to a second key",
    ],
    bach: ["mm. 1–8 hands separately; mm. 1–4 hands together"],
    technique: ["Eighth-note evenness in swing", "Left-hand guide tones through ii–V–I", "Thumb-under in right-hand lines"],
    ear: ["Bud Powell, 1949 trio sides", "Transcribing two bars by ear each week"],
    milestone: {
      id: "M2",
      week: 6,
      title: "End of Week 6",
      checks: [
        "Two choruses of F blues improvised in the right hand with Harris scale rules over left-hand guide tones, ♩ = 96 swing.",
        "A Lester phrase by ear in two keys.",
        "Bach mm. 1–4 hands together at ♩ = 50.",
      ],
    },
  },
  {
    id: "P3",
    name: "Tunes",
    weeks: [7, 9],
    summary:
      "A standard from the Sonny Clark and Horace Silver orbit. Harris short and long voicings in the right hand, Silver-style comping rhythms, and longer lines in the manner of Sonny Clark.",
    jazz: [
      "Head and changes of one standard, chosen together",
      "Harris short and long voicings (right hand)",
      "Comping rhythms: short punctuations, Charleston, anticipations",
    ],
    bach: ["mm. 1–14 hands separately; mm. 1–8 hands together"],
    technique: ["Voicing the top note", "Repeated-chord control without tension"],
    ear: ["Sonny Clark Trio (1957)", "Horace Silver's comping behind horns"],
    milestone: {
      id: "M3",
      week: 9,
      title: "End of Week 9",
      checks: [
        "The head and one chorus of solo on the chosen tune, with left-hand guide tones.",
        "One chorus comping with short and long voicings against a recording or backing track.",
      ],
    },
  },
  {
    id: "P4",
    name: "Solo Piano",
    weeks: [10, 12],
    summary:
      "Melody and accompaniment in one pair of hands. A first solo-piano arrangement, a recorded performance, and a look back at the baseline.",
    jazz: ["Melody over single bass notes and guide tones", "Two-chorus solo on the blues", "Short arrangement of the standard"],
    bach: ["Invention No. 1 complete hands separately; hands together as far as the evidence supports"],
    technique: ["Balance between hands", "Pedal for legato without blur (if a damper pedal is available)"],
    ear: ["Transfer tasks in new keys", "Comparing your recording with a reference"],
    milestone: {
      id: "M4",
      week: 12,
      title: "End of Week 12",
      checks: [
        "A recorded performance: blues (head and two choruses) and the standard.",
        "Bach Invention No. 1 recorded as far as it is secure.",
        "Baseline repeated and compared.",
      ],
    },
  },
];

/** Skills tracked in the evidence ledger. */
export const SKILLS: Record<string, { name: string; area: "technique" | "jazz" | "bach" | "ear" | "reading" | "time" }> = {
  touch: { name: "Arm-weight touch", area: "technique" },
  "rh-thumb": { name: "Right-hand thumb travel", area: "technique" },
  "lh-light": { name: "Light left-hand shapes (fingers 2–5)", area: "technique" },
  "c6dim-line": { name: "C6-diminished scale, line", area: "jazz" },
  "c6dim-chords": { name: "C6–B° chord movement", area: "jazz" },
  "c6dim-melody": { name: "Harmonizing a melody with movement", area: "jazz" },
  "f6dim-transfer": { name: "Sixth-diminished in F", area: "jazz" },
  "blues-guide": { name: "F blues: left-hand guide tones", area: "jazz" },
  "blues-riff": { name: "F blues: right-hand riff", area: "jazz" },
  "blues-ht": { name: "F blues: hands together", area: "jazz" },
  "time-24": { name: "Time against 2 and 4", area: "time" },
  "bach-inv1-m1-rh": { name: "Invention 1, m. 1 right hand", area: "bach" },
  "bach-inv1-m1-lh": { name: "Invention 1, m. 1 left hand", area: "bach" },
  "bach-inv1-m1-ht": { name: "Invention 1, m. 1 hands together", area: "bach" },
  "bach-inv1-m2-rh": { name: "Invention 1, m. 2 right hand", area: "bach" },
  "ear-sing": { name: "Sing, then play", area: "ear" },
  "ear-quality": { name: "Sixth or diminished, by ear", area: "ear" },
  "lester-1": { name: "Lester, 'Lady Be Good,' first phrase", area: "ear" },
  "reading-treble": { name: "Reading, treble clef", area: "reading" },
  "reading-bass": { name: "Reading, bass clef", area: "reading" },
};
