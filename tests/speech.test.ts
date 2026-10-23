import { describe, expect, it } from "vitest";
import { toSpeech } from "@/lib/speech";

describe("read-aloud text", () => {
  const cases: [string, string][] = [
    ["♩ = 60", "quarter note equals 60"],
    ["Start at ♩ = 40–60.", "Start at quarter note equals 40 to 60."],
    ["A♭4", "A flat 4"],
    ["F7 = E♭3 + A3", "F 7 = E flat 3 + A 3"],
    ["Bb7", "B flat 7"],
    ["B°", "B diminished"],
    ["E°7 in bar 6", "E diminished in bar 6"],
    ["Cm6–B° movement", "C minor 6 to B diminished movement"],
    ["Em7b5 A7", "E minor seven flat five A 7"],
    ["E♭maj7", "E flat major seven"],
    ["mm. 1–4", "measures 1 to 4"],
    ["Invention No. 1, m. 1", "Invention No. 1, measure 1"],
    ["Fingering: 1-2-4-5", "Fingering: 1, 2, 4, 5"],
    ["Piano · W01 D02 · Movement", "Piano, Week 1, Day 2, Movement"],
    ["RH 3, LH 2", "right hand 3, left hand 2"],
    ["ii–V–I", "two five one"],
    ["C6 (C4 E4 G4 A4) → B°", "C 6 (C 4 E 4 G 4 A 4), then B diminished"],
    ["BWV 772", "B W V 772"],
  ];
  for (const [input, want] of cases) {
    it(`${input}`, () => expect(toSpeech(input)).toBe(want));
  }
  it("leaves ordinary words alone", () => {
    expect(toSpeech("Bad habits are a cue to slow down. Ab-normal? No.")).toBe("Bad habits are a cue to slow down. Ab-normal? No.");
  });
});
