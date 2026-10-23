/*
 * Charlie Parker in Woodshed: every solo in the Charlie Parker Omnibook (concert-key edition)
 * on our three tunes. Parker's solos are under copyright, so the app never writes them out.
 * It points to the page and line in Walter's own book and to the record, and explains in words
 * what Bird does there. Recording details were checked against discographies (jazzdisco.org,
 * Peter Losin's session database, Wikipedia, Discogs); see docs/parker-recordings.md.
 */
import type { VehicleId } from "./types";

export interface ParkerRecording {
  date: string;
  place: string;
  band: string;
  issue: string;
  personnel: string;
  take: string;
  note?: string;
}

export interface ParkerSolo {
  slug: string;
  title: string;
  /** Printed page numbers in the concert-key Omnibook. */
  pages: [number, number];
  form: "blues" | "rhythm" | "indiana";
  vehicle: VehicleId;
  key: string;
  /** The quarter-note tempo printed in the book. */
  tempo: number;
  about: string;
  recording: ParkerRecording;
}

export const OMNIBOOK = {
  title: "Charlie Parker Omnibook",
  edition: "For C instruments (concert key)",
  publisher: "Atlantic Music Corp., 1978",
} as const;

export const PARKER_SOLOS: ParkerSolo[] = [
  {
    slug: "moose-the-mooche",
    title: "Moose the Mooche",
    pages: [
      4,
      5
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "B♭",
    tempo: 224,
    about: "Rhythm changes from Bird's first session as leader for Dial, in Hollywood. Dodo Marmarosa plays piano.",
    recording: {
      date: "March 28, 1946",
      place: "Radio Recorders, Hollywood",
      band: "Charlie Parker Septet",
      issue: "Dial 1003",
      personnel: "Dodo Marmarosa (piano), Miles Davis (trumpet), Lucky Thompson (tenor sax), Vic McMillan (bass), Roy Porter (drums)",
      take: "The issued take, most likely"
    }
  },
  {
    slug: "anthropology",
    title: "Anthropology",
    pages: [
      10,
      13
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "B♭",
    tempo: 300,
    about: "Rhythm changes, live at Birdland, with Bud Powell on piano and Dizzy Gillespie on trumpet.",
    recording: {
      date: "March 31, 1951",
      place: "Birdland, New York (live radio broadcast)",
      band: "Charlie Parker and Dizzy Gillespie",
      issue: "Columbia JC 34831, Summit Meeting at Birdland",
      personnel: "Bud Powell (piano), Dizzy Gillespie (trumpet), Tommy Potter (bass), Roy Haynes (drums)",
      take: "Live"
    }
  },
  {
    slug: "blues-for-alice",
    title: "Blues for Alice",
    pages: [
      18,
      19
    ],
    form: "blues",
    vehicle: "blues",
    key: "F",
    tempo: 165,
    about: "Bird's own blues changes: a new chord almost every bar. John Lewis plays piano.",
    recording: {
      date: "August 8, 1951",
      place: "RCA Victor studios, New York",
      band: "Charlie Parker Quintet",
      issue: "Clef MGC-646",
      personnel: "John Lewis (piano), Red Rodney (trumpet), Ray Brown (bass), Kenny Clarke (drums)",
      take: "The only take"
    }
  },
  {
    slug: "kc-blues",
    title: "K.C. Blues",
    pages: [
      20,
      21
    ],
    form: "blues",
    vehicle: "blues",
    key: "C",
    tempo: 126,
    about: "A slow blues in C, named for Kansas City, where Bird grew up.",
    recording: {
      date: "January 17, 1951",
      place: "New York",
      band: "Charlie Parker Quintet",
      issue: "Mercury/Clef 11101",
      personnel: "Walter Bishop Jr. (piano), Miles Davis (trumpet), Teddy Kotick (bass), Max Roach (drums)",
      take: "The only take"
    }
  },
  {
    slug: "celerity",
    title: "Celerity",
    pages: [
      22,
      23
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "B♭",
    tempo: 276,
    about: "Rhythm changes at a very fast tempo, with Hank Jones on piano.",
    recording: {
      date: "Fall 1950",
      place: "New York",
      band: "Charlie Parker Quartet (issued as “Celebrity”)",
      issue: "Verve MGV-8002",
      personnel: "Hank Jones (piano), Ray Brown (bass), Buddy Rich (drums)",
      take: "The only take",
      note: "The exact date isn't known."
    }
  },
  {
    slug: "au-privave-1",
    title: "Au Privave (No. 1)",
    pages: [
      24,
      25
    ],
    form: "blues",
    vehicle: "blues",
    key: "F",
    tempo: 220,
    about: "An F blues. Bird recorded it twice that day, and the Omnibook has both takes. Compare them.",
    recording: {
      date: "January 17, 1951",
      place: "New York",
      band: "Charlie Parker Quintet",
      issue: "Mercury/Clef 11087",
      personnel: "Walter Bishop Jr. (piano), Miles Davis (trumpet), Teddy Kotick (bass), Max Roach (drums)",
      take: "One of the two issued takes",
      note: "The two Omnibook versions are the two takes. The book doesn't say which is which."
    }
  },
  {
    slug: "au-privave-2",
    title: "Au Privave (No. 2)",
    pages: [
      26,
      27
    ],
    form: "blues",
    vehicle: "blues",
    key: "F",
    tempo: 220,
    about: "The other take of “Au Privave”. Listen for what Bird keeps and what he changes.",
    recording: {
      date: "January 17, 1951",
      place: "New York",
      band: "Charlie Parker Quintet",
      issue: "Mercury/Clef 11087 and Verve MGV-8010",
      personnel: "Walter Bishop Jr. (piano), Miles Davis (trumpet), Teddy Kotick (bass), Max Roach (drums)",
      take: "The other issued take",
      note: "The two Omnibook versions are the two takes. The book doesn't say which is which."
    }
  },
  {
    slug: "chi-chi",
    title: "Chi Chi",
    pages: [
      28,
      30
    ],
    form: "blues",
    vehicle: "blues",
    key: "A♭",
    tempo: 220,
    about: "A blues in A♭ on Bird's blues changes.",
    recording: {
      date: "July 1953",
      place: "Fulton Recording, New York",
      band: "Charlie Parker Quartet",
      issue: "Verve MGV-8005",
      personnel: "Al Haig (piano), Percy Heath (bass), Max Roach (drums)",
      take: "Probably the alternate take",
      note: "Sources give July 28 or July 30."
    }
  },
  {
    slug: "cosmic-rays",
    title: "Cosmic Rays",
    pages: [
      30,
      31
    ],
    form: "blues",
    vehicle: "blues",
    key: "C",
    tempo: 132,
    about: "A blues in C at an easy tempo, with Hank Jones on piano.",
    recording: {
      date: "December 30, 1952",
      place: "Fulton Recording, New York",
      band: "Charlie Parker Quartet",
      issue: "Verve MGV-8005",
      personnel: "Hank Jones (piano), Teddy Kotick (bass), Max Roach (drums)",
      take: "Probably the alternate take"
    }
  },
  {
    slug: "laird-baird",
    title: "Laird Baird",
    pages: [
      32,
      33
    ],
    form: "blues",
    vehicle: "blues",
    key: "B♭",
    tempo: 162,
    about: "A blues in B♭ on Bird's blues changes, with Hank Jones on piano.",
    recording: {
      date: "December 30, 1952",
      place: "Fulton Recording, New York",
      band: "Charlie Parker Quartet",
      issue: "Clef 89144",
      personnel: "Hank Jones (piano), Teddy Kotick (bass), Max Roach (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "mohawk-1",
    title: "Mohawk (No. 1)",
    pages: [
      38,
      39
    ],
    form: "blues",
    vehicle: "blues",
    key: "B♭",
    tempo: 168,
    about: "A B♭ blues with Thelonious Monk on piano. The Omnibook has two takes.",
    recording: {
      date: "June 6, 1950",
      place: "New York",
      band: "Charlie Parker and Dizzy Gillespie (Bird and Diz)",
      issue: "Mercury 11082",
      personnel: "Thelonious Monk (piano), Dizzy Gillespie (trumpet), Curly Russell (bass), Buddy Rich (drums)",
      take: "One of the two issued takes",
      note: "The book doesn't say which take is No. 1."
    }
  },
  {
    slug: "mohawk-2",
    title: "Mohawk (No. 2)",
    pages: [
      40,
      41
    ],
    form: "blues",
    vehicle: "blues",
    key: "B♭",
    tempo: 184,
    about: "The other take of “Mohawk”. Compare it with No. 1.",
    recording: {
      date: "June 6, 1950",
      place: "New York",
      band: "Charlie Parker and Dizzy Gillespie (Bird and Diz)",
      issue: "Mercury 11082 and Verve MGV-8006",
      personnel: "Thelonious Monk (piano), Dizzy Gillespie (trumpet), Curly Russell (bass), Buddy Rich (drums)",
      take: "The other issued take",
      note: "The book doesn't say which take is No. 2."
    }
  },
  {
    slug: "an-oscar-for-treadwell",
    title: "An Oscar for Treadwell",
    pages: [
      42,
      44
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "C",
    tempo: 230,
    about: "Rhythm changes in C, with Monk on piano.",
    recording: {
      date: "June 6, 1950",
      place: "New York",
      band: "Charlie Parker and Dizzy Gillespie (Bird and Diz)",
      issue: "Mercury 11082",
      personnel: "Thelonious Monk (piano), Dizzy Gillespie (trumpet), Curly Russell (bass), Buddy Rich (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "constellation",
    title: "Constellation",
    pages: [
      45,
      47
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "C",
    tempo: 324,
    about: "Rhythm changes in C at a very fast tempo.",
    recording: {
      date: "September 18, 1948",
      place: "Harry Smith Studios, New York",
      band: "Charlie Parker All Stars",
      issue: "Savoy 939",
      personnel: "John Lewis (piano), Miles Davis (trumpet), Curly Russell (bass), Max Roach (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "donna-lee",
    title: "Donna Lee",
    pages: [
      48,
      50
    ],
    form: "indiana",
    vehicle: "indiana",
    key: "A♭",
    tempo: 230,
    about: "Bird's line on the chords of “Indiana”. Bud Powell plays piano.",
    recording: {
      date: "May 8, 1947",
      place: "Harry Smith Studios, New York",
      band: "Charlie Parker All Stars",
      issue: "Savoy 652",
      personnel: "Bud Powell (piano), Miles Davis (trumpet), Tommy Potter (bass), Max Roach (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "kim-1",
    title: "Kim (No. 1)",
    pages: [
      51,
      53
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "B♭",
    tempo: 320,
    about: "Very fast Rhythm changes in B♭. The Omnibook has two takes.",
    recording: {
      date: "December 30, 1952",
      place: "Fulton Recording, New York",
      band: "Charlie Parker Quartet",
      issue: "Clef 89129",
      personnel: "Hank Jones (piano), Teddy Kotick (bass), Max Roach (drums)",
      take: "Probably the issued take",
      note: "The book doesn't say which take is No. 1."
    }
  },
  {
    slug: "kim-2",
    title: "Kim (No. 2)",
    pages: [
      54,
      57
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "B♭",
    tempo: 320,
    about: "The other take of “Kim”. Compare it with No. 1.",
    recording: {
      date: "December 30, 1952",
      place: "Fulton Recording, New York",
      band: "Charlie Parker Quartet",
      issue: "Verve MGV-8005",
      personnel: "Hank Jones (piano), Teddy Kotick (bass), Max Roach (drums)",
      take: "Probably the alternate take",
      note: "The book doesn't say which take is No. 2."
    }
  },
  {
    slug: "cheryl",
    title: "Cheryl",
    pages: [
      58,
      59
    ],
    form: "blues",
    vehicle: "blues",
    key: "C",
    tempo: 180,
    about: "A blues in C, live at the Royal Roost club.",
    recording: {
      date: "March 12, 1949",
      place: "Royal Roost, New York (live radio broadcast)",
      band: "Charlie Parker",
      issue: "Savoy MG 12179",
      personnel: "Al Haig (piano), Kenny Dorham (trumpet), Lucky Thompson (tenor sax), Milt Jackson (vibes), Tommy Potter (bass), Max Roach (drums)",
      take: "Live",
      note: "This is a live version, not the 1947 studio record."
    }
  },
  {
    slug: "thriving-from-a-riff",
    title: "Thriving from a Riff",
    pages: [
      60,
      61
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "B♭",
    tempo: 230,
    about: "Rhythm changes from Bird's first session as leader. The same tune later became “Anthropology”.",
    recording: {
      date: "November 26, 1945",
      place: "WOR Studios, New York",
      band: "Charlie Parker's Re-Boppers",
      issue: "Savoy 903",
      personnel: "Sadik Hakim (piano), Miles Davis (trumpet), Curly Russell (bass), Max Roach (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "red-cross",
    title: "Red Cross",
    pages: [
      66,
      67
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "B♭",
    tempo: 210,
    about: "One of Bird's earliest small-band records, from 1944. Rhythm changes in B♭.",
    recording: {
      date: "September 15, 1944",
      place: "WOR Studios, New York",
      band: "Tiny Grimes Quintette",
      issue: "Savoy 532",
      personnel: "Clyde Hart (piano), Tiny Grimes (guitar), Jimmy Butts (bass), Doc West (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "barbados",
    title: "Barbados",
    pages: [
      70,
      71
    ],
    form: "blues",
    vehicle: "blues",
    key: "F",
    tempo: 168,
    about: "An F blues with a Latin feel in the melody, live at the Royal Roost.",
    recording: {
      date: "February 12, 1949",
      place: "Royal Roost, New York (live radio broadcast)",
      band: "Charlie Parker Quintet",
      issue: "Savoy MG 12179",
      personnel: "Al Haig (piano), Kenny Dorham (trumpet), Tommy Potter (bass), Max Roach (drums)",
      take: "Live",
      note: "This is a live version, not the 1948 studio record."
    }
  },
  {
    slug: "perhaps",
    title: "Perhaps",
    pages: [
      72,
      73
    ],
    form: "blues",
    vehicle: "blues",
    key: "C",
    tempo: 200,
    about: "A blues in C with John Lewis on piano.",
    recording: {
      date: "September 24, 1948",
      place: "Harry Smith Studios, New York",
      band: "Charlie Parker All Stars",
      issue: "Savoy 938",
      personnel: "John Lewis (piano), Miles Davis (trumpet), Curly Russell (bass), Max Roach (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "nows-the-time-1",
    title: "Now's the Time (No. 1)",
    pages: [
      74,
      75
    ],
    form: "blues",
    vehicle: "blues",
    key: "F",
    tempo: 132,
    about: "Bird's 1953 version of his F blues, at an easy tempo, with Al Haig on piano.",
    recording: {
      date: "July 1953",
      place: "Fulton Recording, New York",
      band: "Charlie Parker Quartet",
      issue: "Clef MGC-157",
      personnel: "Al Haig (piano), Percy Heath (bass), Max Roach (drums)",
      take: "The only take",
      note: "Sources give July 28 or July 30."
    }
  },
  {
    slug: "nows-the-time-2",
    title: "Now's the Time (No. 2)",
    pages: [
      76,
      77
    ],
    form: "blues",
    vehicle: "blues",
    key: "F",
    tempo: 220,
    about: "The 1945 original of Bird's F blues. Dizzy Gillespie plays piano.",
    recording: {
      date: "November 26, 1945",
      place: "WOR Studios, New York",
      band: "Charlie Parker's Re-Boppers",
      issue: "Savoy 573",
      personnel: "Dizzy Gillespie (piano), Miles Davis (trumpet), Curly Russell (bass), Max Roach (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "buzzy",
    title: "Buzzy",
    pages: [
      78,
      79
    ],
    form: "blues",
    vehicle: "blues",
    key: "B♭",
    tempo: 230,
    about: "A blues in B♭ with Bud Powell on piano.",
    recording: {
      date: "May 8, 1947",
      place: "Harry Smith Studios, New York",
      band: "Charlie Parker All Stars",
      issue: "Savoy 652",
      personnel: "Bud Powell (piano), Miles Davis (trumpet), Tommy Potter (bass), Max Roach (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "billies-bounce",
    title: "Billie's Bounce",
    pages: [
      80,
      81
    ],
    form: "blues",
    vehicle: "blues",
    key: "F",
    tempo: 165,
    about: "A classic F blues melody. Dizzy Gillespie plays piano.",
    recording: {
      date: "November 26, 1945",
      place: "WOR Studios, New York",
      band: "Charlie Parker's Re-Boppers",
      issue: "Savoy 573",
      personnel: "Dizzy Gillespie (piano), Miles Davis (trumpet), Curly Russell (bass), Max Roach (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "chasing-the-bird",
    title: "Chasing the Bird",
    pages: [
      82,
      83
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "F",
    tempo: 210,
    about: "Rhythm changes in F, live at the Royal Roost.",
    recording: {
      date: "March 12, 1949",
      place: "Royal Roost, New York (live radio broadcast)",
      band: "Charlie Parker",
      issue: "Savoy MG 12179",
      personnel: "Al Haig (piano), Kenny Dorham (trumpet), Lucky Thompson (tenor sax), Milt Jackson (vibes), Tommy Potter (bass), Max Roach (drums)",
      take: "Live",
      note: "This is a live version, not the 1947 studio record."
    }
  },
  {
    slug: "blue-bird",
    title: "Blue Bird",
    pages: [
      84,
      85
    ],
    form: "blues",
    vehicle: "blues",
    key: "E♭",
    tempo: 125,
    about: "A blues in E♭ at a relaxed tempo.",
    recording: {
      date: "December 21, 1947",
      place: "United Sound Studios, Detroit",
      band: "Charlie Parker Quintet",
      issue: "Savoy 961",
      personnel: "Duke Jordan (piano), Miles Davis (trumpet), Tommy Potter (bass), Max Roach (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "visa",
    title: "Visa",
    pages: [
      100,
      101
    ],
    form: "blues",
    vehicle: "blues",
    key: "C",
    tempo: 200,
    about: "A blues in C.",
    recording: {
      date: "Early 1949",
      place: "New York",
      band: "Charlie Parker",
      issue: "Mercury 11022",
      personnel: "Al Haig (piano), Kenny Dorham (trumpet), Tommy Turk (trombone), Tommy Potter (bass), Max Roach (drums), Carlos Vidal (bongos)",
      take: "The only issued take",
      note: "The exact date isn't known."
    }
  },
  {
    slug: "passport",
    title: "Passport",
    pages: [
      102,
      103
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "B♭",
    tempo: 220,
    about: "Rhythm changes in B♭, with Al Haig on piano.",
    recording: {
      date: "May 5, 1949",
      place: "New York",
      band: "Charlie Parker Quintet",
      issue: "Mercury 11022",
      personnel: "Al Haig (piano), Kenny Dorham (trumpet), Tommy Potter (bass), Max Roach (drums)",
      take: "The well-known take",
      note: "A different tune with the same name, a blues, exists on another take."
    }
  },
  {
    slug: "another-hairdo",
    title: "Another Hairdo",
    pages: [
      104,
      105
    ],
    form: "blues",
    vehicle: "blues",
    key: "B♭",
    tempo: 184,
    about: "A blues in B♭ with a tricky, start-and-stop melody.",
    recording: {
      date: "December 21, 1947",
      place: "United Sound Studios, Detroit",
      band: "Charlie Parker Quintet",
      issue: "Savoy 961",
      personnel: "Duke Jordan (piano), Miles Davis (trumpet), Tommy Potter (bass), Max Roach (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "back-home-blues",
    title: "Back Home Blues",
    pages: [
      106,
      107
    ],
    form: "blues",
    vehicle: "blues",
    key: "C",
    tempo: 192,
    about: "A blues in C with John Lewis on piano.",
    recording: {
      date: "August 8, 1951",
      place: "RCA Victor studios, New York",
      band: "Charlie Parker Quintet",
      issue: "Mercury 11095",
      personnel: "John Lewis (piano), Red Rodney (trumpet), Ray Brown (bass), Kenny Clarke (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "bloomdido",
    title: "Bloomdido",
    pages: [
      108,
      109
    ],
    form: "blues",
    vehicle: "blues",
    key: "B♭",
    tempo: 240,
    about: "A blues in B♭ with Monk on piano.",
    recording: {
      date: "June 6, 1950",
      place: "New York",
      band: "Charlie Parker and Dizzy Gillespie (Bird and Diz)",
      issue: "Mercury 11058",
      personnel: "Thelonious Monk (piano), Dizzy Gillespie (trumpet), Curly Russell (bass), Buddy Rich (drums)",
      take: "The only take"
    }
  },
  {
    slug: "steeplechase",
    title: "Steeplechase",
    pages: [
      112,
      113
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "B♭",
    tempo: 176,
    about: "Rhythm changes in B♭ with John Lewis on piano.",
    recording: {
      date: "September 24, 1948",
      place: "Harry Smith Studios, New York",
      band: "Charlie Parker All Stars",
      issue: "Savoy 937",
      personnel: "John Lewis (piano), Miles Davis (trumpet), Curly Russell (bass), Max Roach (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "merry-go-round",
    title: "Merry-Go-Round",
    pages: [
      117,
      119
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "B♭",
    tempo: 300,
    about: "Very fast Rhythm changes in B♭.",
    recording: {
      date: "September 24, 1948",
      place: "Harry Smith Studios, New York",
      band: "Charlie Parker All Stars",
      issue: "Savoy 937",
      personnel: "John Lewis (piano), Miles Davis (trumpet), Curly Russell (bass), Max Roach (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "blues-fast",
    title: "Blues (Fast)",
    pages: [
      124,
      127
    ],
    form: "blues",
    vehicle: "blues",
    key: "B♭",
    tempo: 265,
    about: "A fast blues in B♭, with Hank Jones on piano.",
    recording: {
      date: "March 1950",
      place: "New York",
      band: "Charlie Parker Quartet",
      issue: "Verve MGV-8009",
      personnel: "Hank Jones (piano), Ray Brown (bass), Buddy Rich (drums)",
      take: "The only issued take",
      note: "The exact date isn't known."
    }
  },
  {
    slug: "shawnuff",
    title: "Shawnuff",
    pages: [
      128,
      130
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "B♭",
    tempo: 326,
    about: "Very fast Rhythm changes with Dizzy Gillespie, from a 1945 radio show.",
    recording: {
      date: "December 1945, probably December 29",
      place: "NBC Studios, Hollywood (radio broadcast)",
      band: "Dizzy Gillespie and His Rebop Six",
      issue: "Phoenix LP 17",
      personnel: "Al Haig (piano), Dizzy Gillespie (trumpet), Milt Jackson (vibes), Ray Brown (bass), Stan Levey (drums)",
      take: "Live",
      note: "This is a radio version, not the 1945 Guild studio record."
    }
  },
  {
    slug: "leap-frog",
    title: "Leap Frog",
    pages: [
      130,
      133
    ],
    form: "rhythm",
    vehicle: "rhythm",
    key: "F",
    tempo: 330,
    about: "Rhythm changes in F. Bird and Dizzy Gillespie trade short solos.",
    recording: {
      date: "June 6, 1950",
      place: "New York",
      band: "Charlie Parker and Dizzy Gillespie (Bird and Diz)",
      issue: "Mercury 11076",
      personnel: "Thelonious Monk (piano), Dizzy Gillespie (trumpet), Curly Russell (bass), Buddy Rich (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "parkers-mood",
    title: "Parker's Mood",
    pages: [
      134,
      135
    ],
    form: "blues",
    vehicle: "blues",
    key: "B♭",
    tempo: 76,
    about: "A slow blues in B♭. It's one of Bird's most famous solos.",
    recording: {
      date: "September 18, 1948",
      place: "Harry Smith Studios, New York",
      band: "Charlie Parker All Stars",
      issue: "Savoy 936",
      personnel: "John Lewis (piano), Curly Russell (bass), Max Roach (drums)",
      take: "The issued take"
    }
  },
  {
    slug: "si-si",
    title: "Si Si",
    pages: [
      140,
      141
    ],
    form: "blues",
    vehicle: "blues",
    key: "F",
    tempo: 188,
    about: "An F blues on Bird's blues changes, like “Blues for Alice”.",
    recording: {
      date: "August 8, 1951",
      place: "RCA Victor studios, New York",
      band: "Charlie Parker Quintet",
      issue: "Mercury 11103",
      personnel: "John Lewis (piano), Red Rodney (trumpet), Ray Brown (bass), Kenny Clarke (drums)",
      take: "The only take"
    }
  },
];

export function getParkerSolo(slug: string): ParkerSolo | undefined {
  return PARKER_SOLOS.find((s) => s.slug === slug);
}

export const parkerByForm = (form: ParkerSolo["form"]) => PARKER_SOLOS.filter((s) => s.form === form);

/** Words on the Parker pages, kept here so the page and the narrator use the same text. */
export const PARKER_TEXT = {
  studyTitle: "How to learn a Bird phrase",
  studyIntro: "Use the same steps for every phrase. Keep your Omnibook open on the stand.",
  steps: [
    { title: "Hear it", text: "Find the phrase on the record and listen to it 3 times. Don't look at the book yet." },
    { title: "Sing it", text: "Sing along with Bird until you can sing it alone, in time." },
    { title: "Find it", text: "Find the notes on the piano by ear, one at a time, with your right hand." },
    { title: "Check it", text: "Now look at the book: the page, line and bar. Fix any note you got wrong." },
    { title: "Understand it", text: "Read what the guide says about it. Which chord tones land on the beats? Where is the added half step?" },
    { title: "Play it on the tune", text: "Play it over the chart on the Tunes page, with your left hand on guide tones." },
  ],
  bookTitle: "Your Omnibook",
  bookIntro: "Woodshed uses the edition for C instruments, so every key and chord here is the real one you hear on the record.",
  bookNotes: [
    "Page numbers are the numbers printed in the book.",
    "Each line of music has a number at its left. Bars are counted from the left of that line.",
    "The book doesn't show where each solo starts on the record. Listen for the first notes to find it.",
  ],
  bluesTitle: "The blues",
  bluesIntro: "Bird recorded the blues in many keys. Start with the ones in F, the key of your lessons.",
  rhythmTitle: "Rhythm changes",
  rhythmIntro: "The chords of “I Got Rhythm”. Most are in B♭, like the chart on the Tunes page.",
  indianaTitle: "“Indiana” and “Donna Lee”",
  indianaIntro: "Bird's line on the chords of “Indiana”, in A♭.",
  guideTitle: "Phrase by phrase",
  guideIntro: "Every phrase Bird plays, in order. Each note was read from the book and checked against Barry's ideas. If the guide and the page ever disagree, trust the page.",
  recordTitle: "The record",
} as const;

export function soloMeta(s: ParkerSolo): string {
  return `Page ${s.pages[0]} · ${s.key} · ♩ = ${s.tempo}`;
}

export function soloRecordLine(s: ParkerSolo): string {
  return `${s.recording.band}. ${s.recording.date}. ${s.recording.place}.`;
}

export function parkerTexts(): string[] {
  const t = PARKER_TEXT;
  const out: string[] = [t.studyTitle, t.studyIntro, t.bookTitle, t.bookIntro, ...t.bookNotes, t.bluesTitle, t.bluesIntro, t.rhythmTitle, t.rhythmIntro, t.indianaTitle, t.indianaIntro, t.guideTitle, t.guideIntro, t.recordTitle];
  for (const s of t.steps) out.push(s.title, s.text);
  for (const s of PARKER_SOLOS) {
    out.push(s.title, s.about, soloMeta(s), soloRecordLine(s), s.recording.personnel, s.recording.issue, s.recording.take);
    if (s.recording.note) out.push(s.recording.note);
  }
  return out;
}
