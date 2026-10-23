import Link from "next/link";
import type { Metadata } from "next";
import { themeVars } from "@/content";
import { LIBRARY, LIBRARY_INTRO, LIBRARY_TITLE, RECORDINGS_CARD } from "@/content/library";
import { readable } from "@/lib/speech-text";

export const metadata: Metadata = {
  title: "Library",
  description: "Charlie Parker, Bach, Lester Young, Barry Harris, and the recordings behind every lesson.",
};

export default function LibraryHub() {
  const cards = [...LIBRARY, RECORDINGS_CARD];
  return (
    <>
      <div className="wrap page-head" data-read-region>
        <h1 {...readable(LIBRARY_TITLE)}>{LIBRARY_TITLE}</h1>
        <p {...readable(LIBRARY_INTRO)}>{LIBRARY_INTRO}</p>
      </div>
      <div className="wrap">
        <ul className="shelf" data-tour="library-cards" aria-label="In the Library">
          {cards.map((c) => (
            <li key={c.href} className="shelf-item" style={themeVars(c.theme)}>
              <Link href={c.href} className="shelf-card">
                <span className="shelf-mono" aria-hidden="true">
                  {c.monogram}
                </span>
                <span className="shelf-kicker">{c.kicker}</span>
                <span className="shelf-name" {...readable(c.name)}>
                  {c.name}
                </span>
                <span className="shelf-blurb" {...readable(c.blurb)}>
                  {c.blurb}
                </span>
                <span className="shelf-go" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
