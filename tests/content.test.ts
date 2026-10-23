import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { EXERCISES, LESSONS, PROGRAM, SKILLS, getExercise } from "@/content";
import { barLength, splitRaw } from "@/lib/abc-check";
import { beatsPerBar, buildAbc, chordsToBars, midiOf, specBars } from "@/lib/abc";
import { weekdayName } from "@/lib/schedule";

describe("lessons", () => {
  it("have unique ids", () => {
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(LESSONS.length);
  });

  it.each(LESSONS.map((l) => [l.id, l] as const))("%s: agenda totals the session length exactly", (_id, l) => {
    const total = l.blocks.reduce((s, b) => s + b.minutes, 0);
    expect(total).toBe(l.minutes);
  });

  it.each(LESSONS.map((l) => [l.id, l] as const))("%s: essential version is 15–20 minutes and adds up", (_id, l) => {
    const total = l.essential.blocks.reduce((s, b) => s + b.minutes, 0);
    expect(total).toBe(l.essential.minutes);
    expect(l.essential.minutes).toBeGreaterThanOrEqual(15);
    expect(l.essential.minutes).toBeLessThanOrEqual(20);
  });

  it.each(LESSONS.map((l) => [l.id, l] as const))("%s: includes a break, a check-in and a retrieval or log", (_id, l) => {
    expect(l.blocks.some((b) => b.kind === "break")).toBe(true);
    expect(l.blocks.some((b) => b.kind === "checkin" || b.kind === "setup")).toBe(true);
    expect(l.blocks.some((b) => b.kind === "retrieval")).toBe(true);
    if (l.minutes === 120) expect(l.blocks.filter((b) => b.kind === "break").length).toBeGreaterThanOrEqual(2);
  });

  it.each(LESSONS.map((l) => [l.id, l] as const))("%s: length and start time match the weekly schedule", (_id, l) => {
    const day = weekdayName(l.date);
    if (day === "Saturday") expect([l.minutes, l.start]).toEqual([120, PROGRAM.schedule.saturday.start]);
    else if (day === "Sunday") expect([l.minutes, l.start]).toEqual([120, PROGRAM.schedule.sunday.start]);
    else expect([l.minutes, l.start]).toEqual([60, PROGRAM.schedule.weekday.start]);
  });

  it("weekday sessions sit outside the 9–5 workday", () => {
    for (const l of LESSONS) {
      const day = weekdayName(l.date);
      if (day === "Saturday" || day === "Sunday") continue;
      const [h, m] = l.start.split(":").map(Number);
      const end = h * 60 + m + l.minutes;
      expect(end).toBeLessThanOrEqual(9 * 60);
    }
  });

  it("run on consecutive days", () => {
    const dates = LESSONS.map((l) => l.date).sort();
    for (let i = 1; i < dates.length; i++) {
      const a = new Date(dates[i - 1] + "T12:00:00Z").getTime();
      const b = new Date(dates[i] + "T12:00:00Z").getTime();
      expect((b - a) / 86400000).toBe(1);
    }
  });

  it("reference only exercises that exist", () => {
    for (const l of LESSONS) for (const b of [...l.blocks, ...l.essential.blocks]) for (const id of b.exerciseIds ?? []) expect(getExercise(id), `${l.id}/${b.id}: ${id}`).toBeDefined();
  });

  it("focus skills are known skills", () => {
    for (const l of LESSONS) for (const s of l.focus) expect(SKILLS[s], `${l.id}: ${s}`).toBeDefined();
  });
});

describe("exercises", () => {
  it("have unique ids", () => {
    expect(new Set(EXERCISES.map((e) => e.id)).size).toBe(EXERCISES.length);
  });

  it.each(EXERCISES.map((e) => [e.id, e] as const))("%s: has the teaching fields", (_id, e) => {
    expect(e.steps.length).toBeGreaterThan(0);
    expect(e.errors.length).toBeGreaterThan(0);
    expect(e.cue).toBeTruthy();
    expect(e.check).toBeTruthy();
    expect(e.easier).toBeTruthy();
    expect(e.source.note).toBeTruthy();
    for (const s of e.skills) expect(SKILLS[s], `${e.id}: ${s}`).toBeDefined();
  });

  it("left-hand material never assigns the thumb", () => {
    for (const e of EXERCISES) {
      if (e.hands === "RH") continue;
      for (const k of e.keyboard ?? []) for (const [, hand, label] of k.marks ?? []) if (hand === "L") expect(label, `${e.id}`).not.toBe("1");
      const n = e.notation;
      if (!n) continue;
      const lhBars = n.lh ?? (n.clef === "bass" ? n.bars ?? [] : []);
      for (const bar of lhBars) expect(bar.includes("!1!"), `${e.id}: ${bar}`).toBe(false);
    }
  });

  it.each(EXERCISES.filter((e) => e.notation).map((e) => [e.id, e] as const))("%s: every bar has the right length", (_id, e) => {
    const n = e.notation!;
    const per = beatsPerBar(n.meter);
    if (n.raw) {
      for (const bar of splitRaw(n.raw)) expect(barLength(bar, n.unit), bar).toBeCloseTo(per);
      return;
    }
    const b = specBars(n);
    const all = [...(b.bars ?? []), ...(b.rh ?? []), ...(b.lh ?? [])];
    expect(all.length).toBeGreaterThan(0);
    for (const bar of all) expect(barLength(bar, n.unit), bar).toBeCloseTo(per);
    if (b.rh && b.lh) expect(b.rh.length).toBe(b.lh.length);
  });

  it.each(EXERCISES.filter((e) => e.notation).map((e) => [e.id, e] as const))("%s: builds ABC", (_id, e) => {
    const abc = buildAbc(e.notation!, 4);
    expect(abc).toMatch(/^X:1/);
    expect(abc).toContain(`K:${e.notation!.key}`);
  });
});

describe("chord spelling", () => {
  it("writes flats only where the key signature doesn't supply them, and carries them through the bar", () => {
    const bars = chordsToBars(
      [
        { notes: ["G4", "Bb4", "Db5", "E5"], beats: 2 },
        { notes: ["A4", "C5", "D5", "F5"], beats: 2 },
      ],
      "F",
      "1/4",
    );
    // B♭ comes from the key signature; D♭ needs a flat; D natural afterwards needs a natural.
    expect(bars[0]).toBe("[GB_de]2 [Ac=df]2");
  });

  it("resets accidentals at the barline", () => {
    const bars = chordsToBars(
      [
        { notes: ["D4", "F4", "Ab4", "B4"], beats: 4 },
        { notes: ["D4", "F4", "Ab4", "B4"], beats: 4 },
      ],
      "C",
      "1/4",
    );
    expect(bars).toEqual(["[DF_AB]4", "[DF_AB]4"]);
  });

  it("maps pitch names to MIDI numbers with C4 = 60", () => {
    expect(midiOf("C4")).toBe(60);
    expect(midiOf("Ab4")).toBe(68);
    expect(midiOf("Eb3")).toBe(51);
    expect(midiOf("B3")).toBe(59);
  });
});

describe("internal links", () => {
  it("every exercise link points at a page that exists", () => {
    const routes = new Set(["/", "/lessons", "/tunes", "/roadmap", "/listening", "/progress", "/method", "/check-in"]);
    for (const e of EXERCISES) {
      if (!e.link) continue;
      const href = e.link.href.split("#")[0].split("?")[0];
      const ok = routes.has(href) || existsSync(`public${href}`) || /^\/(lessons|session)\/W\d\dD\d\d$/.test(href);
      expect(ok, `${e.id} → ${e.link.href}`).toBe(true);
    }
  });
});
