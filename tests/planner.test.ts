import { describe, expect, it } from "vitest";
import { LESSONS } from "@/content";
import { EMPTY_RECORD, plan, skillStates, type CheckIn, type PracticeRecord } from "@/lib/planner";

let n = 0;
function ci(date: string, lessonId: string, extra: Partial<CheckIn> = {}): CheckIn {
  n++;
  return { id: `c${n}`, date, lessonId, version: "full", minutes: 60, outcomes: {}, comfort: "fine", createdAt: `${date}T12:00:0${n % 10}Z`, ...extra };
}
function rec(checkIns: CheckIn[], extra: Partial<PracticeRecord> = {}): PracticeRecord {
  return { ...EMPTY_RECORD, checkIns, ...extra };
}

describe("planner", () => {
  it("before the start date, points at session 1", () => {
    const p = plan(LESSONS, EMPTY_RECORD, "2026-10-23");
    expect(p.status).toBe("not-started");
    expect(p.lesson?.id).toBe("W01D01");
  });

  it("on day one, runs W01D01", () => {
    const p = plan(LESSONS, EMPTY_RECORD, "2026-10-24");
    expect(p.status).toBe("on-track");
    expect(p.lesson?.id).toBe("W01D01");
  });

  it("after a missed day, resumes the sequence instead of doubling up", () => {
    const r = rec([ci("2026-10-24", "W01D01")]);
    const p = plan(LESSONS, r, "2026-10-26"); // Sunday missed
    expect(p.lesson?.id).toBe("W01D02");
    expect(p.status).toBe("behind");
    expect(p.behindBy).toBe(1);
    const slide = p.adjustments.find((a) => a.kind === "slide");
    expect(slide?.reason).toMatch(/slides rather than stacking/);
  });

  it("undoing a slide marks the skipped lesson done and moves on", () => {
    const r = rec([ci("2026-10-24", "W01D01")]);
    const p1 = plan(LESSONS, r, "2026-10-26");
    const slide = p1.adjustments.find((a) => a.kind === "slide")!;
    const p2 = plan(LESSONS, { ...r, undone: [slide.id] }, "2026-10-26");
    expect(p2.lesson?.id).toBe("W01D03");
    expect(p2.status).toBe("on-track");
  });

  it("adds a re-entry check after more than four days away", () => {
    const r = rec([ci("2026-10-24", "W01D01"), ci("2026-10-25", "W01D02")]);
    const p = plan(LESSONS, r, "2026-10-30");
    expect(p.reentry).toBe(true);
    expect(p.lesson?.id).toBe("W01D03");
  });

  it("does not add re-entry for a one-day gap", () => {
    const r = rec([ci("2026-10-24", "W01D01")]);
    expect(plan(LESSONS, r, "2026-10-26").reentry).toBe(false);
  });

  it("rests the left hand after an ache, and the rest can be undone", () => {
    const ache = ci("2026-10-25", "W01D02", { comfort: "lh-ache" });
    const r = rec([ci("2026-10-24", "W01D01"), ache]);
    const p = plan(LESSONS, r, "2026-10-26");
    expect(p.lhRest).toBe(true);
    const adj = p.adjustments.find((a) => a.kind === "lh-rest")!;
    expect(plan(LESSONS, { ...r, undone: [adj.id] }, "2026-10-26").lhRest).toBe(false);
  });

  it("left-hand rest expires after two clean check-ins", () => {
    const r = rec([ci("2026-10-24", "W01D01", { comfort: "lh-ache" }), ci("2026-10-25", "W01D02"), ci("2026-10-26", "W01D03")]);
    expect(plan(LESSONS, r, "2026-10-27").lhRest).toBe(false);
  });

  it("a 'not yet' outcome switches that skill to its easier version", () => {
    const r = rec([ci("2026-10-24", "W01D01", { outcomes: { "c6dim-line": "notyet" } })]);
    const p = plan(LESSONS, r, "2026-10-25");
    expect(p.simplify).toContain("c6dim-line");
  });

  it("a short day uses the essential version without adding homework", () => {
    const r: PracticeRecord = { ...EMPTY_RECORD, checkIns: [ci("2026-10-24", "W01D01")], marks: [{ id: "m1", kind: "short", date: "2026-10-25", minutes: 20, createdAt: "2026-10-25T08:00:00Z" }] };
    const p = plan(LESSONS, r, "2026-10-25");
    expect(p.version).toBe("essential");
    expect(p.lesson?.id).toBe("W01D02");
  });

  it("an away period pauses the plan", () => {
    const r: PracticeRecord = { ...EMPTY_RECORD, checkIns: [ci("2026-10-24", "W01D01")], marks: [{ id: "a1", kind: "away", date: "2026-10-26", until: "2026-10-28", createdAt: "2026-10-25T08:00:00Z" }] };
    expect(plan(LESSONS, r, "2026-10-27").status).toBe("away");
    expect(plan(LESSONS, r, "2026-10-29").status).not.toBe("away");
  });
});

describe("review spacing", () => {
  it("stretches the interval when a skill holds on a later day, and shrinks it when it slips", () => {
    const r = rec([
      ci("2026-10-24", "W01D01", { outcomes: { "c6dim-line": "steady" } }),
      ci("2026-10-25", "W01D02", { outcomes: { "c6dim-line": "steady" } }),
    ]);
    const s = skillStates(r, "2026-10-26").get("c6dim-line")!;
    expect(s.status).toBe("retained");
    expect(s.interval).toBe(2);
    const r2 = rec([...r.checkIns, ci("2026-10-27", "W01D03", { outcomes: { "c6dim-line": "close" } })]);
    const s2 = skillStates(r2, "2026-10-28").get("c6dim-line")!;
    expect(s2.status).toBe("practicing");
    expect(s2.interval).toBe(1);
  });
});
