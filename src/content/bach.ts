/*
 * Bach in Woodshed. The notes come from the Bach-Gesellschaft edition as typeset by the Mutopia
 * Project (Invention 1: Jeff Covey, CC BY-SA 3.0; Invention 8: Allen Garvin, public domain;
 * Prelude 1: Tobias Erbsland, public domain), converted to ABC and checked bar by bar against the
 * editions Walter uses: Nuno R. Rodrigues, Inventions and Sinfonias (CC BY-SA 4.0) and Knute Snortum,
 * Well-Tempered Clavier I (CC BY-SA 4.0). Bach's music itself is public domain.
 */
import type { NotationSpec } from "./types";

export interface BachSection { bars: [number, number]; title: string; text: string }
export interface BachPiece {
  id: string;
  title: string;
  bwv: string;
  key: string;
  bars: number;
  edition: { book: string; page: number };
  summary: string;
  sections: BachSection[];
  harmony?: string[];
  notation: NotationSpec;
  leftHand: string;
}

export const BACH_EDITIONS = {
  inventions: {
    title: "Inventions and Sinfonias, BWV 772–801",
    editor: "Nuno R. Rodrigues",
    license: "CC BY-SA 4.0",
    source: "IMSLP 977731",
  },
  wtc1: {
    title: "The Well-Tempered Clavier, Book I, BWV 846–869",
    editor: "Knute Snortum",
    license: "CC BY-SA 4.0",
    source: "IMSLP 932182",
  },
  notes: "The notes in Woodshed come from the old Bach-Gesellschaft edition, typeset by the Mutopia Project volunteers. They were checked against your two editions.",
} as const;

