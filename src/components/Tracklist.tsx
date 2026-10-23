import { BLOCK_LABEL, getExercise } from "@/content";
import type { Block } from "@/content/types";

/** The session agenda as an LP tracklist: numbered, timed, grouped by side. */
export function Tracklist({ blocks, current = -1, linkBase }: { blocks: Block[]; current?: number; linkBase?: string }) {
  const total = blocks.reduce((s, b) => s + b.minutes, 0);
  const groups: { side?: string; items: { b: Block; i: number }[] }[] = [];
  blocks.forEach((b, i) => {
    const g = groups[groups.length - 1];
    if (!g || g.side !== b.side) groups.push({ side: b.side, items: [{ b, i }] });
    else g.items.push({ b, i });
  });
  let n = 0;
  return (
    <div>
      {groups.map((g, gi) => (
        <section key={gi} aria-label={g.side ? `Side ${g.side}` : "Session agenda"}>
          {g.side && <div className="tracklist-side">Side {g.side}</div>}
          <ol className="tracklist" style={g.side && gi > 0 ? { borderTopWidth: 1 } : undefined}>
            {g.items.map(({ b, i }) => {
              const isBreak = b.kind === "break";
              if (!isBreak) n++;
              const ex = (b.exerciseIds ?? [])
                .map((id) => getExercise(id))
                .filter((e) => e && e.kind !== "baseline" && e.title !== b.title && !e.title.startsWith("Reading minute"))
                .map((e) => e!.title);
              const exLine = ex.join(", ");
              const kind = BLOCK_LABEL[b.kind];
              const sub = exLine ? (b.title.toLowerCase().includes(kind.toLowerCase()) ? exLine : `${kind}: ${exLine}`) : b.title.toLowerCase().includes(kind.toLowerCase()) ? "" : kind;
              const state = i === current ? " is-now" : current > i ? " is-done" : "";
              return (
                <li key={b.id} className={`track${isBreak ? " is-break" : ""}${state}`} aria-current={i === current ? "step" : undefined}>
                  <span className="track-n">{isBreak ? "" : n}</span>
                  <span className="track-title">
                    {linkBase && !isBreak ? <a href={`${linkBase}#b-${b.id}`}>{b.title}</a> : b.title}
                    {!isBreak && sub && <small>{sub}</small>}
                  </span>
                  <span className="track-min">{b.minutes}:00</span>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
      <div className="track-total">
        <span>Total</span>
        <span>{total} min</span>
      </div>
    </div>
  );
}
