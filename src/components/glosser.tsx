import type { ReactNode } from "react";
import { glossParts } from "@/lib/gloss";
import { Term } from "./Gloss";

/**
 * A glosser for one group of passages (a card, a lesson). Each glossary
 * term is marked the first time it appears in the group, not in every line.
 * Works in server and client components.
 */
export function glosser(): (text: string) => ReactNode {
  const seen = new Set<string>();
  return (text) =>
    glossParts(text, seen).map((p, i) =>
      typeof p === "string" ? (
        p
      ) : (
        <Term key={i} entry={p.entry}>
          {p.text}
        </Term>
      ),
    );
}