export const BACH_PIECES: BachPiece[] = [
  {
    id: "invention-1",
    title: "Invention No. 1 in C major",
    bwv: "BWV 772",
    key: "C",
    bars: 22,
    edition: { book: "inventions", page: 2 },
    summary:
      "Two voices, one in each hand, share one short tune. The tune is called the subject. It is 7 notes long: C D E F D E C. Bach plays it right side up, upside down, and in new keys. In 22 bars he travels from C to G, then to A minor, and then home to C.",
    sections: [
      { bars: [1, 6], title: "Out from C to G", text: "The right hand plays the subject. The left hand copies it half a bar later. By bar 7 the music has moved to G." },
      { bars: [7, 14], title: "Upside down, then to A minor", text: "Now the subject often goes down where it used to go up. Bach repeats small patterns, each time starting on a new note. By bar 15 the music reaches A minor." },
      { bars: [15, 22], title: "Home to C", text: "One hand holds long notes while the other plays the subject. The music walks back to C and ends on a big C chord." },
    ],
    notation: { meter: "C", unit: "1/16", key: "C", tempo: 60, rh: [
      "zCDE FDEC G2c2 !uppermordent!B2c2",
      "dGAB cABG d2g2 !uppermordent!f2g2",
      "eagf egfa gfed cedf",
      "edcB AcBd cBAG ^FAGB",
      "A2D2 c3d BAG^F EGFA",
      "GBAc Bdce dB1/2c1/2dg B2AG",
      "G2 z2 z4 zGAB cABG",
      "!uppermordent!^F2 z2 z4 zABc dBcA",
      "B2 z2 z4 zdcB AcBd",
      "c2 z2 z4 zedc Bd^ce",
      "d2^c2 d2e2 f2A2 B2c2",
      "d2^F2 ^G2A2 B2c2 d4-",
      "dE^F^G AFGE edce dcBd",
      "ca^gb aefd ^Gfed c2BA",
      "Aagf egfa g8-",
      "gefg afge f8-",
      "fgfe dfeg f8-",
      "fdef gefd e8-",
      "ecde fdec defg afge",
      "fgab c'abg c'2g2 e2dc",
      "c_BAG FAGB A=BcE DcFB",
      "!fermata![cGE]16",
    ], lh: [
      "z8 zC,D,E, F,D,E,C,",
      "G,2G,,2 z4 zG,A,B, CA,B,G,",
      "C2B,2 C2D2 E2G,2 A,2B,2",
      "C2E,2 ^F,2G,2 A,2B,2 C4-",
      "CD,E,^F, G,E,F,D, G,2B,,2 C,2D,2",
      "E,2^F,2 G,2E,2 B,,3C, D,2D,,2",
      "zG,,A,,B,, C,A,,B,,G,, D,2G,2 ^F,2G,2",
      "A,D,E,^F, G,E,F,D, A,2D2 C2D2",
      "[K:C clef=treble] G,GFE DFEG F2E2 F2D2",
      "EAGF EGFA G2F2 G2E2",
      "F_BAG FAGB AGFE DFEG",
      "FEDC B,DCE DCB,A, ^G,B,A,C",
      "[K:C clef=bass] B,2E,2 D3E CB,A,G, ^F,A,^G,B,",
      "A,CB,D CEDF E2A,2 E2E,2",
      "A,2A,,2 z4 zEDC B,D^CE",
      "D8- DA,B,C DB,CA,",
      "B,8- B,DCB, A,CB,D",
      "C8- CG,A,_B, CA,B,G,",
      "A,2_B,2 A,2G,2 F,2D2 C2B,2",
      "A,2F2 E2D2 ED,E,F, G,E,F,D,",
      "E,2C,2 D,2E,2 F,D,E,F, G,2G,,2",
      "!fermata![C,C,,]16",
    ], barsPerLine: 2, dense: true },
    leftHand:
      "Bar 1 of the left hand works without the thumb, with fingers 5-4-3-2-4-3-5. Most other left-hand bars need the thumb. Until your thumb is cleared, play only the left-hand notes that fall on the beat.",
  },
  {
    id: "prelude-1",
    title: "Prelude No. 1 in C major",
    bwv: "BWV 846",
    key: "C",
    bars: 35,
    edition: { book: "wtc1", page: 3 },
    summary:
      "Every bar is one chord, broken into the same pattern of notes. The left hand holds the two lowest notes. The right hand plays the top three, twice. So the piece is really a list of 35 chords, and each one leads to the next.",
    sections: [
      { bars: [1, 4], title: "C, out and back", text: "C, then D minor 7, then G7, then home to C. It's the shortest way out and back." },
      { bars: [5, 11], title: "On to G", text: "The chords lean toward G. Bar 11 is a G chord, the first stop." },
      { bars: [12, 19], title: "Diminished chords lead the way", text: "A diminished chord comes just before the chord it leads to. In bar 12 it leads to D minor. In bar 14 it leads back to C. Bar 19 is home again." },
      { bars: [20, 23], title: "Down to the low G", text: "The bass drops from C to F. Then it climbs through F♯ and A♭, and two diminished chords pull it up to G." },
      { bars: [24, 31], title: "Waiting on G", text: "The bass stays on a low G for 8 bars. The chords above it get tense, then relax onto G7." },
      { bars: [32, 35], title: "The ending", text: "The bass stays on a low C. The last bars spread the pattern out, and the piece ends on a C chord." },
    ],
    harmony: [
      "C",
      "Dm7/C",
      "G7/B",
      "C",
      "Am/C",
      "D7/C",
      "G/B",
      "Cmaj7/B",
      "Am7",
      "D7",
      "G",
      "C♯°7/G",
      "Dm/F",
      "B°7/F",
      "C/E",
      "Fmaj7/E",
      "Dm7",
      "G7",
      "C",
      "C7",
      "Fmaj7",
      "F♯°7",
      "B°7/A♭",
      "G7",
      "C/G",
      "G7sus4",
      "G7",
      "F♯°7/G",
      "C/G",
      "G7sus4",
      "G7",
      "C7",
      "F6/C",
      "G7/C",
      "C",
    ],
    notation: { meter: "C", unit: "1/16", key: "C", tempo: 60, rh: [
      "z2Gc eGce z2Gc eGce",
      "z2Ad fAdf z2Ad fAdf",
      "z2Gd fGdf z2Gd fGdf",
      "z2Gc eGce z2Gc eGce",
      "z2Ae aAea z2Ae aAea",
      "z2^FA dFAd z2FA dFAd",
      "z2Gd gGdg z2Gd gGdg",
      "z2EG cEGc z2EG cEGc",
      "z2EG cEGc z2EG cEGc",
      "z2D^F cDFc z2DF cDFc",
      "z2DG BDGB z2DG BDGB",
      "z2EG ^cEGc z2EG cEGc",
      "z2DA dDAd z2DA dDAd",
      "z2DF BDFB z2DF BDFB",
      "z2CG cCGc z2CG cCGc",
      "z2A,C FA,CF z2A,C FA,CF",
      "z2A,C FA,CF z2A,C FA,CF",
      "z2G,B, FG,B,F z2G,B, FG,B,F",
      "z2G,C EG,CE z2G,C EG,CE",
      "z2_B,C EB,CE z2B,C EB,CE",
      "z2A,C EA,CE z2A,C EA,CE",
      "z2A,C _EA,CE z2A,C EA,CE",
      "z2B,C DB,CD z2B,C DB,CD",
      "z2G,B, DG,B,D z2G,B, DG,B,D",
      "z2G,C EG,CE z2G,C EG,CE",
      "z2G,C FG,CF z2G,C FG,CF",
      "z2G,B, FG,B,F z2G,B, FG,B,F",
      "z2A,C ^FA,CF z2A,C FA,CF",
      "z2G,C GG,CG z2G,C GG,CG",
      "z2G,C FG,CF z2G,C FG,CF",
      "z2G,B, FG,B,F z2G,B, FG,B,F",
      "z2G,_B, EG,B,E z2G,B, EG,B,E",
      "z2F,A, CFCA, CA,F,A, F,D,F,D,",
      "z2GB dfdB dBGB DFED",
      "!fermata![EGc]16",
    ], lh: [
      "zE3- E4 zE3- E4 & C8 C8",
      "zD3- D4 zD3- D4 & C8 C8",
      "zD3- D4 zD3- D4 & B,8 B,8",
      "zE3- E4 zE3- E4 & C8 C8",
      "zE3- E4 zE3- E4 & C8 C8",
      "zD3- D4 zD3- D4 & C8 C8",
      "zD3- D4 zD3- D4 & B,8 B,8",
      "zC3- C4 zC3- C4 & B,8 B,8",
      "zC3- C4 zC3- C4 & A,8 A,8",
      "zA,3- A,4 zA,3- A,4 & D,8 D,8",
      "zB,3- B,4 zB,3- B,4 & G,8 G,8",
      "z_B,3- B,4 zB,3- B,4 & G,8 G,8",
      "zA,3- A,4 zA,3- A,4 & F,8 F,8",
      "z_A,3- A,4 zA,3- A,4 & F,8 F,8",
      "zG,3- G,4 zG,3- G,4 & E,8 E,8",
      "zF,3- F,4 zF,3- F,4 & E,8 E,8",
      "zF,3- F,4 zF,3- F,4 & D,8 D,8",
      "zD,3- D,4 zD,3- D,4 & G,,8 G,,8",
      "zE,3- E,4 zE,3- E,4 & C,8 C,8",
      "zG,3- G,4 zG,3- G,4 & C,8 C,8",
      "zF,3- F,4 zF,3- F,4 & F,,8 F,,8",
      "zC,3- C,4 zC,3- C,4 & ^F,,8 F,,8",
      "zF,3- F,4 zF,3- F,4 & _A,,8 A,,8",
      "zF,3- F,4 zF,3- F,4 & G,,8 G,,8",
      "zE,3- E,4 zE,3- E,4 & G,,8 G,,8",
      "zD,3- D,4 zD,3- D,4 & G,,8 G,,8",
      "zD,3- D,4 zD,3- D,4 & G,,8 G,,8",
      "z_E,3- E,4 zE,3- E,4 & G,,8 G,,8",
      "zE,3- E,4 zE,3- E,4 & G,,8 G,,8",
      "zD,3- D,4 zD,3- D,4 & G,,8 G,,8",
      "zD,3- D,4 zD,3- D,4 & G,,8 G,,8",
      "zC,3- C,4 zC,3- C,4 & C,,8 C,,8",
      "zC,3- C,4- C,8 & C,,16",
      "zB,,3- B,,4- B,,8 & C,,16",
      "C,16 & C,,16",
    ], barsPerLine: 2, dense: true },
    leftHand:
      "Bars 1–20, 22–23 and 25–31 fit the hand without the thumb: the two left-hand notes are never more than a 6th apart. Bars 21, 24 and 32–35 stretch a 7th or an octave. Until your thumb is cleared, play just the low note there.",
  },
  {
    id: "invention-8",
    title: "Invention No. 8 in F major",
    bwv: "BWV 779",
    key: "F",
    bars: 34,
    edition: { book: "inventions", page: 18 },
    summary:
      "The subject climbs an F chord, one note at a time, then runs back down the scale. The left hand chases the right hand one bar behind, like a round. It's in F, the key of our blues.",
    sections: [
      { bars: [1, 4], title: "The chase begins", text: "The right hand climbs the F chord and runs down. One bar later the left hand does the same thing an octave lower." },
      { bars: [5, 12], title: "Off to C", text: "The hands trade fast notes. B♭ turns into B natural, and by bar 12 the music has moved to C." },
      { bars: [13, 24], title: "Two minor keys", text: "The subject goes to G minor, then to D minor. Listen for the new sharps and flats: F♯ and E♭, then C♯." },
      { bars: [25, 34], title: "Home to F", text: "Bach passes through B♭, the key on the other side of F. Then he walks home and ends in F, where he started." },
    ],
    notation: { meter: "3/4", unit: "1/16", key: "F", tempo: 72, rh: [
      "z2F2 A2F2 c2F2",
      "f2ed cdcB ABAG",
      "F2A2 c2A2 f2c2",
      "ac'bc' ac'bc' ac'bc'",
      "faga faga faga",
      "dfef dfef dfef",
      "=B2G2 d2B2 f2d2",
      "gagf efed cdcB",
      "A2dc =BcBA GAGF",
      "EFED C2c=B c2E2",
      "F2c2 E2c2 D2=B2",
      "c4 z4 z4",
      "z2c2 e2c2 g2c2",
      "c'2=ba gagf efed",
      "cBca caBa caAa",
      "B2G2 B2G2 d2G2",
      "g2f_e dedc BcBA",
      "G2B2 d2B2 g2d2",
      "b2^c2 b2c2 b2c2",
      "d2A2 f2d2 a2f2",
      "gfgb cbdb ebcb",
      "fefa =Ba^ca daBa",
      "edeg Ag=Bg ^cgAg",
      "f2d2 B2d2 G2f2",
      "e2c2 A2c2 F2_e2",
      "df_ef dfef dfef",
      "Bdcd Bdcd Bdcd",
      "GBAB GBAB GBAB",
      "E2C2 G2E2 B2G2",
      "cdcB ABAG FGF_E",
      "D2GF EFED CDCB,",
      "A,B,A,G, F,2FE F2A,2",
      "B,2F2 A,2F2 G,2E2",
      "[A,CF]4 z4 z4",
    ], lh: [
      "z12",
      "z2F,2 A,2F,2 C2F,2",
      "F2ED CDCB, A,B,A,G,",
      "F,2A,2 C2A,2 F2C2",
      "[K:F clef=treble] AcBc AcBc AcBc",
      "FAGA FAGA FAGA",
      "DFEF DFEF DFEF",
      "[K:F clef=bass] =B,2G,2 C2G,2 E2C2",
      "FGFE DEDC =B,CB,A,",
      "G,2C=B, A,B,A,G, F,G,F,E,",
      "D,E,D,C, G,F,E,F, G,2G,,2",
      "z2C,2 E,2C,2 G,2C,2",
      "C2=B,A, G,A,G,F, E,F,E,D,",
      "C,2E,2 G,2E,2 C2G,2",
      "_E2^F,2 E2F,2 E2F,2",
      "G,2F,_E, D,E,D,C, B,,C,B,,A,,",
      "G,,2G,2 B,2G,2 D2G,2",
      "G2F_E DEDC B,CB,A,",
      "G,F,G,E G,EF,E G,EE,E",
      "F,E,F,D F,DE,D F,DD,D",
      "B,2G,2 E,2G,2 C,2E,2",
      "A,2F,2 D,2F,2 =B,,2D,2",
      "G,2E,2 ^C,2E,2 A,,2C,2",
      "D,,D,C,D, G,,D,A,,D, B,,D,G,,D,",
      "C,,C,B,,C, F,,C,G,,C, A,,C,F,,C,",
      "B,,2D,2 F,2D,2 B,2F,2",
      "DF_EF DFEF DFEF",
      "B,DCD B,DCD B,DCD",
      "G,B,A,B, G,B,A,B, G,B,A,B,",
      "E,2C,2 F,2C,2 A,2F,2",
      "B,CB,A, G,A,G,F, E,F,E,D,",
      "C,2F,E, D,E,D,C, B,,C,B,,A,,",
      "G,,A,,G,,F,, C,B,,A,,B,, C,2C,,2",
      "F,,4 z4 z4",
    ], barsPerLine: 3, dense: true },
    leftHand:
      "The left hand needs the thumb for its fast notes. Start it after your thumb is cleared. Until then, learn the right hand and sing the left.",
  },
];

