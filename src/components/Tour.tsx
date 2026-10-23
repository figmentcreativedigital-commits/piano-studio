"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TOUR, type TourStep } from "@/content/tour";
import { reader, speechSupported } from "@/lib/speech";
import { tourReading } from "@/lib/narration";

/*
 * Guided tour. The engine follows the EEC Institute prototype: chapters by
 * page, a spotlight ring whose shadow dims everything else, a card placed
 * beside the target (a bottom sheet on phones), a chapter menu, keyboard
 * control, and a place kept across reloads. Woodshed adds a first-visit
 * invitation, an optional "why it's taught this way" layer, and read-aloud.
 */

const RUN_KEY = "woodshed.tour.run.v1";
const SEEN_KEY = "woodshed.tour.seen.v1";
const CARD_W = 372;
const GAP = 14;
const PAD = 8;

type Flat = TourStep & { chapter: string; label: string; route: string };
const FLAT: Flat[] = TOUR.flatMap((c) => c.steps.map((s) => ({ ...s, chapter: c.id, label: c.label, route: c.route })));
type Box = { top: number; left: number; width: number; height: number };

const stepForPath = (path: string) => {
  const exact = FLAT.findIndex((s) => s.route === path);
  if (exact >= 0) return exact;
  const head = path.split("/")[1] ?? "";
  return FLAT.findIndex((s) => (s.route.split("/")[1] ?? "") === head);
};

