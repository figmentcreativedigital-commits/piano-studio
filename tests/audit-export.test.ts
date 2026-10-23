import { it } from "vitest";
import fs from "node:fs";
import { EXERCISES } from "@/content";
import { buildAbc, midiOf } from "@/lib/abc";

// Writes every exercise's ABC (and expected pitches for chord-based ones) for the
// browser audit in scripts/audit-notation.py. Runs only with AUDIT=1.
it.runIf(process.env.AUDIT === "1")("export notation for the browser audit", () => {
  const out = EXERCISES.filter((e) => e.notation).map((e) => ({
    id: e.id,
    abc: buildAbc(e.notation!, 4),
    expected: e.notation!.chords ? e.notation!.chords.map((c) => c.notes.map(midiOf)) : null,
  }));
  fs.mkdirSync("tests/.audit", { recursive: true });
  fs.writeFileSync("tests/.audit/abc.json", JSON.stringify(out, null, 1));
});