export function getBachPiece(id: string): BachPiece | undefined {
  return BACH_PIECES.find((p) => p.id === id);
}

/** Words on the Bach pages, kept here so the page and the narrator use the same text. */
export const BACH_TEXT = {
  piecesTitle: "The pieces",
  piecesIntro: "Each piece has its full score. You can play it back, slow it down, and practice one section at a time.",
  editionsTitle: "Your books",
  editionsIntro: "These are the two editions you have. The page numbers in Woodshed match them.",
  playTitle: "Play it",
  playIntro: "Pick a section, then press Play. Change the tempo or play one hand at a time.",
  builtTitle: "How it's built",
  chordsTitle: "One chord per bar",
  chordsIntro: "Read the chords like a lead sheet. Then hear how each one leads to the next.",
  leftTitle: "Your left hand",
} as const;

export function bachSectionHeading(s: BachSection): string {
  return `Bars ${s.bars[0]}–${s.bars[1]}: ${s.title}`;
}

export function bachBookLine(p: BachPiece): string {
  return `In your book: ${BACH_EDITIONS[p.edition.book as "inventions" | "wtc1"].title}, page ${p.edition.page}.`;
}

export function bachCredit(p: BachPiece): string {
  const ed = BACH_EDITIONS[p.edition.book as "inventions" | "wtc1"];
  return `Score: the notes come from the Bach-Gesellschaft edition, typeset by the Mutopia Project. They match ${ed.editor}'s edition (${ed.license}, ${ed.source}).`;
}

export function bachTexts(): string[] {
  const out: string[] = Object.values(BACH_TEXT);
  for (const e of [BACH_EDITIONS.inventions, BACH_EDITIONS.wtc1]) out.push(e.title, `Edited by ${e.editor}. License: ${e.license}.`);
  for (const p of BACH_PIECES) {
    out.push(p.title, p.summary, p.leftHand, bachBookLine(p), bachCredit(p), `${p.bwv} · ${p.bars} bars`, `${p.bars} bars`);
    for (const s of p.sections) out.push(bachSectionHeading(s), s.text);
  }
  return out;
}
