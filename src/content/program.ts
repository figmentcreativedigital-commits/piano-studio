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
    "You are an experienced musician. You studied jazz composition at Berklee, and guitar was your first instrument. You know a lot about how chords work, and you have listened deeply for years. But your piano playing and your music reading are far behind your ear.",
  findings: [
    { area: "Harmony and theory", level: "Advanced", source: "intake" },
    { area: "Ear and line vocabulary", level: "Strong. You built it on guitar.", source: "intake" },
    { area: "Reading", level: "Very slow in both clefs. You need slow tempos.", source: "intake" },
    { area: "Right hand", level: "Probably comfortable. How far it can stretch is still to be measured.", source: "intake" },
    {
      area: "Left hand",
      level: "Keep the thumb off the keys for now. Shapes stay within a 4th, like C up to F. Play in short bits.",
      source: "intake",
    },
    { area: "Time feel", level: "Likely strong from playing gigs. Still to be measured at the keys.", source: "intake" },
  ],
  teaching: [
    "From the start, your right hand plays the lines and Barry Harris chord movement.",
    "Your left hand plays light guide tones and single notes. Use fingers 2–5 only. Keep each note short and on the beat. Bud Powell and Horace Silver often play short left-hand notes like this.",
    "New reading comes in short pieces, 4 bars long, at ♩ = 40–60. You learn most jazz by ear and by hand shape first. The written music is there to check against.",
    "Bach: Invention No. 1 in C major, BWV 772. You learn it in small sections. Each hand plays alone for a long time before you put hands together.",
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
      "You work on a good sound and steady time at the piano. You use them on the three tunes from week 1. First comes the blues in F. Next is the C minor blues, which uses the same Harris scale made minor. Then comes the start of “Indiana”. Its chain of dominants is also the bridge of Rhythm changes. You also learn Lester Young and Charlie Parker by ear, and the start of Bach's first invention and first prelude.",
    jazz: [
      "Barry Harris's C sixth-diminished scale and C6–B° movement. Then the same in F and B♭.",
      "F blues (Week 1): left-hand guide tones, short on beat 1. A right-hand riff takes turns with the left hand.",
      "C minor blues (Week 2): the minor sixth-diminished scale. Only 1 note is different.",
      "“Indiana” in F (Week 3): F6 movement on bar 1. Then the D7–G7–C7 chain, which is also the bridge of Rhythm changes.",
    ],
    tunes: [
      { vehicle: "blues", text: "F blues: 2 choruses, with your hands taking turns." },
      { vehicle: "minor-blues", text: "C minor blues: guide tones, plus Cm6–B° movement in bars 1–4." },
      { vehicle: "indiana", text: "Bars 1–8 in left-hand guide tones. Then the first phrase of Lester's 1942 second solo, by ear, in A♭." },
      { vehicle: "rhythm", text: "The bridge in left-hand guide tones." },
    ],
    bach: [
      "Invention No. 1, BWV 772: bars 1–6 with each hand alone. Then bars 1–2 with hands together.",
      "Prelude No. 1 in C, BWV 846: bars 1–11 as block chords in the right hand. Say each chord's name as you play it.",
    ],
    bird: [
      "“Now's the Time” (1945; Omnibook page 76): sing the melody with the record. Then find it on the piano and check it in the book.",
      "“Billie's Bounce” (1945; page 80): the melody by ear, 2 bars a day.",
      "“Now's the Time” (1953; page 74): Bird's first chorus. On beat 1 of each new chord, which chord tone does he play?",
    ],
    technique: ["Arm-weight touch", "Right-hand thumb travel", "Light left-hand shapes with fingers 2–5"],
    ear: ["Sing it, then play it", "Lester Young, “Oh, Lady Be Good!” (1936): the first phrases, in G, then moved to F", "Lester Young, “Indiana” (1942, with Nat King Cole): the first phrase of his second solo, in A♭", "Hear the chord type: sixth chord or diminished chord"],
    milestone: {
      id: "M1",
      week: 3,
      title: "End of Week 3",
      checks: [
        "C6–B° chord movement in the right hand. Go up and down an octave in half notes at ♩ = 60. Play 3 clean runs in a row. Then play it once from memory the next day.",
        "F blues: 2 choruses with left-hand guide tones and the right-hand riff. Use the click on 2 and 4 at ♩ = 80. Play without stopping.",
        "C minor blues: 1 chorus of left-hand guide tones with the play-along at ♩ = 72.",
        "“Indiana” bars 1–8 and the bridge of Rhythm changes: left-hand guide tones with the play-along at ♩ = 66.",
        "Bach, Invention No. 1, bars 1–6: each hand alone at ♩ = 50. Play 3 clean runs. Then Prelude No. 1, bars 1–11, as block chords from memory.",
        "Sing the melody of “Now's the Time” with the 1945 record. Then play it in the right hand.",
        "By ear, sing and then play Lester's first 2 phrases of “Oh, Lady Be Good!”. Do it in G and in F. Then sing the first phrase of his second solo on “Indiana” (1942) with the record.",
      ],
    },
  },
  {
    id: "P2",
    name: "Lines",
    weeks: [4, 6],
    summary:
      "You build bebop lines that put chord tones on the beat. The lines come from Barry's added-note rules. These rules add extra notes to a scale so the chord tones land on the beat. You hear each rule in Bird's own lines first. Then you use the lines on all three tunes. That means the bebop blues in F, the A sections of Rhythm changes in B♭, and all of “Indiana”. The A sections are the parts that repeat. Your left-hand guide tones move with the chords.",
    jazz: [
      "Barry's added-note rules for the dominant scale. Each rule comes from his own classes before you learn it.",
      "Sixth-diminished movement in B♭, for the A sections of Rhythm changes",
      "The bebop blues: a ii–V into bar 5, the diminished chord in bar 6, and the turnaround. A turnaround is a few chords that lead back home.",
      "A 4-bar line in the style of Bud Powell over the D7–G7–C7–F7 chain. Then a line of your own.",
    ],
    tunes: [
      { vehicle: "blues", text: "The bebop version: 2 choruses of lines." },
      { vehicle: "rhythm", text: "The A sections and the bridge: 1 chorus." },
      { vehicle: "indiana", text: "The whole form in guide tones. Then lines over the chain of dominants." },
      { vehicle: "minor-blues", text: "Lines over A♭7 to G7 in bars 9–10." },
    ],
    bach: [
      "Invention No. 1: bars 7–14 with each hand alone. Bars 1–6 with hands together.",
      "Prelude No. 1: bars 1–19 as written, slowly.",
    ],
    bird: [
      "Barry's added-note rules, heard in Bird's own lines. The phrase guides show where each one happens in your Omnibook.",
      "“Moose the Mooche” (page 4): the melody by ear. Then Bird's first A section.",
      "“Thriving from a Riff” (page 60) and “Anthropology” (page 10, live with Bud Powell): the same tune, 6 years apart.",
      "“Blues for Alice” (page 18): Bird's own blues changes, next to the plain F blues.",
    ],
    technique: ["Steady, even eighth notes in swing", "Left-hand guide tones through ii–V–I", "Thumb-under in right-hand lines"],
    ear: ["Bud Powell, “Wail” (1949): his left hand on the bridge", "Transcribing 2 bars by ear each week"],
    milestone: {
      id: "M2",
      week: 6,
      title: "End of Week 6",
      checks: [
        "F blues: improvise 2 choruses in the right hand. That means you make up the line as you go. Use the added-note rules over left-hand guide tones. Swing at ♩ = 96.",
        "Rhythm changes: 1 chorus at ♩ = 88. Play left-hand guide tones all the way through. Add a right-hand line over the bridge.",
        "“Indiana”: the whole form in left-hand guide tones with the play-along at ♩ = 80.",
        "Bach: Invention No. 1, bars 1–6 hands together at ♩ = 50. Prelude No. 1, bars 1–11 as written at ♩ = 50.",
        "Play Bird's first A section of “Moose the Mooche” with the record, by ear. Then check it in the book.",
      ],
    },
  },
  {
    id: "P3",
    name: "Tunes",
    weeks: [7, 9],
    summary:
      "You learn heads by ear, and the art of comping. A head is the written melody of a jazz tune. Learn the “Donna Lee” head 1 section at a time. Use the 1947 record with Bud Powell on piano. Learn “Lester Leaps In” on Rhythm changes. Study Horace Silver's comping on both blues tunes. Learn Bird's line on “Indiana”. Play Harris short and long voicings in the right hand.",
    jazz: [
      "The “Donna Lee” head by ear, in A♭, 1 section at a time",
      "Harris short and long voicings in the right hand",
      "Comping rhythms: short hits, the Charleston, and anticipations. The Charleston hits on beat 1 and halfway between beats 2 and 3. An anticipation comes in just before the beat.",
      "The minor blues in Silver's 6/8 feel. That's 2 big beats in each bar.",
    ],
    tunes: [
      { vehicle: "indiana", text: "“Donna Lee”: the head by ear in A♭." },
      { vehicle: "rhythm", text: "“Lester Leaps In”: the riff head by ear, then a chorus." },
      { vehicle: "blues", text: "Comping for a chorus, the way Silver does it." },
      { vehicle: "minor-blues", text: "Comping under a melody in 6/8." },
    ],
    bach: [
      "Invention No. 1: bars 15–22 with each hand alone. Bars 7–14 with hands together.",
      "Prelude No. 1: all 35 bars as written.",
      "Invention No. 8 in F, BWV 779: bars 1–4 in the right hand. Sing the left hand.",
    ],
    bird: [
      "“Donna Lee” (page 48): the melody by ear, 1 section at a time. Bud Powell plays piano on this record.",
      "Bar 8 of “Donna Lee” (E♭m to A♭7): Barry taught that Bird played a D7 line over these chords on “Indiana”. Listen for it.",
      "“Chasing the Bird” (page 82): Rhythm changes in F, live in 1949.",
    ],
    technique: ["Voicing the top note, so it sings a little louder", "Repeated chords with control and no tight muscles"],
    ear: ["Sonny Clark Trio (1957) and “Cool Struttin'” (1958)", "Horace Silver: “Doodlin'” and “Señor Blues”"],
    milestone: {
      id: "M3",
      week: 9,
      title: "End of Week 9",
      checks: [
        "“Donna Lee”: the first 16 bars by ear in A♭, right hand, with the record.",
        "Comp 1 chorus on the F blues and 1 chorus on the minor blues. Use short and long voicings, with the play-along.",
        "“Lester Leaps In”: the riff head by ear, then 1 chorus over Rhythm changes.",
        "Bach: Prelude No. 1, all 35 bars at ♩ = 60. Invention No. 1, bars 1–14 hands together at ♩ = 50.",
      ],
    },
  },
  {
    id: "P4",
    name: "Solo Piano",
    weeks: [10, 12],
    summary: "You play the melody and its chords together, alone at the piano. You do this on all three tunes, and you record them, with a Bird chorus you learned by ear. Then you look back at your baseline.",
    jazz: ["“Indiana”: the 1917 melody over guide tones, then a chorus", "The blues: the head and 2 choruses", "Rhythm changes: the head and a chorus", "The minor blues: 1 chorus"],
    tunes: [
      { vehicle: "indiana", text: "The melody and a chorus, solo piano." },
      { vehicle: "blues", text: "The head and 2 choruses." },
      { vehicle: "rhythm", text: "The head and a chorus." },
      { vehicle: "minor-blues", text: "Play 1 chorus." },
    ],
    bach: [
      "Invention No. 1: all 22 bars, hands together as far as you can really play it.",
      "Prelude No. 1: record it.",
      "Invention No. 8: bars 1–12 with each hand alone.",
    ],
    bird: [
      "Learn one whole Bird chorus by ear on each tune: a blues, Rhythm changes and “Donna Lee”. Check each one in the book.",
      "“Parker's Mood” (page 134): a slow blues, for how Bird shapes a phrase.",
    ],
    technique: ["Balance between the hands", "Pedal for smooth, connected notes without blur"],
    ear: ["Moving ideas to new keys", "Comparing your recording with a model recording"],
    milestone: {
      id: "M4",
      week: 12,
      title: "End of Week 12",
      checks: [
        "Record a set. “Indiana”: the melody and a chorus. The F blues: the head and 2 choruses. Rhythm changes: the head and a chorus. The minor blues: a chorus.",
        "Record Bach's Invention No. 1 as far as you can play it solidly, and the whole of Prelude No. 1.",
        "Play one whole Bird chorus with the record, by ear.",
        "Do the baseline check again and compare.",
      ],
    },
  },
];

