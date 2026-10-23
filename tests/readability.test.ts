import { BACH_PIECES, BACH_TEXT } from "@/content/bach";
import { PARKER_SOLOS } from "@/content/parker";
import { describe, expect, it } from "vitest";
import { BASELINE, EXERCISES, LESSONS, PHASES, VEHICLES } from "@/content";
import { LIBRARY, LIBRARY_INTRO, RECORDINGS_CARD } from "@/content/library";
import { METHOD, METHOD_INTRO, plain } from "@/content/method";
import { TOUR } from "@/content/tour";
import { ROADMAP_INTRO, TUNES_INTRO } from "@/lib/narration";
import { grade, longestSentence } from "@/lib/readability";

/**
 * Everything a student reads should sit at about a 7th-grade reading level:
 * short sentences, everyday words, music terms explained. Exact musical data
 * (notes, fingerings, tempos) is left out of the measurement.
 */

type Field = { where: string; text: string };

export function prose(): Field[] {
  const f: Field[] = [];
  const add = (where: string, text?: string) => text && f.push({ where, text });
  for (const l of LESSONS) {
    add(`${l.id} objective`, l.objective);
    add(`${l.id} balance`, l.balance);
    add(`${l.id} application`, l.application);
    add(`${l.id} retrieval`, l.retrieval);
    l.prerequisites.forEach((p, i) => add(`${l.id} prereq ${i}`, p));
    for (const b of [...l.blocks, ...l.essential.blocks]) b.text.forEach((t, i) => add(`${l.id} block ${b.id}.${i}`, t));
  }
  for (const e of EXERCISES) {
    add(`${e.id} subtitle`, e.subtitle);
    add(`${e.id} source`, e.source.note);
    e.steps.forEach((s, i) => add(`${e.id} step ${i}`, s));
    add(`${e.id} listenFor`, e.listenFor);
    add(`${e.id} feelFor`, e.feelFor);
    e.errors.forEach((s, i) => add(`${e.id} error ${i}`, s));
    add(`${e.id} cue`, e.cue);
    add(`${e.id} check`, e.check);
    add(`${e.id} easier`, e.easier);
    add(`${e.id} harder`, e.harder);
    add(`${e.id} lhCare`, e.lhCare);
    add(`${e.id} tempo note`, e.tempo.note);
    if (e.recording) {
      add(`${e.id} question`, e.recording.question);
      add(`${e.id} rec cue`, e.recording.cue);
    }
  }
  add("baseline summary", BASELINE.summary);
  BASELINE.findings.forEach((x) => add(`baseline ${x.area}`, x.level));
  BASELINE.teaching.forEach((t, i) => add(`baseline teaching ${i}`, t));
  for (const p of PHASES) {
    add(`${p.id} summary`, p.summary);
    [...p.jazz, ...p.bach, ...p.bird, ...p.technique, ...p.ear].forEach((t, i) => add(`${p.id} item ${i}`, t));
    p.tunes.forEach((t) => add(`${p.id} ${t.vehicle}`, t.text));
    p.milestone.checks.forEach((c, i) => add(`${p.id} check ${i}`, c));
  }
  for (const v of VEHICLES) {
    add(`${v.id} summary`, v.summary);
    v.uses.forEach((u) => add(`${v.id} ${u.phase}`, u.text));
    v.recordings.forEach((r, i) => {
      add(`${v.id} rec ${i} detail`, r.detail);
      add(`${v.id} rec ${i} note`, r.note);
    });
    add(`${v.id} source`, v.source.note);
  }
  for (const c of TOUR)
    for (const s of c.steps) {
      add(`tour ${s.title}`, s.body);
      add(`tour ${s.title} why`, s.why);
    }
  add("method intro", METHOD_INTRO);
  for (const m of METHOD) [...m.paragraphs, ...(m.after ?? [])].forEach((p, i) => add(`method ${m.heading} ${i}`, plain(p)));
  add("library intro", LIBRARY_INTRO);
  add("recordings card", RECORDINGS_CARD.blurb);
  for (const e of LIBRARY) {
    add(`library ${e.id} intro`, e.intro);
    add(`library ${e.id} card`, e.blurb);
  }
  add("tunes intro", TUNES_INTRO);
  add("roadmap intro", ROADMAP_INTRO);
  for (const p of BACH_PIECES) {
    add(`bach ${p.id} summary`, p.summary);
    add(`bach ${p.id} left hand`, p.leftHand);
    p.sections.forEach((s) => add(`bach ${p.id} ${s.title}`, s.text));
  }
  for (const [k, v] of Object.entries(BACH_TEXT)) add(`bach text ${k}`, v);
  for (const s of PARKER_SOLOS) add(`parker ${s.slug} about`, s.about);
  return f;
}

describe("reading level", () => {
  const fields = prose();
  const all = fields.map((f) => f.text).join(" ");
  const overall = grade(all);

  it("reads at about a 7th-grade level overall", () => {
    // eslint-disable-next-line no-console
    if (process.env.READ_REPORT) {
      const worst = fields
        .map((f) => ({ ...f, g: grade(f.text) }))
        .filter((f) => f.g.words >= 12)
        .sort((a, b) => b.g.grade - a.g.grade)
        .slice(0, 25);
      console.log(`overall grade ${overall.grade} over ${overall.words} words`);
      for (const w of worst) console.log(`${w.g.grade}\t${w.where}\t${w.text.slice(0, 90)}`);
    }
    expect(overall.grade).toBeLessThanOrEqual(7.0);
  });

  it("keeps every passage within reach (grade 8 at most)", () => {
    const hard = fields.filter((f) => grade(f.text).words >= 12 && grade(f.text).grade > 8).map((f) => `${f.where} (${grade(f.text).grade})`);
    expect(hard).toEqual([]);
  });

  it("uses everyday words", () => {
    const AVOID = /\b(prerequisites?|retrieval|retrieve|consolidat\w*|provisional|utili[sz]e\w*|subsequent\w*|approximately|sufficient|demonstrat\w*|simultaneous\w*|pedagog\w*|diagnostic|interleav\w*|repertoire|adaptive|evidence)\b/i;
    const found = fields.filter((f) => AVOID.test(f.text)).map((f) => `${f.where}: ${AVOID.exec(f.text)![0]}`);
    expect(found).toEqual([]);
  });

  it("keeps sentences short (25 words at most)", () => {
    const long = fields.filter((f) => longestSentence(f.text) > 25).map((f) => `${f.where} (${longestSentence(f.text)} words)`);
    expect(long).toEqual([]);
  });
});
