"use client";

import { useSyncExternalStore } from "react";
import { EMPTY_RECORD, type CheckIn, type DayMark, type PracticeRecord } from "./planner";

/**
 * Local-first storage. Everything personal (check-ins, ratings, rep counts,
 * notes) stays in this browser on this device. Nothing is sent to a server.
 * Export and import move the record between devices or into a backup.
 */

type Sub = () => void;

function createStore<T>(key: string, initial: T) {
  let value: T = initial;
  let loaded = false;
  const subs = new Set<Sub>();
  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) value = { ...initial, ...JSON.parse(raw) };
    } catch {
      /* storage blocked: keep in memory */
    }
  };
  const persist = () => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage blocked: keep in memory */
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key !== key) return;
      try {
        value = e.newValue ? { ...initial, ...JSON.parse(e.newValue) } : initial;
      } catch {
        value = initial;
      }
      subs.forEach((s) => s());
    });
  }
  return {
    get(): T {
      load();
      return value;
    },
    set(next: T | ((prev: T) => T)) {
      load();
      value = typeof next === "function" ? (next as (p: T) => T)(value) : next;
      persist();
      subs.forEach((s) => s());
    },
    subscribe(s: Sub) {
      subs.add(s);
      return () => subs.delete(s);
    },
    serverValue: initial,
  };
}

export const recordStore = createStore<PracticeRecord>("woodshed.record.v1", EMPTY_RECORD);

export interface RepLog {
  clean: number;
  total: number;
  streak: number;
  best: number;
  tempo?: number;
}
export const repStore = createStore<{ days: Record<string, Record<string, RepLog>> }>("woodshed.reps.v1", { days: {} });

export interface SessionProgress {
  lessonId: string;
  version: "full" | "essential";
  date: string;
  block: number;
  remaining: number;
  running: boolean;
}
export const sessionStore = createStore<{ current: SessionProgress | null }>("woodshed.session.v1", { current: null });

export interface Prefs {
  theme: "system" | "light" | "dark";
  clickTempo: number;
}
export const prefsStore = createStore<Prefs>("woodshed.prefs.v1", { theme: "system", clickTempo: 72 });

export function useStore<T>(s: { get: () => T; subscribe: (cb: Sub) => () => boolean | void; serverValue: T }): T {
  return useSyncExternalStore(
    (cb) => {
      const un = s.subscribe(cb);
      return () => {
        un();
      };
    },
    s.get,
    () => s.serverValue,
  );
}

// ───────────────────────── Record actions ─────────────────────────

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function addCheckIn(c: Omit<CheckIn, "id" | "createdAt">): CheckIn {
  const full: CheckIn = { ...c, id: uid(), createdAt: new Date().toISOString() };
  recordStore.set((r) => ({ ...r, checkIns: [...r.checkIns, full] }));
  return full;
}

export function removeCheckIn(id: string) {
  recordStore.set((r) => ({ ...r, checkIns: r.checkIns.filter((c) => c.id !== id) }));
}

export function addMark(m: Omit<DayMark, "id" | "createdAt">) {
  recordStore.set((r) => ({ ...r, marks: [...r.marks.filter((x) => !(x.kind === m.kind && x.date === m.date)), { ...m, id: uid(), createdAt: new Date().toISOString() }] }));
}

export function undoAdjustment(id: string) {
  recordStore.set((r) => ({ ...r, undone: r.undone.includes(id) ? r.undone : [...r.undone, id] }));
}

export function redoAdjustment(id: string) {
  recordStore.set((r) => ({ ...r, undone: r.undone.filter((x) => x !== id) }));
}

export function logRep(date: string, exerciseId: string, clean: boolean, tempo?: number) {
  repStore.set((s) => {
    const day = { ...(s.days[date] ?? {}) };
    const prev = day[exerciseId] ?? { clean: 0, total: 0, streak: 0, best: 0 };
    const streak = clean ? prev.streak + 1 : 0;
    day[exerciseId] = { clean: prev.clean + (clean ? 1 : 0), total: prev.total + 1, streak, best: Math.max(prev.best, streak), tempo: tempo ?? prev.tempo };
    return { days: { ...s.days, [date]: day } };
  });
}

export function resetReps(date: string, exerciseId: string) {
  repStore.set((s) => {
    const day = { ...(s.days[date] ?? {}) };
    delete day[exerciseId];
    return { days: { ...s.days, [date]: day } };
  });
}

// ───────────────────────── Export / import ─────────────────────────

export interface ExportFile {
  app: "woodshed";
  schema: 1;
  exportedAt: string;
  record: PracticeRecord;
  reps: { days: Record<string, Record<string, RepLog>> };
}

export function exportData(): ExportFile {
  return { app: "woodshed", schema: 1, exportedAt: new Date().toISOString(), record: recordStore.get(), reps: repStore.get() };
}

/** Merges an export into this browser's record. Existing entries win on id clashes. */
export function importData(json: unknown): { checkIns: number; marks: number } {
  const f = json as Partial<ExportFile>;
  if (!f || f.app !== "woodshed" || f.schema !== 1 || !f.record || !Array.isArray(f.record.checkIns)) {
    throw new Error("This file isn't a Woodshed export. Export from the Progress page and try again.");
  }
  const cur = recordStore.get();
  const haveC = new Set(cur.checkIns.map((c) => c.id));
  const haveM = new Set(cur.marks.map((m) => m.id));
  const newC = f.record.checkIns.filter((c) => c && typeof c.id === "string" && !haveC.has(c.id));
  const newM = (f.record.marks ?? []).filter((m) => m && typeof m.id === "string" && !haveM.has(m.id));
  recordStore.set({
    version: 1,
    checkIns: [...cur.checkIns, ...newC],
    marks: [...cur.marks, ...newM],
    undone: [...new Set([...cur.undone, ...(f.record.undone ?? [])])],
  });
  if (f.reps?.days) {
    repStore.set((s) => {
      const days = { ...s.days };
      for (const [d, v] of Object.entries(f.reps!.days)) days[d] = { ...v, ...(days[d] ?? {}) };
      return { days };
    });
  }
  return { checkIns: newC.length, marks: newM.length };
}

export function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
