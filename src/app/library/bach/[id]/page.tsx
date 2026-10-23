import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BACH_PIECES, BACH_TEXT, bachBookLine, bachCredit, bachSectionHeading, getBachPiece } from "@/content/bach";
import { getLibraryEntry } from "@/content/library";
import { BachScore } from "@/components/BachScore";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { glosser } from "@/components/glosser";
import { LibraryProse, LibrarySection } from "@/components/LibraryPage";
import { themeVars } from "@/content";
import { readable } from "@/lib/speech-text";

export function generateStaticParams() {
  return BACH_PIECES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = getBachPiece((await params).id);
  return p ? { title: `${p.title}, ${p.bwv}`, description: p.summary } : {};
}

export default async function BachPiecePage({ params }: { params: Promise<{ id: string }> }) {
  const piece = getBachPiece((await params).id);
  if (!piece) notFound();
  const entry = getLibraryEntry("bach");
  const g = glosser();
  return (
    <div className="lib" data-read-all>
      <header className="lib-head" style={themeVars(entry.theme)}>
        <div className="wrap lib-head-in">
          <Breadcrumbs items={[{ label: "Library", href: "/library" }, { label: "Bach", href: "/library/bach" }, { label: piece.title }]} />
          <p className="lib-kicker">
            {piece.bwv} · {piece.bars} bars
          </p>
          <h1 className="lib-title" {...readable(piece.title)}>
            {piece.title}
          </h1>
          <p className="lib-intro" {...readable(piece.summary)}>
            {g(piece.summary)}
          </p>
        </div>
        <span className="lib-monogram" aria-hidden="true">
          {piece.bwv.replace("BWV ", "")}
        </span>
      </header>
      <div className="wrap lib-body">
        <LibrarySection title={BACH_TEXT.playTitle} intro={BACH_TEXT.playIntro}>
          <div data-read-skip>
            <BachScore piece={piece} />
          </div>
          <p className="hint">{bachBookLine(piece)}</p>
        </LibrarySection>
        <LibrarySection title={BACH_TEXT.builtTitle}>
          <ol className="lib-list bach-plan">
            {piece.sections.map((s) => (
              <li key={s.title}>
                <h3 className="lib-list-title">{bachSectionHeading(s)}</h3>
                <p>{g(s.text)}</p>
              </li>
            ))}
          </ol>
        </LibrarySection>
        {piece.harmony && (
          <LibrarySection title={BACH_TEXT.chordsTitle} intro={BACH_TEXT.chordsIntro}>
            <ol className="bach-harmony" data-read-skip aria-label="The chord in each bar">
              {piece.harmony.map((c, i) => (
                <li key={i}>
                  <span className="bach-bar">Bar {i + 1}</span>
                  <span className="bach-chord">{c}</span>
                </li>
              ))}
            </ol>
          </LibrarySection>
        )}
        <LibrarySection title={BACH_TEXT.leftTitle}>
          <LibraryProse>
            <p>{g(piece.leftHand)}</p>
          </LibraryProse>
        </LibrarySection>
        <p className="hint lib-credit">{bachCredit(piece)}</p>
      </div>
    </div>
  );
}
