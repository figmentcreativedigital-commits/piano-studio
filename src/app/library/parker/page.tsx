import type { Metadata } from "next";
import { getLibraryEntry } from "@/content/library";
import { PARKER_TEXT, parkerByForm, soloMeta, soloRecordLine, type ParkerSolo } from "@/content/parker";
import { LibraryCard, LibraryCards, LibraryPage, LibraryProse, LibrarySection } from "@/components/LibraryPage";

const entry = getLibraryEntry("parker");

export const metadata: Metadata = { title: entry.name, description: entry.intro };

function Solos({ list }: { list: ParkerSolo[] }) {
  return (
    <LibraryCards>
      {list.map((s) => (
        <LibraryCard key={s.slug} href={`/library/parker/${s.slug}`} title={s.title} meta={soloMeta(s)}>
          <p>{s.about}</p>
          <p className="lib-card-small">{soloRecordLine(s)}</p>
        </LibraryCard>
      ))}
    </LibraryCards>
  );
}

const byKey = (first: string) => (a: ParkerSolo, b: ParkerSolo) => Number(b.key === first) - Number(a.key === first) || a.pages[0] - b.pages[0];

export default function ParkerPage() {
  const t = PARKER_TEXT;
  return (
    <LibraryPage title={entry.name} intro={entry.intro} kicker={entry.kicker} monogram={entry.monogram} theme={entry.theme} current={entry.href}>
      <LibrarySection title={t.studyTitle} intro={t.studyIntro}>
        <ol className="lib-steps">
          {t.steps.map((s) => (
            <li key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </LibrarySection>

      <LibrarySection title={t.bluesTitle} intro={t.bluesIntro} id="blues">
        <Solos list={parkerByForm("blues").sort(byKey("F"))} />
      </LibrarySection>

      <LibrarySection title={t.rhythmTitle} intro={t.rhythmIntro} id="rhythm">
        <Solos list={parkerByForm("rhythm").sort(byKey("B♭"))} />
      </LibrarySection>

      <LibrarySection title={t.indianaTitle} intro={t.indianaIntro} id="indiana">
        <Solos list={parkerByForm("indiana")} />
      </LibrarySection>

      <LibrarySection title={t.bookTitle} intro={t.bookIntro}>
        <LibraryProse>
          <ul>
            {t.bookNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </LibraryProse>
      </LibrarySection>
    </LibraryPage>
  );
}
