"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Exercise } from "@/content/types";
import { beatsPerBar } from "@/lib/abc";
import { audioAvailable, player, type AbcVisual } from "@/lib/audio";
import { connectMidi, getMidiStatus, onMidiStatus, onNote, type MidiStatus } from "@/lib/midi";
import { logRep, repStore, resetReps, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";
import { Keyboard } from "./Keyboard";
import { Score } from "./Score";

type Hands = "both" | "RH" | "LH";

export function ExercisePlayer({ ex, lhRest = false }: { ex: Exercise; lhRest?: boolean }) {
  const n = ex.notation;
  const twoStaves = !!(n?.rh && n?.lh);
  const today = useToday();
  const [tempo, setTempo] = useState(n?.tempo ?? ex.tempo.start ?? 60);
  const [hands, setHands] = useState<Hands>(lhRest && twoStaves ? "RH" : (n?.defaultHands ?? "both"));
  const [loop, setLoop] = useState(false);
  const [clickOn, setClickOn] = useState(true);
  const [view, setView] = useState<"full" | "faded" | "hidden">(ex.hideNotation ? "hidden" : "full");
  const [playing, setPlaying] = useState(false);
  const visual = useRef<AbcVisual | null>(null);
  const scoreEl = useRef<HTMLElement | null>(null);
  const [follow, setFollow] = useState(false);
  const [midi, setMidi] = useState<MidiStatus>({ state: "idle", devices: [] });
  const [active, setActive] = useState<Set<number>>(new Set());
  const reps = useStore(repStore).days[today]?.[ex.id];
  const [canAudio, setCanAudio] = useState(true);

  useEffect(() => {
    setCanAudio(audioAvailable());
    setMidi(getMidiStatus());
    const un1 = onMidiStatus(setMidi);
    const un2 = player.state.on((id) => setPlaying(id === ex.id));
    return () => {
      un1();
      un2();
    };
  }, [ex.id]);

  useEffect(() => () => {
    if (player.id === ex.id) player.stop();
  }, [ex.id]);

  const onReady = useCallback((v: AbcVisual, el: HTMLElement) => {
    visual.current = v;
    scoreEl.current = el;
  }, []);

  const play = () => {
    if (!visual.current || !n) return;
    if (playing) {
      player.stop();
      return;
    }
    player.play({
      id: ex.id,
      visual: visual.current,
      tempo,
      hands,
      twoStaves,
      loop,
      click: clickOn,
      clickMode: n.clickMode,
      swing: n.swing,
      gain: n.gain,
      beatsPerBar: beatsPerBar(n.meter),
    });
  };

  // Restart with new settings if playing.
  useEffect(() => {
    if (playing && visual.current && n) {
      player.play({ id: ex.id, visual: visual.current, tempo, hands, twoStaves, loop, click: clickOn, clickMode: n.clickMode, swing: n.swing, gain: n.gain, beatsPerBar: beatsPerBar(n.meter) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempo, hands, loop, clickOn]);

  // ── MIDI follow mode: waits for the right pitches, then moves on. Pitch only. ──
  const groups = useMemo(() => ({ list: [] as { pitches: number[]; els: Element[] }[] }), []);
  const pos = useRef(0);
  const pressed = useRef<Set<number>>(new Set());

  const buildGroups = useCallback(() => {
    const v = visual.current;
    if (!v || !n) return;
    const au = v.setUpAudio({ qpm: tempo, chordsOff: true });
    const timing = v.setTiming(tempo, 0).filter((e) => e.type === "event");
    const byStart = new Map<number, number[]>();
    au.tracks.forEach((tr, vi) => {
      if (twoStaves && hands === "RH" && vi !== 0) return;
      if (twoStaves && hands === "LH" && vi !== 1) return;
      for (const note of tr) if (note.cmd === "note") byStart.set(note.start, [...(byStart.get(note.start) ?? []), note.pitch]);
    });
    const msPerWhole = (4 * 60000) / tempo;
    groups.list = [...byStart.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([start, pitches]) => {
        const ms = start * msPerWhole;
        const ev = timing.reduce((best, e) => (Math.abs(e.milliseconds - ms) < Math.abs(best.milliseconds - ms) ? e : best), timing[0]);
        const els: Element[] = [];
        for (const a of ev?.elements ?? []) (Array.isArray(a) ? a : [a]).forEach((x) => x && els.push(x));
        return { pitches: [...new Set(pitches)], els };
      });
    pos.current = 0;
    pressed.current = new Set();
  }, [groups, hands, n, tempo, twoStaves]);

  const mark = useCallback(() => {
    scoreEl.current?.querySelectorAll(".is-next").forEach((e) => e.classList.remove("is-next"));
    const g = groups.list[pos.current];
    g?.els.forEach((e) => e.classList.add("is-next"));
  }, [groups]);

  useEffect(() => {
    if (!follow) {
      scoreEl.current?.querySelectorAll(".is-next").forEach((e) => e.classList.remove("is-next"));
      return;
    }
    buildGroups();
    mark();
    const un = onNote((e) => {
      setActive((prev) => {
        const s = new Set(prev);
        if (e.type === "on") s.add(e.pitch);
        else s.delete(e.pitch);
        return s;
      });
      if (e.type !== "on") return;
      const g = groups.list[pos.current];
      if (!g) return;
      if (g.pitches.includes(e.pitch)) {
        pressed.current.add(e.pitch);
        if (g.pitches.every((p) => pressed.current.has(p))) {
          pos.current = pos.current + 1 >= groups.list.length ? 0 : pos.current + 1;
          pressed.current = new Set();
          mark();
        }
      }
    });
    return () => {
      un();
    };
  }, [follow, buildGroups, mark, groups]);

  // Live keys even without follow mode, once MIDI is connected.
  useEffect(() => {
    if (midi.state !== "ready" || follow) return;
    const un = onNote((e) =>
      setActive((prev) => {
        const s = new Set(prev);
        if (e.type === "on") s.add(e.pitch);
        else s.delete(e.pitch);
        return s;
      }),
    );
    return () => {
      un();
    };
  }, [midi.state, follow]);

  const streak = reps?.streak ?? 0;
  const target = 3;

  return (
    <>
      {n && (
        <div className="paper">
          <Score spec={n} view={view} onReady={onReady} label={`${ex.title}: ${ex.spelling ?? "notation"}`} />
          {view === "hidden" && (
            <div className="veil">
              <span>{ex.hideNotation ? "Notes hidden until you've found it by ear" : "Notation hidden: play from memory"}</span>
              <button type="button" className="btn small" onClick={() => setView("full")}>
                Show notes
              </button>
            </div>
          )}
          {ex.keyboard && (
            <div className="kbds">
              {ex.keyboard.map((k, i) => (
                <Keyboard key={i} spec={k} active={active} />
              ))}
            </div>
          )}
        </div>
      )}
      {!n && ex.keyboard && (
        <div className="paper">
          <div className="kbds">
            {ex.keyboard.map((k, i) => (
              <Keyboard key={i} spec={k} active={active} />
            ))}
          </div>
        </div>
      )}
      {n && (
        <div className="controls" data-tour="player">
          <button type="button" className="btn primary" onClick={play} aria-pressed={playing} disabled={!canAudio}>
            {playing ? "Stop" : ex.kind === "reading" ? "Hear it (after your try)" : ex.hideNotation ? "Play phrase" : "Hear it"}
          </button>
          <span className="tempo-ctl">
            <button type="button" className="icon-btn" aria-label="Slower" onClick={() => setTempo((t) => Math.max(30, t - 4))}>
              −
            </button>
            <span aria-hidden="true">♩=</span>
            <input aria-label="Tempo, quarter notes per minute" type="number" inputMode="numeric" min={30} max={240} value={tempo} onChange={(e) => setTempo(Math.max(30, Math.min(240, Number(e.target.value) || 60)))} />
            <button type="button" className="icon-btn" aria-label="Faster" onClick={() => setTempo((t) => Math.min(240, t + 4))}>
              +
            </button>
          </span>
          {twoStaves && (
            <span className="seg" role="group" aria-label="Hands">
              {(["both", "RH", "LH"] as Hands[]).map((h) => (
                <button key={h} type="button" aria-pressed={hands === h} onClick={() => setHands(h)}>
                  {h === "both" ? "Both" : h}
                </button>
              ))}
            </span>
          )}
          <span className="seg" role="group" aria-label="Notation">
            {(["full", "faded", "hidden"] as const).map((v) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
                {v === "full" ? "Notes" : v === "faded" ? "Faded" : "Hidden"}
              </button>
            ))}
          </span>
          <label className="check">
            <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} /> Loop
          </label>
          <label className="check">
            <input type="checkbox" checked={clickOn} onChange={(e) => setClickOn(e.target.checked)} /> Click
          </label>
          {midi.state === "ready" ? (
            <label className="check" title="Waits for the right keys, then moves on. Checks pitch only." data-tour="midi">
              <input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} /> Follow my playing
            </label>
          ) : midi.state !== "unsupported" ? (
            <button type="button" className="btn small ghost" onClick={() => void connectMidi()} data-tour="midi">
              {midi.state === "connecting" ? "Connecting…" : midi.state === "denied" ? "MIDI blocked" : midi.state === "no-device" ? "No MIDI device found" : "Connect piano (MIDI)"}
            </button>
          ) : null}
        </div>
      )}
      <div className="reps-bar" style={{ padding: "12px 20px 0" }} data-tour="reps">
        <div className="reps" aria-live="polite">
          <span style={{ fontWeight: 700 }}>Clean runs</span>
          <span className="rep-dots" aria-label={`${Math.min(streak, target)} of ${target} clean in a row`}>
            {Array.from({ length: target }, (_, i) => (
              <i key={i} className={i < streak ? "on" : ""} />
            ))}
          </span>
          <button type="button" className="btn small" onClick={() => logRep(today, ex.id, true, tempo)}>
            Clean
          </button>
          <button type="button" className="btn small ghost" onClick={() => logRep(today, ex.id, false, tempo)}>
            Not clean
          </button>
          {reps && (
            <button type="button" className="btn small ghost" onClick={() => resetReps(today, ex.id)}>
              Reset
            </button>
          )}
          {reps && <span className="hint">{reps.clean} of {reps.total} clean today</span>}
        </div>
        {streak >= target && (
          <p className="hint" style={{ margin: "8px 0 0" }}>
            Three clean in a row. Mark it steady in today&apos;s check-in, then check it from memory tomorrow.
            {n && (
              <>
                {" "}
                <button type="button" className="btn small" onClick={() => setTempo((t) => t + 4)}>
                  Raise to ♩ = {tempo + 4}
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </>
  );
}
