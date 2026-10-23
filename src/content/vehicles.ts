import type { Vehicle, VehicleId } from "./types";

/*
 * The three tunes everything is applied to: Rhythm changes, the blues
 * (major and minor), and "Indiana" with "Donna Lee". Chord progressions are
 * not copyrighted; melodies of protected tunes are never printed here, only
 * learned by ear from the records.
 *
 * Each chart is written as chord symbols, one bar per entry. Two chords in a
 * bar get two beats each. The engraved part and the audio both come from
 * these symbols (src/lib/changes.ts).
 */

export const VEHICLES: Vehicle[] = [
  {
    id: "blues",
    name: "The blues",
    tune: "12-bar blues in F",
    key: "F",
    abcKey: "F",
    form: "12 bars",
    tempo: 72,
    summary:
      "Where the program starts. Three dominant chords, and guide tones that move by half steps: E♭–A, D–A♭, E–B♭. Week 1 plays this form in the left hand while the right hand answers with a riff.",
    chart: [{ bars: ["F7", "Bb7", "F7", "F7", "Bb7", "Bb7", "F7", "F7", "C7", "Bb7", "F7", "C7"] }],
    uses: [
      { phase: "P1", text: "Left-hand guide tones short on beat 1 and a right-hand riff, taking turns (Week 1)." },
      { phase: "P2", text: "The bebop version: a ii–V into bar 5, the diminished chord in bar 6, a turnaround in bars 8–10. Harris lines over two choruses." },
      { phase: "P3", text: "Horace Silver's comping: short chords, placed. Sonny Clark's long lines over the same form." },
      { phase: "P4", text: "Head and two choruses, solo piano, recorded." },
    ],
    family: ["“Doodlin'” (Horace Silver, in D♭)", "“Cool Struttin'” (Sonny Clark)", "“Au Privave” and “Blues for Alice” (Charlie Parker, in the Barry Book)"],
    recordings: [
      {
        artist: "Horace Silver and the Jazz Messengers",
        title: "Doodlin'",
        recorded: "November 13, 1954",
        detail: "A 12-bar blues in D♭.",
        note: "Listen to how little Horace plays behind the horns, and how much each chord does.",
        sourceUrl: "https://en.wikipedia.org/wiki/Doodlin%27_(Horace_Silver_song)",
      },
      {
        artist: "Sonny Clark",
        title: "Cool Struttin'",
        recorded: "January 5, 1958, Hackensack, New Jersey (Blue Note)",
        detail: "With Art Farmer, Jackie McLean, Paul Chambers and Philly Joe Jones. A medium blues.",
        note: "Sonny's lines stay inside the beat for a whole chorus before they open up.",
        sourceUrl: "https://www.jazzdisco.org/sonny-clark/discography/",
      },
    ],
    theme: { bg: "cyan", ink: "night", acc: "cobalt", field: "navy" },
    source: { note: "The form as Week 1 plays it. The bebop version in Phase 2 follows the Barry Book's Blues chapter." },
  },
  {
    id: "minor-blues",
    name: "The minor blues",
    tune: "12-bar minor blues in C minor",
    key: "C minor",
    abcKey: "Cm",
    form: "12 bars",
    tempo: 72,
    summary:
      "Week 1's scale with one note changed. Flatten E to E♭ and the C sixth-diminished scale becomes the C minor sixth-diminished scale, C D E♭ F G A♭ A B. Barry's words: “It's the exact same scale. All you do is just flat the third.” The tonic is played as a minor sixth chord, and it pairs with the same B diminished.",
    chart: [{ bars: ["Cm6", "Cm6", "Cm6", "Cm6", "Fm6", "Fm6", "Cm6", "Cm6", "Ab7", "G7", "Cm6", "G7"] }],
    uses: [
      { phase: "P1", text: "The C minor sixth-diminished scale and Cm6–B° movement; guide tones through the form (Week 2)." },
      { phase: "P2", text: "Lines over A♭7 to G7 in bars 9–10, using the minor sixth on the fifth of each dominant." },
      { phase: "P3", text: "Horace Silver's minor blues feel in 6/8; comping under a melody." },
      { phase: "P4", text: "A recorded chorus, solo piano." },
    ],
    family: ["“Señor Blues” (Horace Silver, E♭ minor)", "“Mr. P.C.” (John Coltrane, C minor)"],
    recordings: [
      {
        artist: "Horace Silver Quintet",
        title: "Señor Blues",
        recorded: "November 10, 1956, Hackensack, New Jersey (Blue Note)",
        detail: "From 6 Pieces of Silver, with Donald Byrd, Hank Mobley, Doug Watkins and Louis Hayes. A 12-bar blues form with a minor melody in E♭ minor, in a Latin 6/8 feel.",
        note: "Count the 12 bars under the 6/8. The blues form survives the change of feel.",
        sourceUrl: "https://newyorkjazzworkshop.com/demystifying-the-building-blocks-of-jazz-the-blues-and-basic-song-form-with-horace-silvers-senor-blues/",
      },
      {
        artist: "John Coltrane",
        title: "Mr. P.C.",
        recorded: "May 5, 1959, Atlantic Studios, New York",
        detail: "From Giant Steps, with Tommy Flanagan on piano, Paul Chambers and Art Taylor. A 12-bar minor blues in C minor: the reference for this chart.",
        note: "Hear where Tommy Flanagan's left hand sits under the A♭7 to G7 in bars 9 and 10.",
        sourceUrl: "https://en.wikipedia.org/wiki/Mr._P.C.",
      },
    ],
    theme: { bg: "orchid", ink: "night", acc: "white", field: "navy" },
    source: {
      note: "Changes after “Mr. P.C.”, with the tonic as a minor sixth chord. The scale and its B diminished partner are from Barry in class (barryharrismethod.com, step 9.5).",
      url: "https://barryharrismethod.com/method/9.5",
    },
  },
  {
    id: "rhythm",
    name: "Rhythm changes",
    tune: "“I Got Rhythm” (George Gershwin)",
    key: "B♭",
    abcKey: "Bb",
    form: "32 bars, AABA",
    tempo: 72,
    summary:
      "The bebop workhorse. Two chords to a bar in the A sections, then a bridge of dominant sevenths a fourth apart: D7, G7, C7, F7. That bridge is the same chain of dominants that opens “Indiana”.",
    chart: [
      { mark: "A", bars: ["Bb6 Gm7", "Cm7 F7", "Dm7 Gm7", "Cm7 F7", "Bb7", "Eb6 E°7", "Bb6 Gm7", "Cm7 F7"] },
      { mark: "A", bars: ["Bb6 Gm7", "Cm7 F7", "Dm7 Gm7", "Cm7 F7", "Bb7", "Eb6 E°7", "Cm7 F7", "Bb6"] },
      { mark: "B", bars: ["D7", "D7", "G7", "G7", "C7", "C7", "F7", "F7"] },
      { mark: "A", bars: ["Bb6 Gm7", "Cm7 F7", "Dm7 Gm7", "Cm7 F7", "Bb7", "Eb6 E°7", "Cm7 F7", "Bb6"] },
    ],
    uses: [
      { phase: "P1", text: "The bridge only, left hand: the D7–G7–C7–F7 chain you meet first in “Indiana” (Week 3)." },
      { phase: "P2", text: "The A sections: B♭ sixth-diminished movement over B♭6, and the E°7 in bar 6. Right-hand lines over the bridge." },
      { phase: "P3", text: "Lester Young's “Lester Leaps In” by ear: a riff tune on these changes." },
      { phase: "P4", text: "Head and a chorus, solo piano." },
    ],
    family: ["“Lester Leaps In” (Lester Young, 1939)", "“Wail” (Bud Powell, 1949, in E♭)", "“Cool Eyes” (Horace Silver, 1956: Rhythm A sections, a different bridge)", "“Anthropology” (Charlie Parker, in the Barry Book)"],
    recordings: [
      {
        artist: "Count Basie's Kansas City Seven, featuring Lester Young",
        title: "Lester Leaps In",
        recorded: "September 5, 1939, New York (Vocalion 5118)",
        detail: "With Buck Clayton, Dicky Wells, Count Basie, Freddie Green, Walter Page and Jo Jones.",
        note: "Lester on the same changes you'll play: how often does he land a phrase on beat 1?",
        sourceUrl: "https://en.wikipedia.org/wiki/Lester_Leaps_In",
      },
      {
        artist: "Bud Powell",
        title: "Wail",
        recorded: "August 9, 1949, WOR Studios, New York (Blue Note)",
        detail: "With Fats Navarro, Sonny Rollins, Tommy Potter and Roy Haynes. Rhythm changes in E♭.",
        note: "Listen to Bud's left hand on the bridge: one short chord for each dominant.",
        sourceUrl: "https://ethaniverson.com/rhythm-and-blues/the-stuff-that-dreams-are-made-of/",
      },
      {
        artist: "Horace Silver Quintet",
        title: "Cool Eyes",
        recorded: "November 10, 1956, Hackensack, New Jersey (Blue Note)",
        detail: "From 6 Pieces of Silver. “I Got Rhythm” A sections with a “Honeysuckle Rose” bridge.",
        note: "Notice the bridge isn't the rhythm-changes bridge.",
        sourceUrl: "https://jazz.com/music/horace-silver-cool-eyes2",
      },
    ],
    theme: { bg: "cobalt", ink: "white", acc: "cyan", field: "cyan" },
    source: {
      note: "Form from “Rhythm changes” (Wikipedia). The A sections follow the Barry Book (Dm7 in bar 3, E°7 in bar 6), with its B♭7/D and B♭6/F written without the bass notes.",
      url: "https://en.wikipedia.org/wiki/Rhythm_changes",
    },
  },
  {
    id: "indiana",
    name: "“Indiana” and “Donna Lee”",
    tune: "“(Back Home Again in) Indiana” (James F. Hanley, 1917)",
    key: "F",
    abcKey: "F",
    form: "32 bars, ABAC",
    tempo: 66,
    summary:
      "Bebop's favorite standard to rewrite. Charlie Parker's “Donna Lee” is a new line on these changes, in A♭, and Bud Powell is the pianist on its first recording. Lester Young's 1942 trio record with Nat King Cole, the reference for his playing on this tune, is in A♭ too. Learn the changes in F first, then move them to A♭, where Lester and Bird play them.",
    chart: [
      { mark: "A", bars: ["F6", "D7", "G7", "G7", "Gm7", "C7", "F6", "Cm7 F7"] },
      { mark: "B", bars: ["Bb6", "Eb7", "F6", "D7", "G7", "G7", "Gm7", "C7"] },
      { mark: "A", bars: ["F6", "D7", "G7", "G7", "A7", "Em7b5 A7", "Dm6", "Em7b5 A7"] },
      { mark: "C", bars: ["Dm6", "Em7b5 A7", "Dm6", "G°7", "F6 D7", "Gm7 C7", "F6", "Gm7 C7"] },
    ],
    alt: {
      label: "“Donna Lee” key",
      key: "A♭",
      abcKey: "Ab",
      steps: 2,
      semitones: 3,
      note: "The same changes up a minor third, in A♭: the key of “Donna Lee”, of Lester Young's 1942 “Indiana”, and of the Barry Book's chart.",
    },
    uses: [
      { phase: "P1", text: "F6 movement over the opening bar (Week 1, Friday). Week 3: the D7–G7–C7 chain in the left hand, and the first phrase of Lester's second solo (1942) by ear, in A♭." },
      { phase: "P2", text: "The whole form in guide tones; Harris lines over the chain of dominants; the minor ii–V (Em7♭5 to A7) into D minor." },
      { phase: "P3", text: "The “Donna Lee” head by ear, a section at a time, from the 1947 record with Bud Powell on piano." },
      { phase: "P4", text: "Solo piano: the “Indiana” melody over guide tones, then a chorus." },
    ],
    family: ["“Donna Lee” (Charlie Parker, 1947, in A♭)"],
    recordings: [
      {
        artist: "Lester Young Trio",
        title: "Indiana",
        recorded: "July 1942, Los Angeles (Philo)",
        detail: "With Nat King Cole and Red Callender. Lester states the tune, Cole solos, then Lester returns, and that second solo is the reference here. In A♭, the key of “Donna Lee” (measured from the recording).",
        note: "Week 3: sing the first phrase of the second solo with the record, then find it in A♭. Lester also recorded the tune in 1944 (Savoy) and with Oscar Peterson in 1952.",
        sourceUrl: "https://adp.library.ucsb.edu/index.php/objects/refer/421212",
      },
      {
        artist: "Bud Powell Trio",
        title: "Indiana",
        recorded: "January 10, 1947, New York (Roost)",
        detail: "With Curly Russell and Max Roach.",
        note: "Bud's left hand: count how many bars go by between chords.",
        sourceUrl: "https://www.jazzdisco.org/bud-powell/catalog/",
      },
      {
        artist: "Charlie Parker with Miles Davis",
        title: "Donna Lee",
        recorded: "May 8, 1947, Harry Smith Studios, New York (Savoy)",
        detail: "With Bud Powell, Tommy Potter and Max Roach. The line on these changes, in A♭.",
        note: "Sing the first four bars of the head until you can hold it without the record.",
        sourceUrl: "https://www.jazzdisco.org/bud-powell/catalog/",
      },
    ],
    theme: { bg: "navy", ink: "white", acc: "cyan", field: "cyan" },
    source: {
      note: "Cross-checked against two published charts (Pocket Changes “Donna Lee”, Vanilla Book “Indiana”) and the Barry Book. Charts differ in small ways; bar 28 is G°7 here and A♭°7 in one of them.",
      url: "https://www.jazzstandards.com/compositions-0/indiana.htm",
    },
  },
];

export function getVehicle(id: VehicleId): Vehicle {
  const v = VEHICLES.find((x) => x.id === id);
  if (!v) throw new Error(`Unknown tune ${id}`);
  return v;
}