const first = (target?: string | string[]) => {
  if (!target) return null;
  for (const sel of Array.isArray(target) ? target : [target]) {
    const el = document.querySelector<HTMLElement>(sel);
    if (el && el.getClientRects().length > 0) return el;
  }
  return null;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function read(on: boolean, s: Flat, why: boolean) {
  if (!on) return;
  reader.speak([{ text: tourReading(s, why) }], "tour");
}

export function Tour() {
  const router = useRouter();
  const pathname = usePathname();
  const [on, setOn] = useState(false);
  const [i, setI] = useState(0);
  const [why, setWhy] = useState(false);
  const [voice, setVoice] = useState(false);
  const [menu, setMenu] = useState(false);
  const [box, setBox] = useState<Box | null>(null);
  const [ready, setReady] = useState(false);
  const [missing, setMissing] = useState(false);
  const [invite, setInvite] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const [cardH, setCardH] = useState(260);
  const cardRef = useRef<HTMLDivElement>(null);
  const run = useRef(0);
  const wanted = useRef<string | null>(null);
  const seen = useRef<string | null>(null);
  const rehoming = useRef(false);
  const step = FLAT[i];

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(RUN_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setOn(Boolean(s.on));
        setI(Math.min(Number(s.i) || 0, FLAT.length - 1));
        setWhy(Boolean(s.why));
        setVoice(Boolean(s.voice));
      }
      if (!localStorage.getItem(SEEN_KEY)) setInvite(true);
    } catch {
      /* storage blocked: the tour still runs, it just forgets */
    }
    setCanSpeak(speechSupported());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(RUN_KEY, JSON.stringify({ on, i, why, voice }));
    } catch {
      /* ignore */
    }
  }, [on, i, why, voice, ready]);

  const markSeen = () => {
    setInvite(false);
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  /** Starting picks up where it makes sense: this page's chapter, or the start. */
  const start = useCallback(
    (fromTop = false) => {
      markSeen();
      if (fromTop) setI(0);
      else {
        const saved = FLAT[i];
        if (!saved || saved.route !== pathname) {
          const at = stepForPath(pathname);
          setI(at >= 0 ? at : 0);
        }
      }
      wanted.current = null;
      seen.current = pathname;
      setOn(true);
    },
    [i, pathname],
  );

  const stop = useCallback(() => {
    seen.current = null;
    wanted.current = null;
    setOn(false);
    setBox(null);
    setMenu(false);
    if (reader.state.label === "tour") reader.stop();
  }, []);

  const go = useCallback(
    (n: number) => {
      if (n < 0) return;
      if (n >= FLAT.length) {
        setI(0);
        return stop();
      }
      setI(n);
      setMenu(false);
    },
    [stop],
  );

  useEffect(() => setBox(null), [i]);

  // If the visitor navigates on their own, the tour follows instead of pulling them back.
  useEffect(() => {
    if (!on || !ready) return;
    const prev = seen.current;
    seen.current = pathname;
    if (prev === pathname) return;
    if (prev !== null && wanted.current) {
      if (wanted.current === pathname) wanted.current = null;
      return;
    }
    const cur = FLAT[i];
    if (!cur || cur.route === pathname) return;
    const at = stepForPath(pathname);
    if (at >= 0) {
      rehoming.current = true;
      setI(at);
    } else stop();
  }, [pathname, on, ready, i, stop]);

  // Place the spotlight.
  useEffect(() => {
    if (!on || !ready || !step) return;
    run.current++;
    if (rehoming.current) {
      rehoming.current = false;
      return;
    }
    const token = run.current;
    let canceled = false;
    const stale = () => canceled || run.current !== token;
    (async () => {
      setMissing(false);
      if (step.route !== pathname) {
        wanted.current = step.route;
        router.push(step.route);
        return;
      }
      read(voice, step, why);
      setBox(null);
      if (step.top) {
        window.scrollTo({ top: 0, behavior: "auto" });
        await sleep(120);
      }
      if (stale() || !step.target) return;
      let el: HTMLElement | null = null;
      for (let tries = 0; tries < 14 && !el; tries++) {
        el = first(step.target);
        if (!el) await sleep(130);
        if (stale()) return;
      }
      if (!el) {
        setMissing(true);
        return;
      }
      const r0 = el.getBoundingClientRect();
      const tall = r0.height > window.innerHeight * 0.6;
      const inView = r0.top >= 72 && r0.bottom <= window.innerHeight - 72;
      if (!inView) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ block: tall ? "start" : "center", behavior: reduce ? "auto" : "smooth" });
        await sleep(reduce ? 60 : 520);
      }
      if (stale()) return;
      const r = el.getBoundingClientRect();
      setBox({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: Math.min(r.height + PAD * 2, window.innerHeight - 24) });
    })();
    return () => {
      canceled = true;
    };
    // `why` and `voice` re-read the card but don't move the ring.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, ready, step, pathname, router]);

  // Keep the ring on its element when the page scrolls or resizes.
  useEffect(() => {
    if (!on || !step?.target) return;
    const sync = () => {
      const el = first(step.target);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setBox({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: Math.min(r.height + PAD * 2, window.innerHeight - 24) });
    };
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, { passive: true });
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync);
    };
  }, [on, step]);

  useLayoutEffect(() => {
    if (!on || !cardRef.current) return;
    const h = cardRef.current.offsetHeight;
    setCardH((cur) => (Math.abs(cur - h) > 2 ? h : cur));
  });

  // Move focus into the card when a step opens, so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (on) cardRef.current?.focus({ preventScroll: true });
  }, [on, i]);

  useEffect(() => {
    if (!on) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName) && !t.closest(".tour-card")) return;
      if (e.key === "Escape") stop();
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [on, i, go, stop]);

  const card = useMemo(() => {
    if (typeof window === "undefined") return {};
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (!box || step?.place === "center") return { left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: Math.min(CARD_W + 60, vw - 32) } as const;
    if (vw < 760) return { left: 12, right: 12, bottom: 12, width: "auto" } as const;
    let left = box.left + box.width / 2 - CARD_W / 2;
    left = Math.max(16, Math.min(left, vw - CARD_W - 16));
    const below = vh - (box.top + box.height) - GAP;
    const above = box.top - GAP;
    const need = cardH + 16;
    const clamp = (t: number) => Math.max(16, Math.min(t, Math.max(16, vh - cardH - 16)));
    if (step?.place === "top" && above >= need) return { left, top: clamp(box.top - GAP - cardH), width: CARD_W } as const;
    if (below >= need) return { left, top: clamp(box.top + box.height + GAP), width: CARD_W } as const;
    if (above >= need) return { left, top: clamp(box.top - GAP - cardH), width: CARD_W } as const;
    return { left, top: clamp(vh - cardH - 16), width: CARD_W } as const;
  }, [box, step, cardH]);

  if (!ready) return null;
  const inSession = pathname.startsWith("/session");

  if (!on) {
    return (
      <>
        {invite && !inSession && (
          <div className="tour-invite band" role="dialog" aria-labelledby="tour-invite-h" data-tour-ui>
            <p id="tour-invite-h">New here? A 2-minute tour shows you how Woodshed works.</p>
            <div className="btn-row">
              <button type="button" className="btn small primary" onClick={() => start(true)}>
                Take the tour
              </button>
              <button type="button" className="btn small ghost" onClick={markSeen}>
                Not now
              </button>
            </div>
          </div>
        )}
        {!inSession && (
          <button type="button" className="tour-fab band" data-tour-ui onClick={() => start(false)} aria-label={i > 0 ? "Resume the guided tour" : "Start the guided tour"}>
            <span aria-hidden="true" className="tour-fab-mark">
              ?
            </span>
            <span className="tour-fab-label">{i > 0 ? "Resume tour" : "Guided tour"}</span>
          </button>
        )}
      </>
    );
  }

  const chapterSteps = FLAT.filter((s) => s.chapter === step.chapter);
  const within = chapterSteps.indexOf(step) + 1;

  return (
    <div className="tour-layer" data-tour-ui>
      {box ? <div className="tour-ring" style={{ top: box.top, left: box.left, width: box.width, height: box.height }} /> : <div className="tour-dim" />}
      <div className="tour-card" ref={cardRef} tabIndex={-1} style={card as React.CSSProperties} role="dialog" aria-modal="false" aria-labelledby="tour-title" aria-describedby="tour-body">
        <div className="tour-top">
          <button type="button" className="tour-chapter" onClick={() => setMenu((v) => !v)} aria-expanded={menu} aria-controls="tour-menu">
            {step.label}
            <span aria-hidden="true" className={`chev${menu ? " is-open" : ""}`}>
              ▾
            </span>
          </button>
          <button type="button" className="tour-x" onClick={stop} aria-label="End the tour">
            ✕
          </button>
        </div>
        {menu && (
          <ul className="tour-menu" id="tour-menu">
            {TOUR.map((c) => {
              const at = FLAT.findIndex((s) => s.chapter === c.id);
              return (
                <li key={c.id}>
                  <button type="button" className={c.id === step.chapter ? "is-on" : undefined} aria-current={c.id === step.chapter ? "step" : undefined} onClick={() => go(at)}>
                    {c.label}
                    <small>
                      {c.steps.length} {c.steps.length === 1 ? "step" : "steps"}
                    </small>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <h2 id="tour-title" className="tour-title">
          {step.title}
        </h2>
        <p id="tour-body" className="tour-body" aria-live="polite">
          {step.body}
        </p>
        {missing && <p className="tour-warn">That part isn&apos;t on this page right now. Skip ahead with Next.</p>}
        {why && step.why && (
          <div className="tour-why">
            <p className="tour-why-h">Why it&apos;s taught this way</p>
            <p>{step.why}</p>
          </div>
        )}
        <div className="tour-foot">
          <span className="tour-count">
            {within} of {chapterSteps.length}, step {i + 1} of {FLAT.length}
          </span>
          <div className="btn-row">
            <button type="button" className="btn small ghost" onClick={() => go(i - 1)} disabled={i === 0}>
              Back
            </button>
            <button type="button" className="btn small primary" onClick={() => go(i + 1)}>
              {i === FLAT.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
        <div className="tour-switches">
          <label className="tour-switch">
            <input type="checkbox" checked={why} onChange={(e) => setWhy(e.target.checked)} />
            <span aria-hidden="true" />
            Why it&apos;s taught this way
          </label>
          {canSpeak && (
            <label className="tour-switch">
              <input
                type="checkbox"
                checked={voice}
                onChange={(e) => {
                  setVoice(e.target.checked);
                  if (e.target.checked) read(true, step, why);
                  else if (reader.state.label === "tour") reader.stop();
                }}
              />
              <span aria-hidden="true" />
              Read aloud
            </label>
          )}
        </div>
        <div className="tour-rail" aria-hidden="true">
          <i style={{ width: `${((i + 1) / FLAT.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
