"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { GlossaryEntry } from "@/content/glossary";
import { glossParts } from "@/lib/gloss";

/*
 * Plain-language definitions on tap or hover. <Gloss text="..."/> renders a
 * passage with its music terms marked; the first time a term appears in the
 * passage it becomes a small button that opens a short definition.
 */

export function Term({ children, entry }: { children: ReactNode; entry: GlossaryEntry }) {
  // Hover shows the definition while the mouse is over the term; a click or tap pins it open.
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hover || pinned;
  const setOpen = (v: boolean) => {
    setHover(v);
    setPinned(v);
  };
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
        onClick={() => (pinned ? setOpen(false) : setPinned(true))}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}
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
