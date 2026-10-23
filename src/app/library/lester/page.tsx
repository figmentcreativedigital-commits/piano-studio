import type { Metadata } from "next";
import { LIBRARY_SECTIONS, getLibraryEntry } from "@/content/library";
import { LibraryExercises, LibraryPage, LibrarySection } from "@/components/LibraryPage";

const entry = getLibraryEntry("lester");

export const metadata: Metadata = { title: entry.name, description: entry.intro };

export default function LesterPage() {
  return (
    <LibraryPage title={entry.name} intro={entry.intro} kicker={entry.kicker} monogram={entry.monogram} theme={entry.theme} current={entry.href}>
      {/*
        ── CONTENT SLOT ─────────────────────────────────────────────
        Add this page's sections here, inside <LibrarySection>. Use
        <LibraryCards>/<LibraryCard>, <LibraryList> and <LibraryProse>
        for cards, lists and running text. See src/components/LibraryPage.tsx.
        ─────────────────────────────────────────────────────────────
      */}

      <LibrarySection title={LIBRARY_SECTIONS.lester.title} intro={LIBRARY_SECTIONS.lester.intro}>
        <LibraryExercises match={(e) => /lester/i.test(e.id) || /Lester Young/.test(e.recording?.artist ?? "")} />
      </LibrarySection>
    </LibraryPage>
  );
}
