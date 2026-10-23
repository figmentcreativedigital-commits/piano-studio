"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { GLOSSARY, type GlossaryEntry } from "@/content/glossary";

/*
 * Plain-language definitions on tap or hover. <Gloss text="..."/> renders a
 * passage with its music terms marked; the first time a term appears in the
 * passage it becomes a small button that opens a short definition.
 */

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const ENTRIES = GLOSSARY.flatMap((g) => g.match.map((m) => ({ m, g }))).sort((a, b) => b.m.length - a.m.length);
const BY_MATCH = new Map(ENTRIES.map((e) => [e.m.toLowerCase(), e.g]));
const RE = new RegExp(`(?<![\\w-])(${ENTRIES.map((e) => esc(e.m)).join("|")})(?![\\w-])`, "gi");

export function glossParts(text: string): (string | { text: string; entry: GlossaryEntry })[] {
  const out: (string | { text: string; entry: GlossaryEntry })[] = [];
  const seen = new Set<string>();
  let last = 0;
  for (const m of text.matchAll(RE)) {
    const entry = BY_MATCH.get(m[0].toLowerCase());
    if (!entry || seen.has(entry.term)) continue;
    seen.add(entry.term);
    if (m.index! > last) out.push(text.slice(last, m.index));
    out.push({ text: m[0], entry });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Term({ children, entry }: { children: ReactNode; entry: GlossaryEntry }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const bubble = useRef<HTMLSpanElement>(null);
  const id = useId();

  useLayoutEffect(() => {
    if (!open || !btn.current) return;
    const r = btn.current.getBoundingClientRect();
    const w = bubble.current?.offsetWidth ?? 280;
    const h = bubble.current?.offsetHeight ?? 80;
    const below = r.bottom + 8 + h < window.innerHeight;
    setPos({ top: below ? r.bottom + 8 : r.top - 8 - h, left: Math.max(12, Math.min(r.left, window.innerWidth - w - 12)) });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <span className="term">
      <button
        ref={btn}
        type="button"
        className="term-btn"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        {children}
      </button>
      {open && (
        <span ref={bubble} role="tooltip" id={id} className="term-def" style={pos ? { top: pos.top, left: pos.left } : { visibility: "hidden" }}>
          <b>{entry.term}.</b> {entry.def}
        </span>
      )}
    </span>
  );
}

export function Gloss({ text }: { text: string }) {
  return (
    <>
      {glossParts(text).map((p, i) =>
        typeof p === "string" ? (
          <span key={i}>{p}</span>
        ) : (
          <Term key={i} entry={p.entry}>
            {p.text}
          </Term>
        ),
      )}
    </>
  );
}
