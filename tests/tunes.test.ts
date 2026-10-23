import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { EXERCISES, LESSONS, PHASES, VEHICLES, getExercise } from "@/content";
import { TOUR } from "@/content/tour";
import { chartChords, chartSpec, guideTones, prettyChord, transposeChart, voice } from "@/lib/changes";
import { barLength } from "@/lib/abc-check";

const name = (s: { letter: string; acc: number }) => `${s.letter}${s.acc === -1 ? "♭" : s.acc === 1 ? "♯" : ""}`;

describe("the three tunes", () => {
  it("are rhythm, blues, minor blues and Indiana", () => {
    expect(VEHICLES.map((v) => v.id).sort()).toEqual(["blues", "indiana", "minor-blues", "rhythm"]);
  });

  it("have the expected lengths", () => {
    const bars = (id: string) => VEHICLES.find((v) => v.id === id)!.chart.reduce((n, s) => n + s.bars.length, 0);
    expect(bars("rhythm")).toBe(32);
    expect(bars("indiana")).toBe(32);
    expect(bars("blues")).toBe(12);
    expect(bars("minor-blues")).toBe(12);
  });

  it("spell guide tones correctly", () => {
    expect(guideTones("F7").map(name)).toEqual(["A", "E♭"]);
    expect(guideTones("Bb7").map(name)).toEqual(["D", "A♭"]);
    expect(guideTones("Cm6").map(name)).toEqual(["E♭", "A"]);
    expect(guideTones("E°7").map(name)).toEqual(["G", "D♭"]);
    expect(guideTones("D7").map(name)).toEqual(["F♯", "C"]);
    expect(guideTones("Em7b5").map(name)).toEqual(["G", "D"]);
    expect(guideTones("G°7").map(name)).toEqual(["B♭", "E"]);
  });

  it("voice the F blues exactly as Week 1 teaches it", () => {
    const f7 = voice("F7");
    const bb7 = voice("Bb7", f7.midi);
    const c7 = voice("C7", bb7.midi);
    expect(f7.midi).toEqual([51, 57]); // E♭3 + A3
    expect(bb7.midi).toEqual([50, 56]); // D3 + A♭3
    expect(c7.midi).toEqual([52, 58]); // E3 + B♭3
  });

  for (const v of VEHICLES) {
    for (const alt of [false, true]) {
      if (alt && !v.alt) continue;
      it(`${v.id}${alt ? " (alt key)" : ""}: engraves full bars inside a comfortable left-hand range`, () => {
        const chart = alt && v.alt ? transposeChart(v.chart, v.alt.steps, v.alt.semitones) : v.chart;
        const spec = chartSpec(chart, alt && v.alt ? v.alt.abcKey : v.abcKey, v.tempo);
        for (const bar of spec.bars!) expect(barLength(bar.replace(/^\[P:[A-Z]\] /, ""), "1/4")).toBeCloseTo(4);
        for (const [lo, hi] of spec.voicings) {
          expect(lo).toBeGreaterThanOrEqual(46);
          expect(hi).toBeLessThanOrEqual(63);
          expect(hi - lo).toBeLessThanOrEqual(7);
        }
        expect(spec.barlines!.filter((b) => b === "||").length).toBe(chart.length - 1);
        expect(chartChords(chart).every((c) => prettyChord(c.symbol).length > 0)).toBe(true);
      });
    }
  }

  it("moves Indiana to the key of Donna Lee", () => {
    const v = VEHICLES.find((x) => x.id === "indiana")!;
    const moved = transposeChart(v.chart, v.alt!.steps, v.alt!.semitones);
    expect(moved[0].bars.slice(0, 4)).toEqual(["Ab6", "F7", "Bb7", "Bb7"]);
  });
});

describe("every lesson is applied to the tunes", () => {
  for (const l of LESSONS) {
    it(`${l.id}`, () => {
      const baseline = l.blocks.some((b) => b.kind === "baseline");
      if (!baseline) expect(l.applies.length).toBeGreaterThan(0);
      const used = new Set(l.blocks.flatMap((b) => b.exerciseIds ?? []).map((id) => getExercise(id)?.vehicle).filter(Boolean));
      for (const v of l.applies) expect(used.has(v), `${l.id} claims ${v}`).toBe(true);
    });
  }

  it("every phase uses all three tunes", () => {
    for (const p of PHASES) {
      const ids = new Set(p.tunes.map((t) => t.vehicle));
      expect(ids.has("rhythm") && ids.has("blues") && ids.has("indiana") && ids.has("minor-blues"), p.id).toBe(true);
    }
  });

  it("exercise tune tags are valid", () => {
    const ids = new Set(VEHICLES.map((v) => v.id));
    for (const e of EXERCISES) if (e.vehicle) expect(ids.has(e.vehicle)).toBe(true);
  });
});

describe("guided tour", () => {
  const src = (dir: string, out: string[] = []): string[] => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) src(p, out);
      else if (/\.tsx$/.test(f)) out.push(readFileSync(p, "utf8"));
    }
    return out;
  };
  const code = src("src").join("\n");
  it("points only at elements that exist in the app", () => {
    for (const c of TOUR)
      for (const s of c.steps)
        for (const t of [s.target ?? []].flat()) {
          const m = /data-tour="([^"]+)"/.exec(t);
          if (m) expect(code.includes(`data-tour="${m[1]}"`) || code.includes(`"${m[1]}"`), `${c.id}: ${m[1]}`).toBe(true);
        }
  });
  it("visits real routes", () => {
    const routes = new Set(["/", "/tunes", "/check-in", "/roadmap", "/progress", ...LESSONS.flatMap((l) => [`/lessons/${l.id}`, `/session/${l.id}`])]);
    for (const c of TOUR) expect(routes.has(c.route), c.route).toBe(true);
  });
});
