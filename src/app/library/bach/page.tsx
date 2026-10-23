import type { Metadata } from "next";
import { getLibraryEntry } from "@/content/library";
import { LibraryExercises, LibraryPage, LibrarySection } from "@/components/LibraryPage";

const entry = getLibraryEntry("bach");

export const metadata: Metadata = { title: entry.name, description: entry.intro };

export default function BachPage() {
  return (
    <LibraryPage title={entry.name} intro={entry.intro} kicker={entry.kicker} monogram={entry.monogram} theme={entry.theme} current={entry.href}>
      {/*
        ── CONTENT SLOT ─────────────────────────────────────────────
        Add this page's sections here, inside <LibrarySection>. Use
        <LibraryCards>/<LibraryCard>, <LibraryList> and <LibraryProse>
        for cards, lists and running text. See src/components/LibraryPage.tsx.
        ─────────────────────────────────────────────────────────────
      */}

      <LibrarySection title="Bach in your lessons" intro="Each card opens the lesson where you first play it.">
        <LibraryExercises match={(e) => e.source.kind === "bach"} />
      </LibrarySection>
    </LibraryPage>
  );
}
