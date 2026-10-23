import Link from "next/link";
import type { ReactNode } from "react";
import { EXERCISES, LESSONS, SOURCE_LABEL, lessonCode, themeVars } from "@/content";
import type { Exercise, SleeveTheme } from "@/content/types";
import { LIBRARY, RECORDINGS_CARD } from "@/content/library";
import { readable } from "@/lib/speech-text";
import { Breadcrumbs } from "./Breadcrumbs";
import { Gloss } from "./Gloss";

/*
 * One template for every Library page (Charlie Parker, Bach, Lester Young,
 * Barry Harris). It draws the colored title field, the breadcrumb, the
 * plain-language intro and the "More in the Library" links. Everything
 * else is the page's own, passed as children:
 *
 *   <LibraryPage title="Bach" intro="…" kicker="Composer, 1685–1750" monogram="JSB" theme={…}>
 *     <LibrarySection title="The inventions" intro="One line about this section.">
 *       <LibraryCards>
 *         <LibraryCard href="/lessons/W01D01#ex-bach-subj" title="Invention No. 1" meta="C major">…</LibraryCard>
 *       </LibraryCards>
 *       <LibraryList items={[{ title: "Bar 1", text: "…", href: "…" }]} />
 *       <LibraryProse>Paragraphs, lists, anything.</LibraryProse>
 *     </LibrarySection>
 *   </LibraryPage>
 *
 * Read aloud: these pages opt in to reading every heading, paragraph and
 * list item (data-read-all), so new writing is read without extra markup.
 * The title and intro carry their exact text for the studio narrator.
 */

export function LibraryPage({
  title,
  intro,
  kicker,
  monogram,
  theme,
  current,
  children,
}: {
  title: string;
  intro: string;
  kicker?: string;
  /** Large outlined letters in the title field, like the number on a sleeve. */
  monogram?: string;
  theme?: SleeveTheme;
  /** This page's href, so "More in the Library" leaves it out. */
  current?: string;
  children?: ReactNode;
}) {
  return (
    <div className="lib" data-read-all>
      <header className="lib-head" style={themeVars(theme)}>
        <div className="wrap lib-head-in">
          <Breadcrumbs items={[{ label: "Library", href: "/library" }, { label: title }]} />
          {kicker && <p className="lib-kicker">{kicker}</p>}
          <h1 className="lib-title" {...readable(title)}>
            {title}
          </h1>
          <p className="lib-intro" {...readable(intro)}>
            <Gloss text={intro} />
          </p>
        </div>
        {monogram && (
          <span className="lib-monogram" aria-hidden="true">
            {monogram}
          </span>
        )}
      </header>

      <div className="wrap lib-body">{children}</div>

      <nav className="wrap lib-more" aria-label="More in the Library">
        <h2>More in the Library</h2>
        <ul>
          {[...LIBRARY, RECORDINGS_CARD]
            .filter((e) => e.href !== current)
            .map((e) => (
              <li key={e.href}>
                <Link href={e.href} style={themeVars(e.theme)}>
                  <span className="lib-more-name">{e.name}</span>
                  <span className="lib-more-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
}

/** A part of a Library page, with its own heading and an optional one-line intro. */
export function LibrarySection({ title, intro, id, children }: { title: string; intro?: string; id?: string; children?: ReactNode }) {
  const hid = `lib-${(id ?? title).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section className="lib-section" id={id} aria-labelledby={hid}>
      <header className="lib-section-head">
        <h2 id={hid}>{title}</h2>
        {intro && <p>{intro}</p>}
      </header>
      {children}
    </section>
  );
}

/** Running text: paragraphs and lists, set for reading. */
export function LibraryProse({ children }: { children: ReactNode }) {
  return <div className="prose lib-prose">{children}</div>;
}

/** A grid of cards. */
export function LibraryCards({ children }: { children: ReactNode }) {
  return <ul className="lib-cards">{children}</ul>;
}

/** One card. With `href` the whole card is a link. */
export function LibraryCard({ title, meta, href, tag, children }: { title: string; meta?: string; href?: string; tag?: string; children?: ReactNode }) {
  const inner = (
    <>
      {tag && <span className="lib-card-tag">{tag}</span>}
      <h3 className="lib-card-title">{title}</h3>
      {meta && <p className="lib-card-meta">{meta}</p>}
      {children && <div className="lib-card-body">{children}</div>}
      {href && (
        <span className="lib-card-go" aria-hidden="true">
          →
        </span>
      )}
    </>
  );
  return <li className="lib-card">{href ? <Link href={href}>{inner}</Link> : <div>{inner}</div>}</li>;
}

/** A plain list of items, each with a title, a line of text and an optional link. */
export function LibraryList({ items }: { items: { title: string; text?: string; href?: string }[] }) {
  return (
    <ul className="lib-list">
      {items.map((i) => (
        <li key={i.title + (i.href ?? "")}>
          {i.href ? <Link href={i.href}>{i.title}</Link> : <strong>{i.title}</strong>}
          {i.text && <p>{i.text}</p>}
        </li>
      ))}
    </ul>
  );
}

/**
 * The exercises in the plan that match, each linked to the lesson where it
 * first appears. Built from the lesson content, so it stays current.
 */
export function LibraryExercises({ match, empty }: { match: (e: Exercise) => boolean; empty?: string }) {
  const found = EXERCISES.filter(match)
    .map((e) => ({ e, first: LESSONS.find((l) => l.blocks.some((b) => b.exerciseIds?.includes(e.id))) }))
    .filter((x) => x.first);
  if (!found.length) return <p className="lib-empty">{empty ?? "Nothing in the lessons yet. It arrives in a later week."}</p>;
  return (
    <LibraryCards>
      {found.map(({ e, first }) => (
        <LibraryCard key={e.id} href={`/lessons/${first!.id}#ex-${e.id}`} title={e.title} tag={SOURCE_LABEL[e.source.kind]} meta={`First in ${lessonCode(first!)}, ${first!.title}`}>
          {e.subtitle && <p>{e.subtitle}</p>}
        </LibraryCard>
      ))}
    </LibraryCards>
  );
}
