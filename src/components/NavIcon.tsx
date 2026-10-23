import type { NavIcon as Name } from "@/lib/nav";

/** Simple line icons for the five places. 24 × 24, drawn in the current color. */
export function NavIcon({ name }: { name: Name }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    className: "nav-icon",
  };
  switch (name) {
    case "today":
      // A calendar page with today marked.
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
          <path d="M3.5 9.5h17M8 3v4M16 3v4" />
          <circle cx="12" cy="15" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "lessons":
      // A record: every lesson is an LP.
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.75" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 5.6a6.4 6.4 0 0 1 6.4 6.4" opacity="0.55" />
          <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "tunes":
      // Two beamed eighth notes.
      return (
        <svg {...common}>
          <path d="M9 17.5V6l10.5-2.5v11.5" />
          <path d="M9 9.2l10.5-2.5" />
          <ellipse cx="6.6" cy="17.6" rx="2.6" ry="2.1" fill="currentColor" stroke="none" />
          <ellipse cx="17.1" cy="15.1" rx="2.6" ry="2.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "library":
      // Books on a shelf, one leaning.
      return (
        <svg {...common}>
          <rect x="3.5" y="4" width="4" height="16" rx="0.8" />
          <rect x="9.25" y="7" width="4" height="13" rx="0.8" />
          <path d="M15.2 8.3l3.7-1 3.1 12-3.7 1z" />
          <path d="M3.5 8h4M9.25 11h4" />
        </svg>
      );
    case "progress":
      // Rising bars.
      return (
        <svg {...common}>
          <rect x="3.5" y="13" width="4" height="7.5" rx="0.8" />
          <rect x="10" y="8.5" width="4" height="12" rx="0.8" />
          <rect x="16.5" y="3.5" width="4" height="17" rx="0.8" />
        </svg>
      );
  }
}
