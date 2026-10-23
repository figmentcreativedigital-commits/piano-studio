import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { facts } from "./facts";

/**
 * Wording can change; music can't. Every note, chord, fingering, tempo,
 * duration, id and setting must match the snapshot taken before the
 * plain-language rewrite. Regenerate the snapshot only when the music
 * itself is meant to change.
 */
describe("musical facts are unchanged", () => {
  const before = JSON.parse(readFileSync("tests/facts.snapshot.json", "utf8"));
  const now = JSON.parse(JSON.stringify(facts()));
  for (const id of Object.keys(before.exercises)) {
    it(`exercise ${id}`, () => expect(now.exercises[id]).toEqual(before.exercises[id]));
  }
  for (const id of Object.keys(before.lessons)) {
    it(`lesson ${id}`, () => expect(now.lessons[id]).toEqual(before.lessons[id]));
  }
  it("phases and tunes", () => {
    expect(now.phases).toEqual(before.phases);
    expect(now.vehicles).toEqual(before.vehicles);
  });
});
