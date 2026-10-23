# Woodshed

A practice studio for bebop piano and Bach, built for one student: an experienced musician whose ears and harmony are far ahead of his hands at the piano.

Each session is presented as a record sleeve with its agenda as the tracklist. Inside: engraved notation with synced playback, keyboard diagrams, a click with backbeat and gap modes, rep tracking against explicit completion checks, an optional MIDI follow mode, and a check-in that drives an adaptive planner.

Everything is applied to three tunes: Rhythm changes, the blues (major and minor), and "Indiana" / "Donna Lee". The Tunes page engraves each set of changes with left-hand guide tones and plays them back. Pages can be read aloud, sessions can run hands-free (spoken steps, sustain-pedal double tap to advance), and a guided tour walks first-time visitors through it all.

The palette is sampled from one record cover (Jackie McLean, *Bluesnik*, 1961). `tests/design.test.ts` fails if any other color appears in the code, or if any text pairing drops below WCAG AA.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # content, notation, planner and calendar checks
npm run build
```

Preview any day without touching data: `/?today=2026-10-27`.

## Where things live

| Path | What |
| --- | --- |
| `src/content/` | Teacher-authored data: program, roadmap, exercises, lessons. One source for notation, playback, the app and calendar descriptions. |
| `src/lib/abc.ts` | Builds ABC notation; spells chords with correct accidentals per key and bar. |
| `src/lib/planner.ts` | Adaptive planner: sequence, missed days, re-entry, left-hand rest, simplification, spaced review. Pure functions; every change has a reason and an undo. |
| `src/lib/schedule.ts` | America/New_York time handling (DST-safe), calendar descriptions, `.ics` export. |
| `src/lib/audio.ts` | Web Audio synth, metronome and exercise player (swing applied in playback). |
| `src/lib/midi.ts` | Optional Web MIDI input (Chrome, Edge, Firefox). Pitch only. |
| `src/lib/store.ts` | Local-first storage, export and import. |
| `src/content/vehicles.ts` | The three tunes: chord charts, recordings, and how each phase uses them. |
| `src/lib/changes.ts` | Chord symbols to left-hand guide tones (voice-led), engraved parts, and transposition. |
| `src/lib/speech.ts` | Read-aloud on the browser's own speech synthesis, with a music-aware text normalizer. |
| `src/content/tour.ts`, `src/components/Tour.tsx` | The guided tour: script and engine. Steps target `data-tour` attributes. |
| `public/baseline.html` | The day-one baseline session. |

## Adding a week

Add `src/content/exercises/weekNN.ts` and `src/content/lessons/weekNN.ts`, register them in `src/content/index.ts`, and run `npm test`. The tests fail if any session doesn't add up to its exact length, if any bar has the wrong number of beats, if a lesson references a missing exercise, or if a lesson isn't applied to one of the three tunes. `AUDIT=1 npx vitest run tests/audit-export.test.ts && python3 scripts/audit-notation.py` also checks every chord's sounding pitches in a real browser.

## Data and privacy

No accounts, no analytics, no server-side storage. Check-ins and ratings stay in the browser on the practice device. Export and import move them between devices.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute site URL for metadata, Open Graph and calendar links. Optional; defaults to Vercel's production domain (`VERCEL_PROJECT_PRODUCTION_URL`). |

No secrets are required.
