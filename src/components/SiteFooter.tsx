import Link from "next/link";
import { SITEMAP } from "@/lib/nav";

/** Every page on the site, grouped the way the navigation is. */
export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <div className="footer-brand">
          <Link href="/" className="wordmark footer-mark">
            Woodshed
          </Link>
          <p>A piano studio for Walter Gross. Your practice data stays on this device.</p>
        </div>
        <nav aria-label="Site map" className="sitemap">
          {SITEMAP.map((g) => (
            <div key={g.heading} className="sitemap-group">
              <h2 id={`sitemap-${g.heading.toLowerCase()}`}>{g.heading}</h2>
              <ul aria-labelledby={`sitemap-${g.heading.toLowerCase()}`}>
                {g.links.map((l) => (
                  <li key={l.href}>{l.external ? <a href={l.href}>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}</li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
