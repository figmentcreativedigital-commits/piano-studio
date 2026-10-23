import { describe, expect, it } from "vitest";
import { GLOSSARY } from "@/content/glossary";
import { glossParts } from "@/components/Gloss";
import { grade, longestSentence } from "@/lib/readability";

describe("glossary", () => {
  it("defines every term in plain words", () => {
    for (const g of GLOSSARY) {
      expect(longestSentence(g.def), g.term).toBeLessThanOrEqual(20);
      expect(grade(g.def).grade, g.term).toBeLessThanOrEqual(8);
    }
  });
  it("marks a term once per passage and leaves other words alone", () => {
    const parts = glossParts("Play the guide tones, then the guide tones again. Keep your hands light.");
    const terms = parts.filter((p) => typeof p !== "string");
    expect(terms).toHaveLength(1);
    expect(parts.map((p) => (typeof p === "string" ? p : p.text)).join("")).toBe("Play the guide tones, then the guide tones again. Keep your hands light.");
  });
  it("finds the longest match first", () => {
    const parts = glossParts("The C sixth-diminished scale has 8 notes.");
    const t = parts.find((p) => typeof p !== "string") as { text: string };
    expect(t.text).toBe("sixth-diminished scale");
  });
  it("doesn't match inside other words", () => {
    expect(glossParts("Perform it twice.").every((p) => typeof p === "string")).toBe(true);
  });
});
