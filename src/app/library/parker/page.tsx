import type { Metadata } from "next";
import { getLibraryEntry } from "@/content/library";
import { PARKER_TEXT, getParkerSolo, parkerByForm, soloMeta, soloRecordLine, type ParkerSolo } from "@/content/parker";
import { PARKER_ANALYSIS, type SpotRef } from "@/content/parker-analysis";
import Link from "next/link";
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

function Spots({ list }: { list: SpotRef[] }) {
  return (
    <ul className="pk-spots">
      {list.map((r) => {
        const s = getParkerSolo(r.slug);
        return (
          <li key={`${r.slug}-${r.page}-${r.line}-${r.bar}`}>
            <Link href={`/library/parker/${r.slug}#p${r.page}-${r.line}-${r.bar}`}>
              {s?.title}, page {r.page}, line {r.line}, bar {r.bar}
            </Link>
            {r.text ? <span className="muted"> {r.text}</span> : null}
          </li>
        );
      })}
    </ul>
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

      {PARKER_ANALYSIS.habits.length > 0 && (
        <LibrarySection title={t.habitsTitle} intro={t.habitsIntro(PARKER_ANALYSIS)} id="habits">
          <ul className="pk-habits">
            {PARKER_ANALYSIS.habits.map((h) => (
              <li key={h.id}>
                <p className="pk-big">{h.big}</p>
                <h3>{h.label}</h3>
                <p>{h.text}</p>
                <Spots list={h.examples} />
              </li>
            ))}
          </ul>
        </LibrarySection>
      )}

      {PARKER_ANALYSIS.concepts.length > 0 && (
        <LibrarySection title={t.conceptsTitle} intro={t.conceptsIntro} id="barry">
          <ol className="pk-concepts">
            {PARKER_ANALYSIS.concepts.map((c) => (
              <li key={c.id} id={`idea-${c.id}`}>
                <h3>{c.name}</h3>
                <p>
                  <b>Barry: </b>
                  {c.barry}{" "}
                  <a href={c.link} target="_blank" rel="noreferrer">
                    His class (step {c.step})
                  </a>
                </p>
                <p>
                  <b>Bird: </b>
                  {c.bird}
                </p>
                <Spots list={c.examples} />
              </li>
            ))}
          </ol>
        </LibrarySection>
      )}

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
