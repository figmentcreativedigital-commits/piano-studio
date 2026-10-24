import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { themeVars } from "@/content";
import { getLibraryEntry } from "@/content/library";
import { PARKER_SOLOS, PARKER_TEXT, getParkerSolo, soloFacts, soloKicker } from "@/content/parker";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { glosser } from "@/components/glosser";
import { LibrarySection } from "@/components/LibraryPage";
import { readable } from "@/lib/speech-text";

export function generateStaticParams() {
  return PARKER_SOLOS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const s = getParkerSolo((await params).slug);
  return s ? { title: `${s.title}: Charlie Parker`, description: s.about } : {};
}

function search(q: string) {
  const s = encodeURIComponent(q);
  return [
    { label: "Find on Spotify", href: `https://open.spotify.com/search/${s}` },
    {
      label: "Find on YouTube",
      href: `https://www.youtube.com/results?search_query=${s}`,
    },
  ];
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt>{k}</dt>
      <dd>{v}</dd>
    </>
  );
}

export default async function ParkerSoloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const solo = getParkerSolo((await params).slug);
  if (!solo) notFound();
  const entry = getLibraryEntry("parker");
  const g = glosser();
  const t = PARKER_TEXT;
  const r = solo.recording;
  const i = PARKER_SOLOS.findIndex((s) => s.slug === solo.slug);
  const prev = PARKER_SOLOS[i - 1];
  const next = PARKER_SOLOS[i + 1];
  return (
    <div className="lib" data-read-all>
      <header className="lib-head" style={themeVars(entry.theme)}>
        <div className="wrap lib-head-in">
          <Breadcrumbs
            items={[
              { label: "Library", href: "/library" },
              { label: "Charlie Parker", href: "/library/parker" },
              { label: solo.title },
            ]}
          />
          <p className="lib-kicker">
            {soloKicker(solo)}
          </p>
          <h1 className="lib-title" {...readable(solo.title)}>
            {solo.title}
          </h1>
          <p className="lib-intro" {...readable(solo.about)}>
            {g(solo.about)}
          </p>
          <p className="btn-row" data-read-skip>
            {search(
              `Charlie Parker ${solo.title.replace(/\s*\(No\. \d\)/, "")}`,
            ).map((l) => (
              <a
                key={l.href}
                className="btn small"
                href={l.href}
                target="_blank"
                rel="noreferrer"
              >
                {l.label}
              </a>
            ))}
            <Link className="btn small ghost" href={`/tunes#${solo.vehicle}`}>
              The chart
            </Link>
          </p>
        </div>
        <span className="lib-monogram is-num" aria-hidden="true">
          {solo.pages[0]}
        </span>
      </header>
      <div className="wrap lib-body">
        <LibrarySection title={t.recordTitle}>
          <dl className="facts pk-facts">
            {soloFacts(solo).map(([k, v]) => (
              <Fact key={k} k={k} v={v} />
            ))}
          </dl>
          {r.note && <p className="hint">{r.note}</p>}
        </LibrarySection>

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

        <nav className="pager" aria-label="More Parker solos">
          {prev ? (
            <Link
              className="pager-link prev"
              href={`/library/parker/${prev.slug}`}
              rel="prev"
            >
              <span className="pager-dir">Previous solo</span>
              <span className="pager-title">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              className="pager-link next"
              href={`/library/parker/${next.slug}`}
              rel="next"
            >
              <span className="pager-dir">Next solo</span>
              <span className="pager-title">{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </div>
  );
}
