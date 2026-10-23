import { describe, expect, it } from "vitest";
import { LESSONS, getLesson } from "@/content";
import { buildIcs, calendarDescription, lessonStart, localDate, tzOffsetMinutes, zonedToUtc } from "@/lib/schedule";

describe("time zones", () => {
  it("resolves Eastern daylight time before Nov 1, 2026", () => {
    expect(zonedToUtc("2026-10-30", "07:30").toISOString()).toBe("2026-10-30T11:30:00.000Z");
  });

  it("resolves Eastern standard time after the Nov 1, 2026 change", () => {
    expect(zonedToUtc("2026-11-02", "07:30").toISOString()).toBe("2026-11-02T12:30:00.000Z");
  });

  it("handles the change day itself", () => {
    // 1:30 pm on Sunday Nov 1 is standard time.
    expect(zonedToUtc("2026-11-01", "13:00").toISOString()).toBe("2026-11-01T18:00:00.000Z");
    expect(tzOffsetMinutes(new Date("2026-11-01T05:00:00Z"))).toBe(-240);
    expect(tzOffsetMinutes(new Date("2026-11-01T07:00:00Z"))).toBe(-300);
  });

  it("finds the local date near midnight", () => {
    expect(localDate(new Date("2026-10-24T03:30:00Z"))).toBe("2026-10-23");
    expect(localDate(new Date("2026-10-24T04:30:00Z"))).toBe("2026-10-24");
  });

  it("Saturday's lesson starts at 10 am Eastern", () => {
    expect(lessonStart(getLesson("W01D01")!).toISOString()).toBe("2026-10-24T14:00:00.000Z");
  });
});

describe("calendar export", () => {
  const ics = buildIcs(LESSONS, "https://example.com", new Date("2026-10-23T00:00:00Z"));

  it("has one event per lesson with stable ids", () => {
    expect(ics.match(/BEGIN:VEVENT/g)?.length).toBe(LESSONS.length);
    expect(ics).toContain("UID:w01d01@woodshed-piano");
  });

  it("uses CRLF line endings and folds long lines", () => {
    for (const line of ics.split("\r\n")) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
  });

  it("writes UTC times", () => {
    expect(ics).toContain("DTSTART:20261024T140000Z");
    expect(ics).toContain("DTEND:20261024T160000Z");
  });

  it("descriptions work on their own", () => {
    const d = calendarDescription(getLesson("W01D02")!, "https://example.com/lessons/W01D02");
    expect(d).toContain("0:00");
    expect(d).toContain("Movement: C6 and B°");
    expect(d).toContain("Full lesson: https://example.com/lessons/W01D02");
    expect(d).toContain("Start the session: https://example.com/session/W01D02");
    expect(d).not.toContain("Baseline page");
    expect(calendarDescription(getLesson("W01D01")!, "https://example.com/lessons/W01D01")).toContain(
      "Baseline page: https://example.com/baseline.html",
    );
  });
});
