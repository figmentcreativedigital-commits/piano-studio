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
  "Woodshed is a practice studio built for one student. He is an experienced musician. His ears and his knowledge of chords are far ahead of his hands at the piano. This page explains how Woodshed teaches. It also says where the material comes from, and what happens to your data.";

export const METHOD: MethodSection[] = [
  {
    heading: "A session",
    paragraphs: [
      "Every session is written out in full and timed to the minute. That includes the breaks and the check-in. Weekday sessions are 60 minutes. Weekend sessions are 2 hours. Each session looks like an LP record with its track list. Weekend sessions have a side A and a side B, with a real break in between.",
      "Each exercise follows the same steps where it fits. Hear it, sing it, play it, change it a little, then play it once from memory. Each exercise gives its fingering and starting tempo. It lists common mistakes. It gives 1 cue, a short reminder that fixes them. It has an easier version, too. And it ends with a check you can really test. For example: 3 clean runs in a row, then 1 from memory the next day. On a busy day, a 15–20 minute essential version replaces the session. Nothing carries over as homework.",
    ],
  },
  {
    heading: "Three tunes",
    paragraphs: [
      "Every skill you learn gets used in the same three tunes. They are Rhythm changes, the blues in major and minor, and “Indiana” with “Donna Lee”. “Donna Lee” is a bebop melody on the chords of “Indiana”. Together, these tunes hold most of the chords bebop uses. They also connect to each other. The chain of dominants that opens “Indiana” is the bridge of Rhythm changes. The C minor blues uses Week 1's scale with 1 note changed. Each lesson names the tunes it uses. An automatic test fails if a lesson doesn't. The Tunes page writes out the changes for each tune, with left-hand guide tones. It plays them back at any tempo.",
    ],
  },
  {
    heading: "Barry Harris at the center",
    paragraphs: [
      "The jazz lessons are built on Barry Harris's teaching. That means the sixth-diminished scale, chord movement, and scales that put chord tones on the beat. Bud Powell, Horace Silver and Sonny Clark are the models. Lester Young is the model for phrasing. Phrasing is how you shape a musical line, like a spoken sentence.",
      "Every exercise has a label. **Barry Harris** means it's his idea. **Adaptation** means an exercise built on his ideas. The others are **Original exercise**, **Bach's score** and **Recording**. Each label also says how well the facts behind it are checked. Sometimes a Harris idea has been checked against Barry's own words in class. Then the label says so, and links to that moment in the recording. Sometimes it rests only on what other people wrote about him. Then the label says that instead. The Barry Book is a second source. It's a free textbook of his method, written by many people together. It has chapters on the blues, Rhythm changes and “Indiana”.",
    ],
  },
  {
    heading: "The left hand",
    paragraphs: [
      "For now, your left hand uses fingers 2 to 5 only. It plays short, light notes. Your left thumb stays off the keys. Your right hand plays the lines. This fits the style more than it holds you back. Bud Powell and Horace Silver often play short left-hand chords under long right-hand lines. If anything aches, the next 2 sessions switch to right-hand-only versions.",
    ],
  },
  {
    heading: "Proof, not timers",
    paragraphs: [
      "A timer running out doesn't prove anything. After each session, you do a check-in. It takes under a minute. You note how many minutes you played and how each focus skill went: steady, close, or not yet. You also note how your hands felt and what was hardest. The planner reads it and decides the next step.",
    ],
    list: [
      { term: "Missed a day", text: "you pick up where you left off. Nothing doubles up." },
      { term: "Away more than 4 days", text: "a 10-minute welcome-back check comes first." },
      { term: "‘Not yet’", text: "that skill's exercises start with their easier version." },
      { term: "Steady on 2 different days", text: "the skill counts as learned. The wait before its next review doubles." },
    ],
    after: ["Every change shows its reason, and you can undo it. Your own ratings are labeled as your own ratings. Nothing is shown as measured unless it really was."],
  },
  {
    heading: "MIDI",
    paragraphs: [
      "Connect the piano by USB to a computer running Chrome, Edge or Firefox. Then the keyboard pictures light up as you play. Follow mode waits for the right notes before it moves on. That helps when you read slowly. It checks only which notes you play. It can't judge your fingering, posture, tight muscles, touch or swing. The app doesn't claim to. Safari and iPad browsers don't offer Web MIDI. Everything else works without it.",
    ],
  },
  {
    heading: "Accessibility",
    paragraphs: [
      "Every page can be read aloud, 1 section at a time. The part being read is highlighted. The narrator is a studio voice. Google's text-to-speech reads each passage of lesson text once, and the sound is saved. Your practice data is never sent. When the narrator isn't available, your device's own voice reads instead. Music shorthand is spoken the way a teacher would say it. “A♭4” is read as “A flat 4”. “♩ = 60” is read as “quarter note equals 60”. In a session, each part can be read aloud as it begins. With the piano connected, tap the sustain pedal twice to move to the next part. That way your hands never leave the keys.",
      "Every text color meets the WCAG AA rule for contrast. That rule makes sure text stands out clearly from the color behind it. An automatic test checks this for every color the site uses. Everything works from the computer keyboard. A ring shows which item you are on. Motion stops when your system asks for less motion. The guided tour can be read aloud too.",
    ],
  },
  {
    heading: "Your data",
    paragraphs: [
      "There are no accounts, and no analytics that track what you do. Your check-ins, ratings and rep counts stay in the browser on the device you practice on. The Progress page can export a backup file. You can import it on another device. Lessons are public. Your progress is private, on purpose.",
    ],
  },
  {
    heading: "Calendar",
    paragraphs: [
      "Sessions go onto Google Calendar as events. Each event's notes make sense on their own. The app doesn't change your calendar by itself. When the plan changes, next week's events are rewritten. That happens in the conversation where the lessons are written. You can also get a plain .ics calendar file. Importing it adds the events once. It doesn't keep them in sync after that.",
    ],
  },
  {
    heading: "Design",
    paragraphs: [
      "The colors come from one record cover, Jackie McLean's *Bluesnik* (1961). They are cobalt, cyan, orchid and white. The darker and softer shades come from the cover photo, which is printed in 2 colors. No other color appears anywhere, and a test makes sure of it. Each session is a record sleeve in those inks. It shows the session number and its title in heavy italic serif type. A strip of keys marks the notes the session is built around. The agenda is the sleeve's track list. On the Today page, the record slides out of its sleeve once. It turns only while a session timer is running. Written music always sits on white paper, big enough to read from the piano bench. Eighth notes are joined by beams in the standard way. Rests are written so you can always see where beat 3 starts. Chord symbols are written the jazz way.",
    ],
  },
  {
    heading: "Under the hood",
    paragraphs: [
      "The site is built with Next.js and TypeScript, and it runs on Vercel. The written music is drawn by abcjs. The same source drives the sound, so what you see is what you hear. Sound comes from a small Web Audio synthesizer, timed by the audio clock. Playback adds the swing, but the written music stays straight. Automatic tests check 3 things. Every session adds up to its exact length. Every bar of every example has the right number of beats. And every chord the app builds plays the notes its name says. The calendar times are checked across the November 1 daylight-saving change.",
    ],
  },
];

/** Plain text of a paragraph, as it is spoken. */
export function plain(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
}
