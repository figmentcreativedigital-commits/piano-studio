import type { SleeveTheme, Phase } from "./types";

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

/**
 * Sleeve designs, all drawn from the cover's inks. A lesson's sleeve is chosen
 * by week and day, so each record in a week looks different and each week
 * starts one design later. Ink on ground is at least 4.5:1 in every pairing.
 */
export const SLEEVE_THEMES: SleeveTheme[] = [
  { bg: "cobalt", ink: "white", acc: "cyan", field: "cyan" },
  { bg: "night", ink: "cyan", acc: "orchid", field: "cyan" },
  { bg: "white", ink: "cobalt", acc: "orchid", field: "cyan" },
  { bg: "navy", ink: "white", acc: "cyan", field: "cyan" },
  { bg: "orchid", ink: "night", acc: "white", field: "navy" },
  { bg: "cyan", ink: "night", acc: "cobalt", field: "navy" },
  { bg: "slate", ink: "ice", acc: "orchid", field: "cyan" },
];

export function sleeveTheme(week: number, day: number): SleeveTheme {
  return SLEEVE_THEMES[(week - 1 + day - 1) % SLEEVE_THEMES.length];
}

/** One field per phase on the roadmap timeline. */
export const PHASE_THEMES: Record<string, SleeveTheme> = {
  P1: { bg: "cobalt", ink: "white", acc: "cyan", field: "cyan" },
  P2: { bg: "cyan", ink: "night", acc: "cobalt", field: "navy" },
  P3: { bg: "orchid", ink: "night", acc: "white", field: "navy" },
  P4: { bg: "navy", ink: "white", acc: "cyan", field: "cyan" },
};

