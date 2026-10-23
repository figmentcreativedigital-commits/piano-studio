import type { Metadata } from "next";
import { LIBRARY_SECTIONS, getLibraryEntry } from "@/content/library";
import { LibraryExercises, LibraryPage, LibrarySection } from "@/components/LibraryPage";

const entry = getLibraryEntry("barry");

export const metadata: Metadata = { title: entry.name, description: entry.intro };

export default function BarryPage() {
  return (
    <LibraryPage title={entry.name} intro={entry.intro} kicker={entry.kicker} monogram={entry.monogram} theme={entry.theme} current={entry.href}>
      {/*
        ── CONTENT SLOT ─────────────────────────────────────────────
        Add this page's sections here, inside <LibrarySection>. Use
        <LibraryCards>/<LibraryCard>, <LibraryList> and <LibraryProse>
        for cards, lists and running text. See src/components/LibraryPage.tsx.
        ─────────────────────────────────────────────────────────────
      */}

      <LibrarySection title={LIBRARY_SECTIONS.barry.title} intro={LIBRARY_SECTIONS.barry.intro}>
        <LibraryExercises match={(e) => e.source.kind === "harris"} />
      </LibrarySection>
    </LibraryPage>
  );
}
