import { midiOf, prettyPitch } from "@/lib/abc";
import type { KeyboardSpec } from "@/content/types";

const isBlack = (m: number) => [1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12);

/**
 * Keyboard diagram. Blue marks are the right hand, orange the left, numbers are
 * fingers (1 = thumb). Dashed outlines are neutral targets such as a starting
 * note. `active` lights keys from MIDI input.
 */
export function Keyboard({ spec, active, compact = false }: { spec: KeyboardSpec; active?: Set<number>; compact?: boolean }) {
  const lo = midiOf(spec.from);
  const hi = midiOf(spec.to);
  const WW = 26;
  const WH = 120;
  const BW = 16;
  const BH = 76;
  const whites: number[] = [];
  for (let m = lo; m <= hi; m++) if (!isBlack(m)) whites.push(m);
  const xOf = new Map<number, number>();
  whites.forEach((m, i) => xOf.set(m, i * WW));
  const W = whites.length * WW;
  const H = WH + 22;
  const cx = (m: number) => (isBlack(m) ? (xOf.get(m - 1) ?? 0) + WW : (xOf.get(m) ?? 0) + WW / 2);
  const cy = (m: number) => (isBlack(m) ? BH - 16 : WH - 22);
  const marks = spec.marks ?? [];
  const targets = spec.targets ?? [];
  const label = spec.caption;

  return (
    <figure className="kbd" style={compact ? { maxWidth: 300 } : undefined}>
      <svg viewBox={`-1 -1 ${W + 2} ${H + 2}`} width={Math.round((W + 2) * 1.15)} role="img" aria-label={label}>
        {whites.map((m) => (
          <rect key={`w${m}`} x={xOf.get(m)} y={0} width={WW} height={WH} rx={2} fill={active?.has(m) ? "#cfd9ff" : "var(--key-white)"} stroke="var(--paper-ink)" strokeWidth={1} />
        ))}
        {Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
          .filter((m) => isBlack(m) && xOf.has(m - 1))
          .map((m) => (
            <rect key={`b${m}`} x={(xOf.get(m - 1) ?? 0) + WW - BW / 2} y={0} width={BW} height={BH} rx={1.5} fill={active?.has(m) ? "#3a55d8" : "var(--key-black)"} />
          ))}
        {whites
          .filter((m) => m % 12 === 0)
          .map((m) => (
            <text key={`c${m}`} x={(xOf.get(m) ?? 0) + WW / 2} y={WH + 16} textAnchor="middle" fontSize={11} fontWeight={m === 60 ? 800 : 500} fill="var(--paper-ink)" fontFamily="var(--ui)">
              C{m / 12 - 1}
            </text>
          ))}
        {targets.map(([n, lab]) => {
          const m = midiOf(n);
          const x = cx(m);
          const y = cy(m);
          const pw = Math.max(22, lab.length * 6.4 + 6);
          return (
            <g key={`t${n}`}>
              <rect x={x - pw / 2} y={y - 10} width={pw} height={20} rx={10} fill="var(--paper)" stroke="#3a3f46" strokeWidth={1.5} strokeDasharray="3 2" />
              <text x={x} y={y + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3a3f46" fontFamily="var(--ui)">
                {lab}
              </text>
            </g>
          );
        })}
        {marks.map(([n, hand, lab]) => {
          const m = midiOf(n);
          const x = cx(m);
          const y = cy(m);
          return (
            <g key={`m${n}${hand}`}>
              <circle cx={x} cy={y} r={10.5} fill={hand === "R" ? "#2347c5" : "#b4500c"} />
              <text x={x} y={y + 4.5} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff" fontFamily="var(--ui)">
                {lab}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>{label.replace(/([A-G])b(\d)/g, (_, l, o) => prettyPitch(`${l}b${o}`))}</figcaption>
    </figure>
  );
}