/** Skills tracked in the evidence ledger. */
export const SKILLS: Record<string, { name: string; area: "technique" | "jazz" | "bach" | "ear" | "reading" | "time" }> = {
  touch: { name: "Arm-weight touch", area: "technique" },
  "rh-thumb": { name: "Right-hand thumb travel", area: "technique" },
  "lh-light": { name: "Light left-hand shapes (fingers 2–5)", area: "technique" },
  "c6dim-line": { name: "C sixth-diminished scale, as a line", area: "jazz" },
  "c6dim-chords": { name: "C6–B° chord movement", area: "jazz" },
  "c6dim-melody": { name: "Putting chords under a melody with movement", area: "jazz" },
  "f6dim-transfer": { name: "Sixth-diminished scale in F", area: "jazz" },
  "blues-guide": { name: "F blues: left-hand guide tones", area: "jazz" },
  "blues-riff": { name: "F blues: right-hand riff", area: "jazz" },
  "blues-ht": { name: "F blues: hands together", area: "jazz" },
  "time-24": { name: "Steady time with the click on 2 and 4", area: "time" },
  "bach-inv1-m1-rh": { name: "Invention 1, measure 1, right hand", area: "bach" },
  "bach-inv1-m1-lh": { name: "Invention 1, measure 1, left hand", area: "bach" },
  "bach-inv1-m1-ht": { name: "Invention 1, measure 1, hands together", area: "bach" },
  "bach-inv1-m2-rh": { name: "Invention 1, measure 2, right hand", area: "bach" },
  "ear-sing": { name: "Sing, then play", area: "ear" },
  "ear-quality": { name: "Sixth or diminished chord, by ear", area: "ear" },
  "lester-1": { name: "Lester, 'Lady Be Good,' first phrase", area: "ear" },
  "reading-treble": { name: "Reading, treble clef", area: "reading" },
  "reading-bass": { name: "Reading, bass clef", area: "reading" },
};
