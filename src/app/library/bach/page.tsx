import type { Metadata } from "next";
import { BACH_EDITIONS, BACH_PIECES, BACH_TEXT } from "@/content/bach";
import { getLibraryEntry } from "@/content/library";
import { LibraryCard, LibraryCards, LibraryExercises, LibraryList, LibraryPage, LibrarySection } from "@/components/LibraryPage";

const entry = getLibraryEntry("bach");

export const metadata: Metadata = { title: entry.name, description: entry.intro };

export default function BachPage() {
  return (
    <LibraryPage title={entry.name} intro={entry.intro} kicker={entry.kicker} monogram={entry.monogram} theme={entry.theme} current={entry.href}>
      <LibrarySection title={BACH_TEXT.piecesTitle} intro={BACH_TEXT.piecesIntro}>
        <LibraryCards>
          {BACH_PIECES.map((p) => (
            <LibraryCard key={p.id} href={`/library/bach/${p.id}`} title={p.title} tag={p.bwv} meta={`${p.bars} bars`}>
              <p>{p.summary}</p>
            </LibraryCard>
          ))}
        </LibraryCards>
      </LibrarySection>

      <LibrarySection title="Bach in your lessons" intro="Each card opens the lesson where you first play it.">
        <LibraryExercises match={(e) => e.source.kind === "bach"} />
      </LibrarySection>

      <LibrarySection title={BACH_TEXT.editionsTitle} intro={BACH_TEXT.editionsIntro}>
        <LibraryList
          items={[BACH_EDITIONS.inventions, BACH_EDITIONS.wtc1].map((e) => ({
            title: e.title,
            text: `Edited by ${e.editor}. License: ${e.license}.`,
          }))}
        />
      </LibrarySection>
    </LibraryPage>
  );
}
