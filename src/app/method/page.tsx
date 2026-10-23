import type { Metadata } from "next";

export const metadata: Metadata = { title: "Method", description: "How Woodshed teaches, where its material comes from, and what happens to your data." };

const SOURCES = [
  { label: "Barry Harris in class: 'Introducing the sixth diminished scale' (The Hague)", href: "https://www.youtube.com/watch?v=-jO-sIrjTqg" },
  { label: "barryharrismethod.com: Barry's teaching in his own words, each point linked to the moment in his class recordings (independent archive)", href: "https://barryharrismethod.com/" },
  { label: "Howard Rees on Harris's voicings (Keyboard, November 1998)", href: "https://jazzschoolonline.com/evolutionary-voicings-part-ii/" },
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

        <h2 className="section-head">Three tunes</h2>
        <p>Every technique is applied to the same three tunes: Rhythm changes, the blues in major and minor, and &ldquo;Indiana&rdquo; with &ldquo;Donna Lee&rdquo;, its bebop line. They hold most of bebop&apos;s harmony between them, and they connect: the chain of dominants that opens &ldquo;Indiana&rdquo; is the bridge of Rhythm changes, and the C minor blues uses Week 1&apos;s scale with one note changed. Each lesson names the tunes it&apos;s applied to, and an automated check fails if one doesn&apos;t. The Tunes page engraves each set of changes with left-hand guide tones and plays it back at any tempo.</p>

        <h2 className="section-head">Barry Harris at the center</h2>
        <p>The jazz curriculum is built on Barry Harris&apos;s teaching: the sixth-diminished scale, chord movement, scales that land chord tones on the beat. Bud Powell, Horace Silver and Sonny Clark are the models, with Lester Young as the source of phrasing.</p>
        <p>Every exercise carries a label: <strong>Barry Harris</strong> for his concepts, <strong>Adaptation</strong> for exercises built on them, <strong>Original study</strong>, <strong>Bach score</strong>, or <strong>Recording</strong>. Each label also says how well the claim is verified. Where a Harris idea has been checked against Barry&apos;s own words in class, the label says so and links to the moment in the recording; where it rests only on secondary sources, the label says that instead. The Barry Book, a free collaborative textbook of his system, is a second reference, with chapters on the blues, Rhythm and &ldquo;Indiana&rdquo;.</p>

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

        <h2 className="section-head">Accessibility</h2>
        <p>Every page can be read aloud, a section at a time, with the part being read highlighted. The voice is your device&apos;s own, so nothing is sent anywhere. Musical shorthand is spoken the way a teacher would say it: &ldquo;A&#9837;4&rdquo; is read as &ldquo;A flat 4&rdquo; and &ldquo;&#9833; = 60&rdquo; as &ldquo;quarter note equals 60&rdquo;. In a session, each part can be read aloud as it begins. With the piano connected, a double tap on the sustain pedal moves to the next part, so your hands never leave the keys.</p>
        <p>Every text color meets WCAG AA contrast, and an automated test checks it against the palette. Everything works from the keyboard with a visible focus ring, motion stops when your system asks for reduced motion, and the guided tour can be read aloud too.</p>

        <h2 className="section-head">Your data</h2>
        <p>There are no accounts and no analytics. Check-ins, ratings and rep counts stay in the browser on the device you practice on. The Progress page exports a backup file and imports it on another device. Lessons are public; progress is private by design.</p>

        <h2 className="section-head">Calendar</h2>
        <p>Sessions go onto Google Calendar as events whose descriptions work on their own. The app doesn&apos;t change your calendar by itself. When the plan changes, the next week&apos;s events are rewritten from the conversation where the lessons are authored. A static .ics file is also available; importing it adds events once, without ongoing sync.</p>

        <h2 className="section-head">Design</h2>
        <p>The palette comes from one record cover, Jackie McLean&apos;s <em>Bluesnik</em> (1961): cobalt, cyan, orchid and white, with the neutrals drawn from the duotone of its photograph. No other color appears anywhere, and a test enforces it. Each session is a record sleeve in those inks: the session number, its title in heavy italic serif, and a strip of keys marking the notes it&apos;s built around. The agenda is the sleeve&apos;s tracklist. On the Today page the record slides out of its sleeve once, and it turns only while a session timer is running. Notation always sits on white paper, sized to read from the bench, and every example is engraved with standard beaming, rests that show beat three, and chord symbols in jazz convention.</p>

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
