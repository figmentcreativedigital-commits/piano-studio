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
        body: "Woodshed is a practice studio for bebop piano and Bach. It's built around your hands, your ears and your schedule. This tour takes about 2 minutes. Use Next and Back, or the arrow keys. Jump between chapters from the heading above. Press Escape to end the tour.",
        why: "Turn on Read aloud below to hear each card as you go.",
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
        body: "This shows today's session, its time, and what it's for. If you miss a day, Today shows the next lesson in order. Nothing piles up.",
        why: "You never owe practice. A missed day doesn't make the next session twice as long. The plan just moves along. People give up on plans that punish a missed day.",
        top: true,
      },
      {
        target: t("today-actions"),
        title: "Start, shorten, or read first",
        body: "Start session runs the timed agenda, the list of today's parts. On a busy day, the 20-minute version replaces the full session. Nothing carries over as homework.",
        why: "Playing a little every day matters more than how long any one session is.",
      },
      {
        target: t("today-record"),
        title: "Every lesson is a record",
        body: "Each session has its own record sleeve, like an album cover. The record slides out when you arrive. It turns only while a session is running.",
      },
      {
        target: t("today-agenda"),
        title: "Two sides, timed",
        body: "The agenda reads like the track list on an album: side A, a break, side B. Each title links to its part of the full lesson.",
        why: "Breaks are built in for 2 reasons. Short bursts of work with rests in between beat one long push. And your left hand needs the rest.",
      },
      {
        target: t("today-cant"),
        title: "When the day doesn't go to plan",
        body: "Tell it you only have 20 minutes, that you missed today, or that you're away until a certain date. The plan changes and tells you why. You can undo every change.",
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
        body: "It can click on every beat, or just on 2 and 4, the jazz click. It can also click for 4 bars, then go quiet for 4, to test your own time.",
        why: "Clicking 4 bars on and 4 bars off shows if the steady beat comes from you or from the click.",
        top: true,
      },
      {
        target: t("listen"),
        title: "Read aloud",
        body: "Press the speaker and the page is read to you, 1 section at a time. The part being read is highlighted. Music shorthand is spoken the right way: “A♭4” is read as “A flat 4”.",
        why: "At the piano, your eyes and hands are busy. Listening keeps both on the piano. It also helps anyone who gets tired reading lots of text.",
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
        body: "Everything for 1 session is on 1 page. You see the goal and what it builds on. You see how the time is split up. You also get a short piece of music to try it in, and the tunes it's used on.",
        top: true,
      },
      {
        target: [t("exercise-source"), t("exercise")],
        title: "Where every exercise comes from",
        body: "Each exercise has a label that shows where it comes from. It might be Barry Harris, checked against his classes. It might be Bach's score, a checked recording, or an original exercise. Every note is written with its octave number. Middle C is C4. Finger numbers never get mixed up with the numbers of scale notes.",
        why: "The label keeps what Barry taught apart from adaptations. An adaptation is his idea, changed to fit your hands.",
      },
      {
        target: t("player"),
        title: "Hear it, then play it",
        body: "Hear it plays the music at your tempo after a count-in. A count-in is a few clicks before the start. Each note lights up as it sounds. Faded and Hidden test your memory. Turn on Click to add a metronome.",
        why: "Hear it, sing it, play it. The sound comes first. The written page is there to check against.",
      },
      {
        target: t("midi"),
        title: "Connect the piano",
        body: "In Chrome or Edge, connect the PX-130 with a USB cable. Then the page follows your playing. It waits for the right note, then moves on. Safari and iPad can't do this.",
      },
      {
        target: t("reps"),
        title: "Clean runs",
        body: "Mark each run as clean or not clean. The usual goal is 3 clean runs in a row. The check-in picks them up by itself.",
      },
      {
        target: t("done-when"),
        title: "Done when",
        body: "Every exercise ends with a check you can hear or count. There's also an easier version for when it isn't there yet.",
        why: "A clear finish line tells you when to stop. Knowing when to stop is half of good practice.",
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
        body: "It has a timer for each part, a chime when time is up, and Next and Back. If the page reloads, it keeps your place.",
        top: true,
      },
      {
        target: t("session-hands-free"),
        title: "Hands-free",
        body: "Turn on Read each part aloud to hear the steps as each part begins. With the piano connected, tap the sustain pedal twice to go to the next part.",
        why: "Each time you reach for the screen, you lose your hand position and your focus.",
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
        body: "Everything you practice gets used in three tunes. They are Rhythm changes, the blues in major and minor, and “Indiana” with “Donna Lee”.",
        why: "A few tunes you know well teach you more than many tunes you know a little. These three hold most of the chords that bebop uses.",
        top: true,
      },
      {
        target: t("tune-chart"),
        title: "The changes, written out, with a play-along",
        body: "Each chart shows the chord symbols with left-hand guide tones under them. There are 4 bars on each line. Hear it plays them at any tempo with the click on 2 and 4. You can play along, or solo over them.",
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
        body: "It takes under a minute. Say how each item went and how your hands feel. Your answers decide what comes next.",
        why: "If the base of your left thumb aches, the left hand rests for 2 sessions. This happens by itself. Mark something “not yet” and its easier version comes first next time.",
        top: true,
      },
      {
        target: [t("checkin-copy"), t("checkin-save")],
        title: "Send it to your teacher",
        body: "When you save, you get a short summary. Copy it into the conversation where your lessons are written. The next lessons are changed to fit it.",
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
        body: "The plan has 4 phases. Each one ends in a milestone, a goal you can play and check. The plan is a first draft. It changes when what you can actually play changes.",
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
        body: "Every skill, with proof of how it's going. It also shows when each skill comes back for review.",
        why: "Each time a skill holds up, the wait before its next review doubles. The longest wait is 2 weeks. So steady skills come back just before you would forget them.",
        top: true,
      },
      {
        target: t("progress-backup"),
        title: "Your data stays with you",
        body: "Your practice data lives in this browser. There's no account. Export a backup, import it on another device, or add the lessons to a calendar.",
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
        body: "Start from Today, and check in when you finish. The Guided tour button brings this tour back any time you want it.",
        place: "center",
      },
    ],
  },
];
