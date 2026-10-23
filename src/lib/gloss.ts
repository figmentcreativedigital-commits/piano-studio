import { GLOSSARY, type GlossaryEntry } from "@/content/glossary";

/*
 * Finds glossary terms in a passage. Shared by server and client code.
 * Pass the same `seen` set across several passages to mark each term
 * only the first time it appears in that group (one card, one page).
 */

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const ENTRIES = GLOSSARY.flatMap((g) => g.match.map((m) => ({ m, g }))).sort((a, b) => b.m.length - a.m.length);
const BY_MATCH = new Map(ENTRIES.map((e) => [e.m.toLowerCase(), e.g]));
const RE = new RegExp(`(?<![\\w-])(${ENTRIES.map((e) => esc(e.m)).join("|")})(?![\\w-])`, "gi");

export type GlossPart = string | { text: string; entry: GlossaryEntry };

export function glossParts(text: string, seen: Set<string> = new Set()): GlossPart[] {
  const out: GlossPart[] = [];
  let last = 0;
  for (const m of text.matchAll(RE)) {
    const entry = BY_MATCH.get(m[0].toLowerCase());
    if (!entry || seen.has(entry.term)) continue;
    seen.add(entry.term);
    if (m.index! > last) out.push(text.slice(last, m.index));
    out.push({ text: m[0], entry });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
