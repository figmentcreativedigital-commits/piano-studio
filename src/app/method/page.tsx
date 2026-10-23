import type { Metadata } from "next";

export const metadata: Metadata = { title: "Method", description: "How Woodshed teaches, where its material comes from, and what happens to your data." };

const SOURCES = [
  { label: "The Barry Harris Workshop Video and workbook (Howard Rees, Jazz Workshops)", href: "https://jazzworkshops.com/the-barry-harris-workshop-video/" },
  { label: "Robbie Barnby, 'Barry Harris 6th Diminished Scale FULLY EXPLAINED' (2021), used as a secondary source", href: "https://www.youtube.com/watch?v=7reOAaveCi0" },
  { label: "J.S. Bach, Inventions and Sinfonias, BWV 772–801 (IMSLP)", href: "https://imslp.org/wiki/Inventions_and_Sinfonias,_BWV_772-801_(Bach,_Johann_Sebastian)" },
  { label: "Jazz Giant (Bud Powell): session details", href: "https://en.wikipedia.org/wiki/Jazz_Giant" },
  { label: "Sonny Clark Trio (Blue Note BLP 1579): session details", href: "https://en.wikipedia.org/wiki/Sonny_Clark_Trio" },
  { label: "Horace Silver and the Jazz Messengers: session details", href: "https://en.wikipedia.org/wiki/Horace_Silver_and_the_Jazz_Messengers" },
  { label: "Lester Young and 'Oh! Lady be Good' (1936)", href: "https://gwallter.com/music/lester-young-and-oh-lady-be-good.html" },
  { label: "abcjs, the notation engine", href: "https://www.abcjs.net/" },
];

export default function MethodPage() {
  return (
    <>
      <div className="wrap page-head">
        <h1>Method</h1>
        <p>Woodshed is a practice studio built for one student: an experienced musician whose ears and harmony are far ahead of his hands at the piano. Here&apos;s how it teaches, where its material comes from, and what happens to the data.</p>
      </div>
      <div className="wrap prose" style={{ paddingBottom: 56 }}>
        <h2 className="section-head">A session</h2>
        <p>Every session is written out in full and timed to the minute, breaks and the check-in included: sixty minutes on weekdays, two hours on weekends, presented as an LP with its tracklist. Weekend sessions have a side A and a side B with a real break in between.</p>
        <p>Each exercise follows the same cycle where it fits: hear it, sing it, play it, vary it, then play it once from memory. Each one names its fingering, starting tempo, common errors, a single corrective cue, an easier version, and a check you can actually verify, such as three clean runs in a row followed by one from memory the next day. A 15–20 minute essential version replaces the session on a busy day; nothing carries over as homework.</p>

        <h2 className="section-head">Barry Harris at the center</h2>
        <p>The jazz curriculum is built on Barry Harris&apos;s teaching: the sixth-diminished scale, chord movement, scales that land chord tones on the beat. Bud Powell, Horace Silver and Sonny Clark are the models, with Lester Young as the source of phrasing.</p>
        <p>Every exercise carries a label: <strong>Barry Harris</strong> for his concepts, <strong>Adaptation</strong> for exercises built on them, <strong>Original study</strong>, <strong>Bach score</strong>, or <strong>Recording</strong>. Each label also says how well the claim is verified. Where a Harris idea has so far been checked only against secondary sources, the label says so until it has been checked against his own workshop material.</p>

        <h2 className="section-head">The left hand</h2>
        <p>For now the left hand works with fingers 2 to 5 and short, light attacks, and the left thumb stays off the keys. The right hand carries the lines. That suits the style more than it limits it: Bud Powell and Horace Silver often punctuate with brief left-hand chords under long right-hand lines. Any ache switches the next two sessions to right-hand-only versions.</p>

        <h2 className="section-head">Evidence, not timers</h2>
        <p>A finished timer proves nothing. After each session a check-in takes under a minute: minutes played, how each focus skill went (steady, close, not yet), comfort, and the main difficulty. The planner reads it and decides the next step.</p>
        <ul>
          <li>
            <strong>Missed a day:</strong> the sequence resumes where you left off. Nothing doubles up.
          </li>
          <li>
            <strong>Away more than four days:</strong> a ten-minute re-entry check comes first.
          </li>
          <li>
            <strong>&apos;Not yet&apos;:</strong> that skill&apos;s exercises open with their easier version.
          </li>
          <li>
            <strong>Steady on two different days:</strong> the skill is retained, and its review interval doubles.
          </li>
        </ul>
        <p>Every change shows its reason and can be reversed. Self-ratings are labeled as self-ratings. Nothing is presented as measured unless it was.</p>

        <h2 className="section-head">MIDI</h2>
        <p>With the piano connected by USB to Chrome, Edge or Firefox on a computer, the keyboard diagrams light up as you play. Follow mode waits for the right notes before moving on, which helps slow reading. It checks pitches only. It can&apos;t assess fingering, posture, tension, touch or swing, and the app doesn&apos;t claim to. Safari and iPad browsers don&apos;t offer Web MIDI, and everything else works without it.</p>

        <h2 className="section-head">Your data</h2>
        <p>There are no accounts and no analytics. Check-ins, ratings and rep counts stay in the browser on the device you practice on. The Progress page exports a backup file and imports it on another device. Lessons are public; progress is private by design.</p>

        <h2 className="section-head">Calendar</h2>
        <p>Sessions go onto Google Calendar as events whose descriptions work on their own. The app doesn&apos;t change your calendar by itself. When the plan changes, the next week&apos;s events are rewritten from the conversation where the lessons are authored. A static .ics file is also available; importing it adds events once, without ongoing sync.</p>

        <h2 className="section-head">Design</h2>
        <p>Each session is a record sleeve: the week&apos;s color, the session number, its title set in condensed type, and a strip of keys marking the notes it&apos;s built around. The agenda is the sleeve&apos;s tracklist. On the Today page the record slides out of its sleeve once, and it turns only while a session timer is running. Notation always sits on white paper, sized to read from the bench, and every example is engraved with standard beaming, rests that show beat three, and chord symbols in jazz convention.</p>

        <h2 className="section-head">Under the hood</h2>
        <p>Next.js and TypeScript on Vercel. Notation by abcjs, rendered from the same source that drives playback, so what you see is what you hear. Sound is a small Web Audio synthesizer scheduled on the audio clock, with swing applied in playback while the notation stays straight. Automated checks confirm that every session adds up to its exact length, that every bar of every example has the right number of beats, and that every generated chord sounds the pitches its spelling names. The calendar times are checked across the November 1 daylight-saving change.</p>

        <h2 className="section-head">Sources</h2>
        <ul>
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
