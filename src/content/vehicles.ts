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
      "This is where the program starts. It uses 3 dominant seventh chords. Their guide tones move by half steps, the smallest step on the piano: E♭–A, D–A♭, E–B♭. In Week 1, your left hand plays the form. Your right hand answers with a riff.",
    chart: [{ bars: ["F7", "Bb7", "F7", "F7", "Bb7", "Bb7", "F7", "F7", "C7", "Bb7", "F7", "C7"] }],
    uses: [
      { phase: "P1", text: "Week 1: left-hand guide tones, short on beat 1, and a right-hand riff. The hands take turns." },
      { phase: "P2", text: "The bebop version: a ii–V into bar 5, the diminished chord in bar 6, and a turnaround in bars 8–10. A turnaround is a few chords that lead back home. Then Harris lines over 2 choruses." },
      { phase: "P3", text: "Horace Silver's comping: short chords, each one carefully placed. Then Sonny Clark's long lines over the same form." },
      { phase: "P4", text: "The head and 2 choruses, solo piano, recorded." },
    ],
    family: ["“Doodlin'” (Horace Silver, in D♭)", "“Cool Struttin'” (Sonny Clark)", "“Au Privave” and “Blues for Alice” (Charlie Parker, in the Barry Book)"],
    recordings: [
      {
        artist: "Horace Silver and the Jazz Messengers",
        title: "Doodlin'",
        recorded: "November 13, 1954",
        detail: "A 12-bar blues in D♭.",
        note: "Listen to how little Horace plays behind the horns. Notice how much each chord does.",
        sourceUrl: "https://en.wikipedia.org/wiki/Doodlin%27_(Horace_Silver_song)",
      },
      {
        artist: "Sonny Clark",
        title: "Cool Struttin'",
        recorded: "January 5, 1958, Hackensack, New Jersey (Blue Note)",
        detail: "With Art Farmer, Jackie McLean, Paul Chambers and Philly Joe Jones. A blues at a medium tempo.",
        note: "For a whole chorus, Sonny's lines stay right inside the beat. Then they open up.",
        sourceUrl: "https://www.jazzdisco.org/sonny-clark/discography/",
      },
    ],
    theme: { bg: "cyan", ink: "night", acc: "cobalt", field: "navy" },
    source: { note: "This is the form as you play it in Week 1. The bebop version in Phase 2 follows the Blues chapter of the Barry Book." },
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
      "This is Week 1's scale with 1 note changed. Lower E to E♭. Now the C sixth-diminished scale becomes the C minor sixth-diminished scale: C D E♭ F G A♭ A B. In Barry's words: “It's the exact same scale. All you do is just flat the third.” The home chord, called the tonic, is a minor sixth chord. It pairs with the same B diminished chord.",
    chart: [{ bars: ["Cm6", "Cm6", "Cm6", "Cm6", "Fm6", "Fm6", "Cm6", "Cm6", "Ab7", "G7", "Cm6", "G7"] }],
    uses: [
      { phase: "P1", text: "Week 2: the C minor sixth-diminished scale and Cm6–B° movement. Then guide tones through the form." },
      { phase: "P2", text: "Lines over A♭7 to G7 in bars 9–10. Over each dominant, the lines use the minor sixth chord built on its 5th." },
      { phase: "P3", text: "Horace Silver's minor blues feel in 6/8. Then comping under a melody." },
      { phase: "P4", text: "A recorded chorus, solo piano." },
    ],
    family: ["“Señor Blues” (Horace Silver, E♭ minor)", "“Mr. P.C.” (John Coltrane, C minor)"],
    recordings: [
      {
        artist: "Horace Silver Quintet",
        title: "Señor Blues",
        recorded: "November 10, 1956, Hackensack, New Jersey (Blue Note)",
        detail: "From the album 6 Pieces of Silver, with Donald Byrd, Hank Mobley, Doug Watkins and Louis Hayes. It's a 12-bar blues form with a minor melody in E♭ minor. The feel is a Latin 6/8.",
        note: "Count the 12 bars under the 6/8 feel. The blues form stays the same, even when the feel changes.",
        sourceUrl: "https://newyorkjazzworkshop.com/demystifying-the-building-blocks-of-jazz-the-blues-and-basic-song-form-with-horace-silvers-senor-blues/",
      },
      {
        artist: "John Coltrane",
        title: "Mr. P.C.",
        recorded: "May 5, 1959, Atlantic Studios, New York",
        detail: "From the album Giant Steps, with Tommy Flanagan on piano, Paul Chambers and Art Taylor. It's a 12-bar minor blues in C minor. This chart is based on it.",
        note: "Listen for where Tommy Flanagan's left hand sits under the A♭7 to G7 in bars 9 and 10.",
        sourceUrl: "https://en.wikipedia.org/wiki/Mr._P.C.",
      },
    ],
    theme: { bg: "orchid", ink: "night", acc: "white", field: "navy" },
    source: {
      note: "The changes follow “Mr. P.C.”, with the home chord as a minor sixth chord. The scale and its B diminished partner come from Barry in class (barryharrismethod.com, step 9.5).",
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
      "Bebop players use these chords all the time. The A sections are the parts that repeat. They have 2 chords in each bar. Then comes a bridge of dominant sevenths, each one a 4th higher than the one before: D7, G7, C7, F7. That bridge is the same chain of dominants that opens “Indiana”.",
    chart: [
      { mark: "A", bars: ["Bb6 Gm7", "Cm7 F7", "Dm7 Gm7", "Cm7 F7", "Bb7", "Eb6 E°7", "Bb6 Gm7", "Cm7 F7"] },
      { mark: "A", bars: ["Bb6 Gm7", "Cm7 F7", "Dm7 Gm7", "Cm7 F7", "Bb7", "Eb6 E°7", "Cm7 F7", "Bb6"] },
      { mark: "B", bars: ["D7", "D7", "G7", "G7", "C7", "C7", "F7", "F7"] },
      { mark: "A", bars: ["Bb6 Gm7", "Cm7 F7", "Dm7 Gm7", "Cm7 F7", "Bb7", "Eb6 E°7", "Cm7 F7", "Bb6"] },
    ],
    uses: [
      { phase: "P1", text: "Week 3: just the bridge, in the left hand. It's the D7–G7–C7–F7 chain you first meet in “Indiana”." },
      { phase: "P2", text: "The A sections: B♭ sixth-diminished movement over B♭6, and the E°7 in bar 6. Then right-hand lines over the bridge." },
      { phase: "P3", text: "Lester Young's “Lester Leaps In” by ear. It's a riff tune on these chords." },
      { phase: "P4", text: "The head and a chorus, solo piano." },
    ],
    family: ["“Lester Leaps In” (Lester Young, 1939)", "“Wail” (Bud Powell, 1949, in E♭)", "“Cool Eyes” (Horace Silver, 1956): the A sections of Rhythm changes, with a different bridge", "“Anthropology” (Charlie Parker, in the Barry Book)"],
    recordings: [
      {
        artist: "Count Basie's Kansas City Seven, featuring Lester Young",
        title: "Lester Leaps In",
        recorded: "September 5, 1939, New York (Vocalion 5118)",
        detail: "With Buck Clayton, Dicky Wells, Count Basie, Freddie Green, Walter Page and Jo Jones.",
        note: "Lester plays on the same chords you'll play. How often does he land a phrase on beat 1?",
        sourceUrl: "https://en.wikipedia.org/wiki/Lester_Leaps_In",
      },
      {
        artist: "Bud Powell",
        title: "Wail",
        recorded: "August 9, 1949, WOR Studios, New York (Blue Note)",
        detail: "With Fats Navarro, Sonny Rollins, Tommy Potter and Roy Haynes. It's Rhythm changes in E♭.",
        note: "Listen to Bud's left hand on the bridge. He plays 1 short chord for each dominant.",
        sourceUrl: "https://ethaniverson.com/rhythm-and-blues/the-stuff-that-dreams-are-made-of/",
      },
      {
        artist: "Horace Silver Quintet",
        title: "Cool Eyes",
        recorded: "November 10, 1956, Hackensack, New Jersey (Blue Note)",
        detail: "From the album 6 Pieces of Silver. It has the A sections of “I Got Rhythm” with the bridge of “Honeysuckle Rose”.",
        note: "Notice that the bridge isn't the Rhythm changes bridge.",
        sourceUrl: "https://jazz.com/music/horace-silver-cool-eyes2",
      },
    ],
    theme: { bg: "cobalt", ink: "white", acc: "cyan", field: "cyan" },
    source: {
      note: "The form comes from the Wikipedia page “Rhythm changes”. The A sections follow the Barry Book, with Dm7 in bar 3 and E°7 in bar 6. The book writes B♭7/D and B♭6/F, with a bass note after the slash. Here they are written without the bass notes.",
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
      "This is bebop's favorite standard to rewrite. A standard is a well-known song that jazz players share. Charlie Parker's “Donna Lee” is a contrafact: a new melody on these chords, in A♭. Bud Powell plays piano on its first recording. Lester Young's 1942 trio record with Nat King Cole is in A♭ too. It's the model for how Lester plays this tune. Learn the changes in F first. Then move them to A♭, where Lester and Bird play them. Bird is Charlie Parker's nickname.",
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
      note: "The same changes moved up a minor third, which is 3 half steps, to A♭. A♭ is the key of “Donna Lee”, of Lester Young's 1942 “Indiana”, and of the Barry Book's chart.",
    },
    uses: [
      { phase: "P1", text: "Week 1, Friday: F6 movement over the opening bar. Week 3: the D7–G7–C7 chain in the left hand. Then the first phrase of Lester's second solo (1942) by ear, in A♭." },
      { phase: "P2", text: "The whole form in guide tones. Harris lines over the chain of dominants. Then the minor ii–V, Em7♭5 to A7, into D minor." },
      { phase: "P3", text: "The “Donna Lee” head by ear, 1 section at a time. Learn it from the 1947 record with Bud Powell on piano." },
      { phase: "P4", text: "Solo piano: the “Indiana” melody over guide tones, then a chorus." },
    ],
    family: ["“Donna Lee” (Charlie Parker, 1947, in A♭)"],
    recordings: [
      {
        artist: "Lester Young Trio",
        title: "Indiana",
        recorded: "July 1942, Los Angeles (Philo)",
        detail: "With Nat King Cole and Red Callender. Lester plays the tune, then Cole solos. Then Lester comes back for a second solo. That second solo is the one you learn here. It's in A♭, the key of “Donna Lee”. The key was measured from the recording.",
        note: "Week 3: sing the first phrase of the second solo with the record. Then find it on the piano in A♭. Lester also recorded the tune in 1944 (Savoy), and with Oscar Peterson in 1952.",
        sourceUrl: "https://adp.library.ucsb.edu/index.php/objects/refer/421212",
      },
      {
        artist: "Bud Powell Trio",
        title: "Indiana",
        recorded: "January 10, 1947, New York (Roost)",
        detail: "With Curly Russell and Max Roach.",
        note: "Listen to Bud's left hand. Count how many bars go by between chords.",
        sourceUrl: "https://www.jazzdisco.org/bud-powell/catalog/",
      },
      {
        artist: "Charlie Parker with Miles Davis",
        title: "Donna Lee",
        recorded: "May 8, 1947, Harry Smith Studios, New York (Savoy)",
        detail: "With Bud Powell, Tommy Potter and Max Roach. It's the new melody on these chords, in A♭.",
        note: "Sing the first 4 bars of the head. Keep going until you can sing them without the record.",
        sourceUrl: "https://www.jazzdisco.org/bud-powell/catalog/",
      },
    ],
    theme: { bg: "navy", ink: "white", acc: "cyan", field: "cyan" },
    source: {
      note: "Checked against 2 published charts and the Barry Book. The charts are Pocket Changes “Donna Lee” and Vanilla Book “Indiana”. The charts differ in small ways. Bar 28 is G°7 here and A♭°7 in one of them.",
      url: "https://www.jazzstandards.com/compositions-0/indiana.htm",
    },
  },
];

export function getVehicle(id: VehicleId): Vehicle {
  const v = VEHICLES.find((x) => x.id === id);
  if (!v) throw new Error(`Unknown tune ${id}`);
  return v;
}
