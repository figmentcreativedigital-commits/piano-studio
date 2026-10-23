"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { metronome, type ClickMode, type MetroBeat } from "@/lib/audio";

const NAV = [
  { href: "/", label: "Today" },
  { href: "/lessons", label: "Lessons" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/listening", label: "Listening" },
  { href: "/progress", label: "Progress" },
  { href: "/method", label: "Method" },
];

function HeaderMetronome() {
  const [st, setSt] = useState({ on: false, tempo: metronome.tempo, mode: metronome.mode as ClickMode });
  const [beat, setBeat] = useState<MetroBeat | null>(null);
  useEffect(() => {
    const a = metronome.state.on(setSt);
    const b = metronome.beats.on(setBeat);
    return () => {
      a();
      b();
    };
  }, []);
  const lit = !!beat?.audible;
  return (
    <div className="metro" role="group" aria-label="Metronome">
      <span className={`metro-light${lit ? " on" : ""}${lit && beat?.beat === 0 ? " down" : ""}`} aria-hidden="true" />
      <span className="metro-tempo">
        <button type="button" className="icon-btn" aria-label="Slower" onClick={() => metronome.setTempo(st.tempo - 2)}>
          −
        </button>
        <span aria-hidden="true">♩=</span>
        <input type="number" inputMode="numeric" min={30} max={240} value={st.tempo} aria-label="Metronome tempo" onChange={(e) => metronome.setTempo(Number(e.target.value) || 60)} />
        <button type="button" className="icon-btn" aria-label="Faster" onClick={() => metronome.setTempo(st.tempo + 2)}>
          +
        </button>
      </span>
      <select aria-label="Click pattern" value={st.mode} onChange={(e) => metronome.setMode(e.target.value as ClickMode)}>
        <option value="every">Every beat</option>
        <option value="twofour">2 and 4</option>
        <option value="gap">4 on, 4 off</option>
      </select>
      <button type="button" className={`icon-btn${st.on ? " solid" : ""}`} aria-pressed={st.on} aria-label={st.on ? "Stop click" : "Start click"} onClick={() => metronome.toggle()}>
        {st.on ? "■" : "▶"}
      </button>
    </div>
  );
}

export function SiteHeader() {
  const path = usePathname();
  const isCurrent = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="wordmark" aria-label="Woodshed, today">
          Woodshed
        </Link>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isCurrent(n.href) ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <HeaderMetronome />
      </div>
    </header>
  );
}
