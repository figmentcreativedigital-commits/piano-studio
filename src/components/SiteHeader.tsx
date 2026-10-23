"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { metronome, type ClickMode, type MetroBeat } from "@/lib/audio";
import { PRIMARY_NAV, isFocusPath } from "@/lib/nav";
import { ListenButton } from "./ReadAloud";
import { NavIcon } from "./NavIcon";

function MetronomeGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M8.6 3.5h6.8l4.1 17H4.5z" />
      <path d="M12 16.5l5.5-9.5" />
      <path d="M7.2 13.5h9.6" opacity="0.55" />
    </svg>
  );
}

/**
 * The metronome. On wide screens its controls sit in the header. On phones
 * and tablets a single button opens them in a small panel. It's the same
 * set of controls either way, so the click keeps running while it's closed.
 */
function HeaderMetronome() {
  const [st, setSt] = useState({ on: false, tempo: metronome.tempo, mode: metronome.mode as ClickMode });
  const [beat, setBeat] = useState<MetroBeat | null>(null);
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const path = usePathname();

  useEffect(() => {
    const a = metronome.state.on(setSt);
    const b = metronome.beats.on(setBeat);
    return () => {
      a();
      b();
    };
  }, []);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    const close = (refocus: boolean) => {
      setOpen(false);
      if (refocus) toggle.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) close(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      close(!!wrap.current?.contains(document.activeElement));
    };
    const onFocus = (e: FocusEvent) => {
      if (e.target instanceof Node && !wrap.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocus);
    };
  }, [open]);

  const lit = !!beat?.audible && st.on;
  const light = `metro-light${lit ? " on" : ""}${lit && beat?.beat === 0 ? " down" : ""}`;
  return (
    <div className={`metro-wrap${open ? " is-open" : ""}${st.on ? " is-on" : ""}`} ref={wrap} data-tour="metronome">
      <button
        ref={toggle}
        type="button"
        className="metro-toggle"
        aria-expanded={open}
        aria-controls="metro-panel"
        aria-label={`Metronome, ${st.tempo} beats a minute, ${st.on ? "clicking" : "off"}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={light} aria-hidden="true" />
        <MetronomeGlyph />
        <span className="metro-toggle-tempo" aria-hidden="true">
          {st.tempo}
        </span>
      </button>
      <div className="metro" id="metro-panel" role="group" aria-label="Metronome">
        <span className="metro-head" aria-hidden="true">
          Metronome
        </span>
        <span className={light} aria-hidden="true" />
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
        <select className="metro-mode" aria-label="Click pattern" value={st.mode} onChange={(e) => metronome.setMode(e.target.value as ClickMode)}>
          <option value="every">Every beat</option>
          <option value="twofour">2 and 4</option>
          <option value="gap">4 on, 4 off</option>
        </select>
        <button type="button" className={`icon-btn metro-play${st.on ? " solid" : ""}`} aria-pressed={st.on} aria-label={st.on ? "Stop click" : "Start click"} onClick={() => metronome.toggle()}>
          {st.on ? "■" : "▶"}
        </button>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const path = usePathname();
  const focus = isFocusPath(path);
  return (
    <header className="site-header band" data-focus={focus ? "" : undefined}>
      <div className="wrap site-header-in">
        <Link href="/" className="wordmark" aria-label="Woodshed, today">
          Woodshed
        </Link>
        {/* One nav: pills in the header on wide screens, a tab bar at the bottom on phones. */}
        <nav className="nav" aria-label="Main" data-tour="main-nav">
          <ul>
            {PRIMARY_NAV.map((n) => {
              const here = path === n.href;
              const within = !here && n.owns(path);
              return (
                <li key={n.href}>
                  <Link href={n.href} aria-current={here ? "page" : within ? "true" : undefined}>
                    <span className="nav-mark">
                      <NavIcon name={n.icon} />
                    </span>
                    <span className="nav-label">{n.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="header-tools">
          <ListenButton />
          <HeaderMetronome />
        </div>
      </div>
    </header>
  );
}
