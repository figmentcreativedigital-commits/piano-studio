/*
 * The Method page, as data, so the same words are rendered and narrated.
 * Inline emphasis: **bold** and *italic*.
 */

export interface MethodSection {
  heading: string;
  paragraphs: string[];
  list?: { term: string; text: string }[];
  after?: string[];
}

export const METHOD_TITLE = "Method";

export const METHOD_INTRO =
  "Woodshed is a practice studio built for one student: an experienced musician whose ears and harmony are far ahead of his hands at the piano. Here's how it teaches, where its material comes from, and what happens to the data.";

export const METHOD: MethodSection[] = [
  {
    heading: "A session",
    paragraphs: [
      "Every session is written out in full and timed to the minute, breaks and the check-in included: sixty minutes on weekdays, two hours on weekends, presented as an LP with its tracklist. Weekend sessions have a side A and a side B with a real break in between.",
      "Each exercise follows the same cycle where it fits: hear it, sing it, play it, vary it, then play it once from memory. Each one names its fingering, starting tempo, common errors, a single corrective cue, an easier version, and a check you can actually verify, such as three clean runs in a row followed by one from memory the next day. A 15–20 minute essential version replaces the session on a busy day; nothing carries over as homework.",
    ],
  },
  {
    heading: "Three tunes",
    paragraphs: [
      "Every technique is applied to the same three tunes: Rhythm changes, the blues in major and minor, and “Indiana” with “Donna Lee”, its bebop line. They hold most of bebop's harmony between them, and they connect: the chain of dominants that opens “Indiana” is the bridge of Rhythm changes, and the C minor blues uses Week 1's scale with one note changed. Each lesson names the tunes it's applied to, and an automated check fails if one doesn't. The Tunes page engraves each set of changes with left-hand guide tones and plays it back at any tempo.",
    ],
  },
  {
    heading: "Barry Harris at the center",
    paragraphs: [
      "The jazz curriculum is built on Barry Harris's teaching: the sixth-diminished scale, chord movement, scales that land chord tones on the beat. Bud Powell, Horace Silver and Sonny Clark are the models, with Lester Young as the source of phrasing.",
      "Every exercise carries a label: **Barry Harris** for his concepts, **Adaptation** for exercises built on them, **Original study**, **Bach score**, or **Recording**. Each label also says how well the claim is verified. Where a Harris idea has been checked against Barry's own words in class, the label says so and links to the moment in the recording; where it rests only on secondary sources, the label says that instead. The Barry Book, a free collaborative textbook of his system, is a second reference, with chapters on the blues, Rhythm and “Indiana”.",
    ],
  },
  {
    heading: "The left hand",
    paragraphs: [
      "For now the left hand works with fingers 2 to 5 and short, light attacks, and the left thumb stays off the keys. The right hand carries the lines. That suits the style more than it limits it: Bud Powell and Horace Silver often punctuate with brief left-hand chords under long right-hand lines. Any ache switches the next two sessions to right-hand-only versions.",
    ],
  },
  {
    heading: "Evidence, not timers",
    paragraphs: [
      "A finished timer proves nothing. After each session a check-in takes under a minute: minutes played, how each focus skill went (steady, close, not yet), comfort, and the main difficulty. The planner reads it and decides the next step.",
    ],
    list: [
      { term: "Missed a day", text: "the sequence resumes where you left off. Nothing doubles up." },
      { term: "Away more than four days", text: "a ten-minute re-entry check comes first." },
      { term: "‘Not yet’", text: "that skill's exercises open with their easier version." },
      { term: "Steady on two different days", text: "the skill is retained, and its review interval doubles." },
    ],
    after: ["Every change shows its reason and can be reversed. Self-ratings are labeled as self-ratings. Nothing is presented as measured unless it was."],
  },
  {
    heading: "MIDI",
    paragraphs: [
      "With the piano connected by USB to Chrome, Edge or Firefox on a computer, the keyboard diagrams light up as you play. Follow mode waits for the right notes before moving on, which helps slow reading. It checks pitches only. It can't assess fingering, posture, tension, touch or swing, and the app doesn't claim to. Safari and iPad browsers don't offer Web MIDI, and everything else works without it.",
    ],
  },
  {
    heading: "Accessibility",
    paragraphs: [
      "Every page can be read aloud, a section at a time, with the part being read highlighted. The narrator is a studio voice: each passage of lesson text is voiced once by Google's text-to-speech and kept, and your practice data is never sent. Where the narrator isn't available, your device's own voice reads instead. Musical shorthand is spoken the way a teacher would say it: “A♭4” is read as “A flat 4” and “♩ = 60” as “quarter note equals 60”. In a session, each part can be read aloud as it begins. With the piano connected, a double tap on the sustain pedal moves to the next part, so your hands never leave the keys.",
      "Every text color meets WCAG AA contrast, and an automated test checks it against the palette. Everything works from the keyboard with a visible focus ring, motion stops when your system asks for reduced motion, and the guided tour can be read aloud too.",
    ],
  },
  {
    heading: "Your data",
    paragraphs: [
      "There are no accounts and no analytics. Check-ins, ratings and rep counts stay in the browser on the device you practice on. The Progress page exports a backup file and imports it on another device. Lessons are public; progress is private by design.",
    ],
  },
  {
    heading: "Calendar",
    paragraphs: [
      "Sessions go onto Google Calendar as events whose descriptions work on their own. The app doesn't change your calendar by itself. When the plan changes, the next week's events are rewritten from the conversation where the lessons are authored. A static .ics file is also available; importing it adds events once, without ongoing sync.",
    ],
  },
  {
    heading: "Design",
    paragraphs: [
      "The palette comes from one record cover, Jackie McLean's *Bluesnik* (1961): cobalt, cyan, orchid and white, with the neutrals drawn from the duotone of its photograph. No other color appears anywhere, and a test enforces it. Each session is a record sleeve in those inks: the session number, its title in heavy italic serif, and a strip of keys marking the notes it's built around. The agenda is the sleeve's tracklist. On the Today page the record slides out of its sleeve once, and it turns only while a session timer is running. Notation always sits on white paper, sized to read from the bench, and every example is engraved with standard beaming, rests that show beat three, and chord symbols in jazz convention.",
    ],
  },
  {
    heading: "Under the hood",
    paragraphs: [
      "Next.js and TypeScript on Vercel. Notation by abcjs, rendered from the same source that drives playback, so what you see is what you hear. Sound is a small Web Audio synthesizer scheduled on the audio clock, with swing applied in playback while the notation stays straight. Automated checks confirm that every session adds up to its exact length, that every bar of every example has the right number of beats, and that every generated chord sounds the pitches its spelling names. The calendar times are checked across the November 1 daylight-saving change.",
    ],
  },
];

/** Plain text of a paragraph, as it is spoken. */
export function plain(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
}
