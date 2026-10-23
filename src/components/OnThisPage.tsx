"use client";

import { useEffect, useRef, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
  /** A shorter label for phones, where the bar is one row of chips. */
  short?: string;
}

/**
 * "On this page": jump links to the big parts of a long page. On phones it
 * becomes a sticky row of chips once you scroll past it, and the chip for
 * the part you're reading is highlighted.
 */
export function OnThisPage({ items, tour }: { items: TocItem[]; tour?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const [stuck, setStuck] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = Math.min(window.innerHeight * 0.3, 240);
      let cur = items[0]?.id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) cur = it.id;
      }
      setActive(cur);
      const n = nav.current;
      if (n) {
        const top = parseFloat(getComputedStyle(n).top);
        setStuck(Number.isFinite(top) && getComputedStyle(n).position === "sticky" && n.getBoundingClientRect().top <= top + 0.5 && window.scrollY > 0);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  // Keep the highlighted chip in view inside the bar, without moving the page.
  useEffect(() => {
    const l = list.current;
    const a = l?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!l || !a || l.scrollWidth <= l.clientWidth) return;
    const want = a.offsetLeft - (l.clientWidth - a.offsetWidth) / 2;
    l.scrollTo({ left: Math.max(0, want), behavior: "smooth" });
  }, [active]);

  return (
    <nav ref={nav} className={`toc${stuck ? " is-stuck" : ""}`} aria-label="On this page" data-tour={tour}>
      <span className="toc-label" aria-hidden="true">
        On this page
      </span>
      <ol className="toc-list" ref={list}>
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} aria-current={active === it.id ? "true" : undefined} onClick={() => setActive(it.id)}>
              {it.short ? (
                <>
                  <span className="toc-long">{it.label}</span>
                  <span className="toc-short" aria-hidden="true">
                    {it.short}
                  </span>
                </>
              ) : (
                it.label
              )}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