export const PHASES: Phase[] = [
  {
    id: "P1",
    name: "The Bench",
    weeks: [1, 3],
    summary:
      "Sound and time at the keyboard, put to work on the three tunes from the first week: the blues in F, the same Harris scale turned minor for the C minor blues, and the opening of “Indiana”, whose chain of dominants is also the Rhythm bridge. Lester Young by ear, and the opening of Bach's first invention.",
    jazz: [
      "C sixth-diminished scale and C6–B° movement (Barry Harris), then F and B♭",
      "F blues: left-hand guide tones short on beat 1, and a right-hand riff that takes turns with the left (Week 1)",
      "C minor blues: the minor sixth-diminished scale, one note different (Week 2)",
      "“Indiana” in F: F6 movement on bar 1, then the D7–G7–C7 chain, which is also the Rhythm bridge (Week 3)",
    ],
    tunes: [
      { vehicle: "blues", text: "F blues, two choruses, hands taking turns." },
      { vehicle: "minor-blues", text: "C minor blues: guide tones, and Cm6–B° movement on bars 1–4." },
      { vehicle: "indiana", text: "Bars 1–8 in left-hand guide tones." },
      { vehicle: "rhythm", text: "The bridge in left-hand guide tones." },
    ],
    bach: ["Invention No. 1, BWV 772: mm. 1–4, each hand alone, then m. 1 hands together"],
    technique: ["Arm-weight touch", "Thumb travel in the right hand", "Light left-hand shapes with fingers 2–5"],
    ear: ["Sing then play", "Lester Young, “Oh, Lady Be Good!” (1936), first phrases, in G and moved to F", "Lester Young, “Indiana” (1942)", "Chord quality by ear: sixth or diminished"],
    milestone: {
      id: "M1",
      week: 3,
      title: "End of Week 3",
      checks: [
        "C6–B° chord movement, right hand, up and down one octave in half notes at ♩ = 60, three clean runs in a row, and once from memory the next day.",
        "F blues: two choruses with left-hand guide tones and the right-hand riff, click on 2 and 4 at ♩ = 80, without stopping.",
        "C minor blues: one chorus of left-hand guide tones with the play-along at ♩ = 72.",
        "“Indiana” bars 1–8 and the Rhythm bridge: left-hand guide tones with the play-along at ♩ = 66.",
        "Bach, Invention No. 1, mm. 1–4, each hand alone at ♩ = 50, three clean runs.",
        "Sing and then play Lester's first two phrases by ear, in G and in F.",
      ],
    },
  },
  {
    id: "P2",
    name: "Lines",
    weeks: [4, 6],
    summary:
      "Bebop lines that put chord tones on the beat, built from Barry's added-note rules, over all three tunes: the bebop blues in F, the Rhythm A sections in B♭, and the whole of “Indiana”. Left-hand guide tones move with the harmony.",
    jazz: [
      "Barry's added-note rules for the dominant scale, taken from his classes before they're taught",
      "Sixth-diminished movement in B♭ for the Rhythm A sections",
      "The bebop blues: a ii–V into bar 5, the diminished chord in bar 6, the turnaround",
      "A four-bar line in the style of Bud Powell over the D7–G7–C7–F7 chain, then your own",
    ],
    tunes: [
      { vehicle: "blues", text: "The bebop version, two choruses of lines." },
      { vehicle: "rhythm", text: "The A sections and the bridge, one chorus." },
      { vehicle: "indiana", text: "The whole form in guide tones; lines over the chain of dominants." },
      { vehicle: "minor-blues", text: "Lines over A♭7 to G7, bars 9–10." },
    ],
    bach: ["mm. 1–8 hands separately; mm. 1–4 hands together"],
    technique: ["Eighth-note evenness in swing", "Left-hand guide tones through ii–V–I", "Thumb-under in right-hand lines"],
    ear: ["Bud Powell, “Wail” (1949): the left hand on the bridge", "Transcribing two bars by ear each week"],
    milestone: {
      id: "M2",
      week: 6,
      title: "End of Week 6",
      checks: [
        "Two choruses of the F blues improvised in the right hand with the added-note rules over left-hand guide tones, ♩ = 96 swing.",
        "Rhythm changes: one chorus, left-hand guide tones throughout, a right-hand line over the bridge, ♩ = 88.",
        "“Indiana”: the whole form in left-hand guide tones with the play-along at ♩ = 80.",
        "Bach mm. 1–4 hands together at ♩ = 50.",
      ],
    },
  },
  {
    id: "P3",
    name: "Tunes",
    weeks: [7, 9],
    summary:
      "Heads by ear and the art of comping. The “Donna Lee” head a section at a time, from the 1947 record with Bud Powell on piano; “Lester Leaps In” on Rhythm changes; Horace Silver's comping on both blues; Harris short and long voicings in the right hand.",
    jazz: [
      "“Donna Lee” head by ear, in A♭, a section at a time",
      "Harris short and long voicings (right hand)",
      "Comping rhythms: short punctuations, the Charleston, anticipations",
      "The minor blues in Silver's 6/8 feel",
    ],
    tunes: [
      { vehicle: "indiana", text: "“Donna Lee”: the head by ear in A♭." },
      { vehicle: "rhythm", text: "“Lester Leaps In”: the riff head by ear, then a chorus." },
      { vehicle: "blues", text: "Comping a chorus, Silver-style." },
      { vehicle: "minor-blues", text: "Comping under a melody in 6/8." },
    ],
    bach: ["mm. 1–14 hands separately; mm. 1–8 hands together"],
    technique: ["Voicing the top note", "Repeated-chord control without tension"],
    ear: ["Sonny Clark Trio (1957) and “Cool Struttin'” (1958)", "Horace Silver: “Doodlin'” and “Señor Blues”"],
    milestone: {
      id: "M3",
      week: 9,
      title: "End of Week 9",
      checks: [
        "“Donna Lee”: the first 16 bars by ear in A♭, right hand, with the record.",
        "One chorus comping on the F blues and one on the minor blues, short and long voicings, with the play-along.",
        "“Lester Leaps In”: the riff head by ear, then one chorus over Rhythm changes.",
      ],
    },
  },
  {
    id: "P4",
    name: "Solo Piano",
    weeks: [10, 12],
    summary: "Melody and accompaniment in one pair of hands, on all three tunes, recorded. A look back at the baseline.",
    jazz: ["“Indiana”: the 1917 melody over guide tones, then a chorus", "The blues: head and two choruses", "Rhythm changes: head and a chorus", "The minor blues: one chorus"],
    tunes: [
      { vehicle: "indiana", text: "Melody and a chorus, solo piano." },
      { vehicle: "blues", text: "Head and two choruses." },
      { vehicle: "rhythm", text: "Head and a chorus." },
      { vehicle: "minor-blues", text: "One chorus." },
    ],
    bach: ["Invention No. 1 complete hands separately; hands together as far as the evidence supports"],
    technique: ["Balance between hands", "Pedal for legato without blur"],
    ear: ["Transfer tasks in new keys", "Comparing your recording with a reference"],
    milestone: {
      id: "M4",
      week: 12,
      title: "End of Week 12",
      checks: [
        "A recorded set: “Indiana” (melody and a chorus), the F blues (head and two choruses), Rhythm changes (head and a chorus), the minor blues (a chorus).",
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
