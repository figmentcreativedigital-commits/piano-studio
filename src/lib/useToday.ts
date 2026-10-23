"use client";

import { useSyncExternalStore } from "react";
import { PROGRAM } from "@/content";
import { localDate } from "./schedule";

/**
 * Today's date in the studio's time zone (America/New_York).
 * `?today=YYYY-MM-DD` previews another day without touching any data.
 */
function read(): string {
  try {
    const q = new URLSearchParams(window.location.search).get("today");
    if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q;
  } catch {
    /* ignore */
  }
  return localDate(new Date(), PROGRAM.timeZone);
}

let cached = "";
function snapshot() {
  const v = read();
  if (v !== cached) cached = v;
  return cached;
}

function subscribe(cb: () => void) {
  const id = setInterval(cb, 60_000);
  window.addEventListener("focus", cb);
  return () => {
    clearInterval(id);
    window.removeEventListener("focus", cb);
  };
}

export function useToday(): string {
  return useSyncExternalStore(subscribe, snapshot, () => PROGRAM.startDate);
}

export function isPreviewDate(): boolean {
  try {
    return !!new URLSearchParams(window.location.search).get("today");
  } catch {
    return false;
  }
}
