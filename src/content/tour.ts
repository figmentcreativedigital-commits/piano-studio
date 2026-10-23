/*
 * The guided tour script. Steps point at elements by `data-tour` name, so the
 * pages can change without breaking the tour; a step whose element isn't on
 * the page is flagged rather than stalling the run.
 *
 * `body` says what a thing does. `why` is the teaching behind it, shown only
 * when "Why it's taught this way" is switched on.
 */

export interface TourStep {
  /** A data-tour name, or a CSS selector, or several in preference order. */
  target?: string | string[];
  title: string;
  body: string;
  why?: string;
  /** Scroll to the top before pointing. */
  top?: boolean;
  place?: "top" | "bottom" | "center";
}

export interface TourChapter {
  id: string;
  label: string;
  route: string;
  steps: TourStep[];
}

const t = (name: string) => `[data-tour="${name}"]`;

export const TOUR: TourChapter[] = [
  {
    id: "welcome",
    label: "Welcome",
    route: "/",
    steps: [
      {
        title: "Welcome to Woodshed",
        body: "A practice studio for bebop piano and Bach, built around one player's hands, ears and schedule. This tour takes about two minutes. Use Next and Back or the arrow keys, jump between chapters from the heading above, and press Escape to end it.",
        why: "Switch on Read aloud below and each card is spoken as you go.",
        place: "center",
      },
    ],
  },
  {
    id: "today",
    label: "Today",
    route: "/",
    steps: [
      {
        target: t("today-main"),
        title: "Today's session",
        body: "The session due today, its time, and what it's for. If you miss a day, Today shows the next lesson in order. Nothing piles up.",
        why: "No practice debt. A missed day moves the plan along instead of doubling the next session, because plans that punish a missed day get abandoned.",
        top: true,
      },
      {
        target: t("today-actions"),
        title: "Start, shorten, or read first",
        body: "Start session runs the timed agenda. On a busy day the 20-minute version replaces the session, and nothing carries over as homework.",
        why: "Keeping in daily contact with the instrument matters more than the length of any one session.",
      },
      {
        target: t("today-record"),
        title: "Every lesson is a record",
        body: "Each session has its own sleeve. The record slides out when you arrive and turns only while a session is running.",
      },
      {
        target: t("today-agenda"),
        title: "Two sides, timed",
        body: "The agenda reads like a tracklist: side A, a break, side B. Every title links to its material in the full lesson.",
        why: "Breaks are scheduled because short, spaced work beats one long push, and the left hand needs the rest.",
      },
      {
        target: t("today-cant"),
        title: "When the day doesn't go to plan",
        body: "Tell it you only have 20 minutes, that you missed today, or that you're away until a date. The plan adjusts, says why, and every change can be undone.",
      },
    ],
  },
  {
    id: "tools",
    label: "Always at hand",
    route: "/",
    steps: [
      {
        target: t("metronome"),
        title: "A metronome on every page",
        body: "Every beat, 2 and 4 (the jazz click), or four bars on and four off to test your own time.",
        why: "Four on, four off shows whether the time is yours or the click's.",
        top: true,
      },
      {
        target: t("listen"),
        title: "Read aloud",
        body: "Press the speaker and the page is read to you, a section at a time, with the part being read highlighted. Musical shorthand is spoken properly: “A♭4” is read as “A flat 4”.",
        why: "At the keyboard your eyes and hands are busy. Listening keeps both on the instrument, and it helps anyone who finds dense text tiring.",
        top: true,
      },
    ],
  },
  {
    id: "lesson",
    label: "A lesson",
    route: "/lessons/W01D02",
    steps: [
      {
        target: t("lesson-main"),
        title: "The full lesson",
        body: "Everything for one session on one page: the objective, what it builds on, how the time is balanced, the short musical application, and the tunes it's applied to.",
        top: true,
      },
      {
        target: [t("exercise-source"), t("exercise")],
        title: "Where every exercise comes from",
        body: "Each exercise is labeled: Barry Harris checked against his classes, Bach's score, a verified recording, or an original study. Every note is spelled with its octave, middle C is C4, and fingering is never confused with scale degrees.",
        why: "Labeling the source keeps what Barry taught separate from adaptations made for your hands.",
      },
      {
        target: t("player"),
        title: "Hear it, then play it",
        body: "Hear it plays the notation at your tempo after a count-in, lighting each note as it sounds. Faded and Hidden test your memory. Turn on Click for a metronome under it.",
        why: "Hear, sing, play: the sound comes first, and the page is there to check against.",
      },
      {
        target: t("midi"),
        title: "Connect the piano",
        body: "In Chrome or Edge, connect the PX-130 by USB and the page follows your playing: it waits for the right note, then moves on. Safari and iPad don't support this.",
      },
      {
        target: t("reps"),
        title: "Clean runs",
        body: "Mark each run as clean or not. Three clean runs in a row is the usual bar, and the check-in picks them up automatically.",
      },
      {
        target: t("done-when"),
        title: "Done when",
        body: "Every exercise ends with a check you can hear or count, plus an easier version for when it isn't there yet.",
        why: "A measurable finish line tells you when to stop, which is half of practicing well.",
      },
    ],
  },
  {
    id: "session",
    label: "During a session",
    route: "/session/W01D02",
    steps: [
      {
        target: t("session-timer"),
        title: "The session runner",
        body: "A timer for each part, a chime when it's up, and Next and Back. If the page reloads, your place is kept.",
        top: true,
      },
      {
        target: t("session-hands-free"),
        title: "Hands-free",
        body: "Turn on Read each part aloud and the instructions are spoken as each part begins. With the piano connected, double-tap the sustain pedal to go to the next part.",
        why: "Every reach for the screen breaks your hand position and your concentration.",
      },
    ],
  },
  {
    id: "tunes",
    label: "The three tunes",
    route: "/tunes",
    steps: [
      {
        target: t("tunes-intro"),
        title: "Three tunes",
        body: "Everything you practice is applied to Rhythm changes, the blues in major and minor, and “Indiana” with “Donna Lee”.",
        why: "A few tunes learned deeply carry more vocabulary than many learned thinly, and these three hold most of bebop's harmony.",
        top: true,
      },
      {
        target: t("tune-chart"),
        title: "The changes, engraved, with a play-along",
        body: "Each chart shows the chord symbols with left-hand guide tones underneath, four bars to a line. Hear it plays them at any tempo with the click on 2 and 4, so you can play along or solo over them.",
      },
    ],
  },
  {
    id: "checkin",
    label: "Checking in",
    route: "/check-in",
    steps: [
      {
        target: t("checkin-form"),
        title: "Check in after each session",
        body: "Under a minute: how each item went, and how your hands feel. It decides what comes next.",
        why: "Any ache at the base of the left thumb rests the left hand for two sessions automatically. Marking something “not yet” puts its easier version first next time.",
        top: true,
      },
      {
        target: [t("checkin-copy"), t("checkin-save")],
        title: "Send it to your teacher",
        body: "When you save, you get a short summary. Copy it into the conversation and the coming lessons are adjusted from it.",
      },
    ],
  },
  {
    id: "plan",
    label: "The long view",
    route: "/roadmap",
    steps: [
      {
        target: t("roadmap-timeline"),
        title: "Twelve weeks",
        body: "Four phases, each ending in a milestone you can play and check. The plan is provisional and moves when the evidence does.",
        top: true,
      },
    ],
  },
  {
    id: "progress",
    label: "Progress",
    route: "/progress",
    steps: [
      {
        target: t("progress-ledger"),
        title: "What's steady",
        body: "Every skill with its evidence and when it's next due for review.",
        why: "Review intervals double each time something holds, up to two weeks, so steady material comes back just before it would fade.",
        top: true,
      },
      {
        target: t("progress-backup"),
        title: "Your data stays with you",
        body: "Practice data lives in this browser, with no account. Export a backup, import it on another device, or add the lessons to a calendar.",
      },
    ],
  },
  {
    id: "end",
    label: "Finish",
    route: "/",
    steps: [
      {
        title: "That's the tour",
        body: "Start from Today and check in when you finish. The Guided tour button brings this back whenever you want it.",
        place: "center",
      },
    ],
  },
];
