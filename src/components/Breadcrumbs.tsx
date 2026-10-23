import Link from "next/link";

export interface Crumb {
  label: string;
  /** Leave out for the page you're on. */
  href?: string;
}

/**
 * Where you are, and the way back up: "Lessons › Week 1 › W01 D02".
 * The last crumb is the current page and isn't a link.
 */
export function Breadcrumbs({ items, className = "", tour }: { items: Crumb[]; className?: string; tour?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`crumbs ${className}`.trim()} data-tour={tour}>
      <ol>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`}>
              {c.href && !last ? (
                <Link href={c.href}>{c.label}</Link>
              ) : (
                <span aria-current={last ? "page" : undefined}>{c.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
