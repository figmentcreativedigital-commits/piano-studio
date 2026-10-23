import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PHASE_THEMES, SLEEVE_THEMES, VEHICLES } from "@/content";

/**
 * The palette is the cover's, and only the cover's. Every color literal in the
 * app must be one of these; every text pairing the design uses must pass
 * WCAG AA (4.5:1, or 3:1 for display type).
 */
const PALETTE: Record<string, string> = {
  cobalt: "#0267b2",
  cyan: "#00b0ef",
  orchid: "#b471af",
  white: "#f7feff",
  navy: "#003657",
  night: "#0a1014",
  coal: "#11171c",
  soot: "#1b2125",
  slate: "#24373c",
  steel: "#54727c",
  mist: "#86a9bb",
  haze: "#98bed3",
  ice: "#a9d1e7",
};
const ALLOWED = new Set(Object.values(PALETTE));

function lum(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

function files(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) files(p, out);
    else if (/\.(tsx?|css)$/.test(f)) out.push(p);
  }
  return out;
}

describe("palette", () => {
  it("uses only the cover's colors in code and styles", () => {
    const bad: string[] = [];
    for (const f of files("src")) {
      const text = readFileSync(f, "utf8");
      for (const m of text.matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g)) {
        const hex = m[0].toLowerCase();
        if (hex.length === 4 || !ALLOWED.has(hex)) bad.push(`${f}: ${m[0]}`);
      }
      for (const m of text.matchAll(/rgba?\(/g)) bad.push(`${f}: ${m[0]} at ${m.index}`);
      for (const m of text.matchAll(/hsla?\(/g)) bad.push(`${f}: ${m[0]} at ${m.index}`);
    }
    expect(bad).toEqual([]);
  });

  it("blends only for the tour scrim", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    const all = css.split("color-mix(").length - 1;
    const scrim = css.split("color-mix(in srgb, var(--night) 72%, transparent)").length - 1;
    expect(all).toBe(scrim);
  });

  it("defines every palette token exactly as sampled", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    for (const [name, hex] of Object.entries(PALETTE)) expect(css).toContain(`--${name}: ${hex};`);
  });
});

describe("contrast (WCAG AA)", () => {
  const text: [string, string, string][] = [
    ["body text, light", "night", "white"],
    ["secondary text, light", "slate", "white"],
    ["muted text, light", "steel", "white"],
    ["links and buttons, light", "cobalt", "white"],
    ["navy badge, light", "navy", "white"],
    ["body text, dark", "white", "night"],
    ["body text on surface, dark", "white", "coal"],
    ["muted text, dark", "mist", "night"],
    ["muted text on surface, dark", "mist", "coal"],
    ["accent, dark", "cyan", "night"],
    ["accent button text, dark", "night", "cyan"],
    ["white on the cobalt field", "white", "cobalt"],
    ["white on a navy hover", "white", "navy"],
    ["orchid badge text", "night", "orchid"],
    ["notation ink", "night", "white"],
    ["right-hand marks", "white", "cobalt"],
    ["left-hand marks", "night", "orchid"],
  ];
  for (const [what, fg, bg] of text) {
    it(`${what}: ${fg} on ${bg} ≥ 4.5`, () => expect(contrast(PALETTE[fg], PALETTE[bg])).toBeGreaterThanOrEqual(4.5));
  }

  it("every sleeve, phase and tune theme reads at AA", () => {
    for (const t of [...SLEEVE_THEMES, ...Object.values(PHASE_THEMES), ...VEHICLES.map((v) => v.theme)]) {
      expect(contrast(PALETTE[t.ink], PALETTE[t.bg]), `${t.ink} on ${t.bg}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("the live accent is visible as a graphic on paper (3:1)", () => {
    expect(contrast(PALETTE.orchid, PALETTE.white)).toBeGreaterThanOrEqual(3);
    expect(contrast(PALETTE.orchid, PALETTE.night)).toBeGreaterThanOrEqual(3);
  });
});
