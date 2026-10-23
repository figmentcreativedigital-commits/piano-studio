import type { Metadata } from "next";
import { VEHICLES } from "@/content";
import { getLibraryEntry } from "@/content/library";
import { LibraryCard, LibraryCards, LibraryPage, LibrarySection } from "@/components/LibraryPage";

const entry = getLibraryEntry("parker");

export const metadata: Metadata = { title: entry.name, description: entry.intro };

export default function ParkerPage() {
  return (
    <LibraryPage title={entry.name} intro={entry.intro} kicker={entry.kicker} monogram={entry.monogram} theme={entry.theme} current={entry.href}>
      {/*
        ── CONTENT SLOT ─────────────────────────────────────────────
        Add this page's sections here, inside <LibrarySection>. Use
        <LibraryCards>/<LibraryCard>, <LibraryList> and <LibraryProse>
        for cards, lists and running text. See src/components/LibraryPage.tsx.
        ─────────────────────────────────────────────────────────────
      */}

      <LibrarySection title="His tunes in your program" intro="These are the tunes where you learn from his playing. Each one has a chart you can play along with.">
        <LibraryCards>
          {VEHICLES.filter((v) => v.id !== "minor-blues").map((v) => (
            <LibraryCard key={v.id} href={`/tunes#${v.id}`} title={v.name.replace(/"/g, "")} tag="Tune" meta={v.tune} />
          ))}
        </LibraryCards>
      </LibrarySection>
    </LibraryPage>
  );
}
