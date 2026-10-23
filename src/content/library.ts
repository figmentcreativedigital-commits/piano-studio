import type { SleeveTheme } from "./types";

/*
 * The Library: the people behind the lessons, plus the recordings. Each
 * entry's intro is short, plain and true, and is read aloud by the studio
 * narrator (see narrationTexts in src/lib/narration.ts). Detailed content
 * goes in each page's children slot (src/app/library/<id>/page.tsx).
 */

export type LibraryId = "parker" | "bach" | "lester" | "barry";

export interface LibraryEntry {
  id: LibraryId;
  href: string;
  /** The page title and card title. */
  name: string;
  /** A small line above the name: instrument and years. */
  kicker: string;
  /** One line on the Library card. */
  blurb: string;
  /** Two or three sentences at the top of the page. */
  intro: string;
  theme: SleeveTheme;
  /** Outlined letters in the title field, like the number on a sleeve. */
  monogram: string;
}

export const LIBRARY_TITLE = "Library";

export const LIBRARY_INTRO =
  "The Library is about the people behind your lessons. Each page says who they are and why they matter here. Recordings lists every record you listen to.";

export const LIBRARY: LibraryEntry[] = [
  {
    id: "parker",
    href: "/library/parker",
    name: "Charlie Parker",
    kicker: "Alto saxophone, 1920–1955",
    blurb: "How to play the blues, Rhythm changes and “Donna Lee”.",
    intro:
      "Charlie Parker played alto saxophone. He was one of the players who created bebop in the 1940s. In this program, he is the model for how to play the blues, Rhythm changes, and “Indiana” with its bebop line, “Donna Lee”.",
    monogram: "CP",
    theme: { bg: "navy", ink: "white", acc: "cyan", field: "cyan" },
  },
  {
    id: "bach",
    href: "/library/bach",
    name: "Bach",
    kicker: "Composer, 1685–1750",
    blurb: "Short pieces you play slowly and understand, with full scores.",
    intro:
      "Johann Sebastian Bach was a German composer. In his inventions, each hand plays its own line. In his C major prelude, every bar is one chord. You play them next to the jazz, slowly, and learn how they are built.",
    monogram: "JSB",
    theme: { bg: "night", ink: "white", acc: "orchid", field: "cyan" },
  },
  {
    id: "lester",
    href: "/library/lester",
    name: "Lester Young",
    kicker: "Tenor saxophone, 1909–1959",
    blurb: "How to shape a phrase so it breathes.",
    intro:
      "Lester Young played tenor saxophone in Count Basie's band in the 1930s. His solos are light, relaxed and easy to sing. In this program, he is the model for phrasing, which means how a line starts, breathes and ends.",
    monogram: "LY",
    theme: { bg: "orchid", ink: "night", acc: "white", field: "navy" },
  },
  {
    id: "barry",
    href: "/library/barry",
    name: "Barry Harris",
    kicker: "Piano and teaching, 1929–2021",
    blurb: "The method under everything you play.",
    intro:
      "Barry Harris was a jazz pianist from Detroit who taught bebop for many years. His method is the base of this program. The sixth-diminished scale and the chord movement you practice both come from his classes.",
    monogram: "BH",
    theme: { bg: "cyan", ink: "night", acc: "cobalt", field: "navy" },
  },
];

export const RECORDINGS_CARD = {
  href: "/listening",
  name: "Recordings",
  kicker: "Listening",
  blurb: "Every record in your lessons, with one question to answer.",
  monogram: "LP",
  theme: { bg: "slate", ink: "ice", acc: "cyan", field: "cyan" } as SleeveTheme,
};

export function getLibraryEntry(id: LibraryId): LibraryEntry {
  return LIBRARY.find((e) => e.id === id)!;
}

/** Section headings on the Library pages, shared with the narrator. */
export const LIBRARY_SECTIONS = {
  lester: { title: "Lester in your lessons", intro: "Each card opens the lesson where you first hear or play it." },
  barry: { title: "His method in your lessons", intro: "Each card opens the lesson where you first play it." },
  bach: { title: "Bach in your lessons", intro: "Each card opens the lesson where you first play it." },
} as const;
