"use client";

import { useEffect, useRef } from "react";
import type { NotationSpec } from "@/content/types";
import { buildAbc } from "@/lib/abc";
import type { AbcVisual } from "@/lib/audio";

type AbcjsModule = { renderAbc: (el: HTMLElement, abc: string, opts: object) => AbcVisual[] };
let abcjsPromise: Promise<AbcjsModule> | null = null;
function loadAbcjs(): Promise<AbcjsModule> {
  if (!abcjsPromise) abcjsPromise = import("abcjs").then((m) => (m.default ?? m) as unknown as AbcjsModule);
  return abcjsPromise;
}

/**
 * Engraved notation from a NotationSpec. Re-lays out when the width crosses a
 * breakpoint so systems never overflow; notes are drawn larger on wide screens
 * so they read from the bench.
 */
export function Score({
  spec,
  view = "full",
  onReady,
  label,
}: {
  spec: NotationSpec;
  view?: "full" | "faded" | "hidden";
  onReady?: (v: AbcVisual, el: HTMLElement) => void;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef<{ w: number; bpl: number } | null>(null);
  const ready = useRef(onReady);
  ready.current = onReady;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const render = async () => {
      const w = el.clientWidth;
      if (!w) return;
      const dense = spec.dense ?? spec.unit === "1/16";
      const maxBpl = spec.barsPerLine ?? 4;
      const bpl = dense ? (w >= 620 ? 2 : 1) : w >= 560 ? maxBpl : Math.min(2, maxBpl);
      if (last.current && Math.abs(last.current.w - w) < 24 && last.current.bpl === bpl) return;
      last.current = { w, bpl };
      const scale = w >= 700 ? 1.2 : w >= 520 ? 1.06 : 0.94;
      const staffwidth = Math.max(220, Math.floor(w / scale) - 24);
      const ABCJS = await loadAbcjs();
      if (cancelled) return;
      const res = ABCJS.renderAbc(el, buildAbc(spec, bpl), {
        add_classes: true,
        responsive: "resize",
        staffwidth,
        paddingleft: 6,
        paddingright: 6,
        paddingtop: 4,
        paddingbottom: 4,
      });
      if (res?.[0]) ready.current?.(res[0], el);
    };
    void render();
    const ro = new ResizeObserver(() => void render());
    ro.observe(el);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [spec]);

  return <div ref={ref} className={`score${view !== "full" ? ` ${view}` : ""}`} role="img" aria-label={label ?? "Notation"} />;
}
