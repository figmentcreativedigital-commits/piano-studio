import { getExercise, lessonCode, themeVars } from "@/content";
import type { Lesson } from "@/content/types";
import { midiOf } from "@/lib/abc";
import { prettyDate } from "@/lib/schedule";

const isBlack = (m: number) => [1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12);

/** The notes this session is built around, for the keyboard band on the sleeve. */
export function lessonMotif(l: Lesson): number[] {
  for (const b of l.blocks) {
    if (!["harris", "blues", "bach", "ear"].includes(b.kind)) continue;
    for (const id of b.exerciseIds ?? []) {
      const e = getExercise(id);
      const k = e?.keyboard?.[0];
      if (k?.marks?.length) return k.marks.map(([n]) => midiOf(n));
    }
  }
  return [];
}

function KeysBand({ notes }: { notes: number[] }) {
  if (!notes.length) return <span />;
  const lo = Math.min(...notes);
  const start = lo - (lo % 12); // from the C at or below
  const end = Math.max(...notes, start + 16);
  const whites: number[] = [];
  for (let m = start; m <= end + (isBlack(end) ? 1 : 0); m++) if (!isBlack(m)) whites.push(m);
  const W = 10;
  const H = 34;
  const x = new Map(whites.map((m, i) => [m, i * W]));
  const set = new Set(notes);
  return (
    <svg className="sleeve-keys" viewBox={`0 0 ${whites.length * W} ${H}`} aria-hidden="true" preserveAspectRatio="xMinYMax meet">
      {whites.map((m) => (
        <rect key={m} x={x.get(m)! + 0.5} y={0.5} width={W - 1} height={H - 1} fill="none" stroke="var(--c-ink)" strokeWidth={1} />
      ))}
      {whites.map((m) =>
        set.has(m) ? <circle key={`d${m}`} cx={x.get(m)! + W / 2} cy={H - 7} r={3} fill="var(--c-ink)" /> : null,
      )}
      {Array.from({ length: end - start + 1 }, (_, i) => start + i)
        .filter((m) => isBlack(m) && x.has(m - 1))
        .map((m) => (
          <g key={`b${m}`}>
            <rect x={x.get(m - 1)! + W - 3} y={0.5} width={6} height={H * 0.6} fill="var(--c-ink)" />
            {set.has(m) ? <circle cx={x.get(m - 1)! + W} cy={H * 0.6 - 5} r={2.2} fill="var(--c)" /> : null}
          </g>
        ))}
    </svg>
  );
}

export function Sleeve({ lesson, mini = false, done = false }: { lesson: Lesson; mini?: boolean; done?: boolean }) {
  const long = lesson.title.length > 30;
  const code = lessonCode(lesson);
  return (
    <div className={`sleeve${mini ? " mini" : ""}`} style={themeVars(lesson.theme)} aria-label={`${code}: ${lesson.title}`}>
      {!mini && (
        <div className="sleeve-code">
          <span>{code}</span>
          <span>{lesson.minutes === 120 ? "Sides A + B" : "Single"}</span>
        </div>
      )}
      {mini && <div className="sleeve-code"><span>{prettyDate(lesson.date, { weekday: "short" })}</span><span>{done ? "✓" : ""}</span></div>}
      <span className="sleeve-num" aria-hidden="true">
        {String(lesson.day).padStart(2, "0")}
      </span>
      <h3 className={`sleeve-title${long ? " long" : ""}`}>{lesson.title}</h3>
      {!mini && (
        <div className="sleeve-foot">
          <KeysBand notes={lessonMotif(lesson)} />
          <div className="sleeve-min">
            {lesson.minutes} min
            <small>{prettyDate(lesson.date, { month: "short", day: "numeric" })}</small>
          </div>
        </div>
      )}
    </div>
  );
}
