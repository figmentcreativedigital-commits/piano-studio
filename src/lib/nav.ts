/*
 * The site's information architecture in one place, so the header, the
 * phone tab bar, the footer sitemap and the breadcrumbs all agree.
 *
 * Five primary places hold everything. Every other page sits one step
 * below one of them, so nothing is more than two clicks from anywhere.
 */

export type NavIcon = "today" | "lessons" | "tunes" | "library" | "progress";

export interface NavItem {
  href: string;
  label: string;
  icon: NavIcon;
  /** Paths that belong to this place, for the highlighted tab. */
  owns: (path: string) => boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Today", icon: "today", owns: (p) => p === "/" || p.startsWith("/check-in") },
  { href: "/lessons", label: "Lessons", icon: "lessons", owns: (p) => p.startsWith("/lessons") || p.startsWith("/session") },
  { href: "/tunes", label: "Tunes", icon: "tunes", owns: (p) => p.startsWith("/tunes") },
  { href: "/library", label: "Library", icon: "library", owns: (p) => p.startsWith("/library") || p.startsWith("/listening") },
  { href: "/progress", label: "Progress", icon: "progress", owns: (p) => p.startsWith("/progress") || p.startsWith("/roadmap") },
];

/** Focus mode: no tab bar on phones, so nothing competes with the session. */
export const isFocusPath = (path: string) => path.startsWith("/session");

export interface SitemapGroup {
  heading: string;
  links: { href: string; label: string; external?: boolean }[];
}

export const SITEMAP: SitemapGroup[] = [
  {
    heading: "Practice",
    links: [
      { href: "/", label: "Today" },
      { href: "/lessons", label: "Lessons" },
      { href: "/check-in", label: "Check in" },
    ],
  },
  {
    heading: "Music",
    links: [
      { href: "/tunes", label: "The three tunes" },
      { href: "/library", label: "Library" },
      { href: "/library/parker", label: "Charlie Parker" },
      { href: "/library/bach", label: "Bach" },
      { href: "/library/lester", label: "Lester Young" },
      { href: "/library/barry", label: "Barry Harris" },
      { href: "/listening", label: "Recordings" },
    ],
  },
  {
    heading: "Progress",
    links: [
      { href: "/progress", label: "Progress" },
      { href: "/roadmap", label: "Your 12-week plan" },
    ],
  },
  {
    heading: "Help",
    links: [
      { href: "/method", label: "How it works" },
      { href: "/baseline.html", label: "Baseline session", external: true },
      { href: "/calendar.ics", label: "Calendar file (.ics)", external: true },
    ],
  },
];
