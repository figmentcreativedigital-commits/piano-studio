"use client";

import { useEffect, useRef, useState } from "react";
import { collectReadable, englishVoices, onNarrator, onVoices, reader, speechKey, speechSupported, type NarratorInfo, type ReaderState } from "@/lib/speech";

function useReader(): ReaderState {
  const [s, setS] = useState<ReaderState>(reader.state);
  useEffect(() => reader.on(setS), []);
  return s;
}

function useSupported() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(speechSupported());
    // Exposed for the automated coverage check of narrated passages.
    (window as unknown as { __woodshedSpeechKey?: typeof speechKey }).__woodshedSpeechKey = speechKey;
  }, []);
  return ok;
}

/** Header control: reads the page, section by section. */
export function ListenButton() {
  const ok = useSupported();
  const s = useReader();
  if (!ok) return null;
  const active = s.status !== "idle";
  return (
    <button
      type="button"
      className={`icon-btn listen-btn${active ? " solid" : ""}`}
      aria-pressed={active}
      aria-label={active ? "Stop reading aloud" : "Read this page aloud"}
      title={active ? "Stop reading" : "Read this page aloud"}
      data-tour="listen"
      onClick={() => {
        if (active) return reader.stop();
        const main = document.getElementById("main");
        const items = collectReadable(main ?? document);
        if (!items.length && main) {
          const fallback = Array.from(main.querySelectorAll<HTMLElement>("h1, h2, h3, p, li")).filter((e) => e.getClientRects().length);
          reader.speak(fallback.map((el) => ({ text: el.innerText, el })), "This page");
        } else reader.speak(items, "This page");
      }}
    >
      <SpeakerIcon />
    </button>
  );
}

/** Reads the `[data-read]` elements in this button's nearest `[data-read-region]`. */
export function ReadButton({ label = "Read aloud", what }: { label?: string; what: string }) {
  const ok = useSupported();
  const ref = useRef<HTMLButtonElement>(null);
  const s = useReader();
  if (!ok) return null;
  const mine = s.status !== "idle" && s.label === what;
  return (
    <button
      ref={ref}
      type="button"
      className="btn small ghost read-btn"
      aria-pressed={mine}
      onClick={() => {
        if (mine) return reader.stop();
        const region = ref.current?.closest<HTMLElement>("[data-read-region]");
        reader.speak(collectReadable(region ?? document), what);
      }}
    >
      <SpeakerIcon />
      {mine ? "Stop" : label}
    </button>
  );
}

/** The bar that appears while something is being read. */
/** Picks the reading voice: the studio narrator's voices first, then this device's. */
export function VoicePicker() {
  const [device, setDevice] = useState<{ uri: string; label: string }[]>([]);
  const [narr, setNarr] = useState<NarratorInfo>({ enabled: false, voices: [], default: "" });
  const [voice, setVoice] = useState("");
  useEffect(() => {
    const load = () =>
      setDevice(englishVoices().map((v) => ({ uri: v.voiceURI, label: `${v.name.replace(/^Microsoft /, "").replace(/ - English \(.*\)$/, "")}${v.localService ? "" : " (online)"}` })));
    load();
    const a = onVoices(load);
    const b = onNarrator(setNarr);
    return () => {
      a();
      b();
    };
  }, []);
  useEffect(() => {
    const p = reader.getPrefs().voice;
    setVoice(p ?? (narr.enabled ? `narrator:${narr.default}` : (device[0]?.uri ?? "")));
  }, [narr, device]);
  if (device.length + narr.voices.length < 2) return null;
  return (
    <label className="reader-rate reader-voice">
      <span className="sr-only">Voice</span>
      <select
        value={voice}
        onChange={(e) => {
          setVoice(e.target.value);
          reader.setPrefs({ voice: e.target.value });
          reader.jump(0);
        }}
      >
        {narr.enabled && (
          <optgroup label="Studio narrator">
            {narr.voices.map((v) => (
              <option key={v.name} value={`narrator:${v.name}`}>
                {v.name}, {v.trait.toLowerCase()}
              </option>
            ))}
          </optgroup>
        )}
        {device.length > 0 && (
          <optgroup label="This device">
            {device.map((v) => (
              <option key={v.uri} value={v.uri}>
                {v.label}
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </label>
  );
}

/** Auditions the narrator's voices on one sample, and sets the one to use. */
export function NarratorAudition({ sample }: { sample: string }) {
  const [narr, setNarr] = useState<NarratorInfo>({ enabled: false, voices: [], default: "" });
  const [chosen, setChosen] = useState("");
  const s = useReader();
  useEffect(() => onNarrator(setNarr), []);
  useEffect(() => {
    const p = reader.getPrefs().voice;
    setChosen(p?.startsWith("narrator:") ? p.slice(9) : narr.default);
  }, [narr]);
  if (!narr.enabled) return null;
  return (
    <div className="audition" role="group" aria-label="Choose the narrator">
      {narr.voices.map((v) => {
        const playing = s.status !== "idle" && s.label === `audition-${v.name}`;
        return (
          <div key={v.name} className={`audition-voice${chosen === v.name ? " is-chosen" : ""}`}>
            <span className="audition-name">{v.name}</span>
            <span className="audition-trait">{v.trait}</span>
            <span className="btn-row">
              <button type="button" className="btn small" aria-pressed={playing} onClick={() => (playing ? reader.stop() : reader.speak([{ text: sample }], `audition-${v.name}`, v.name))}>
                {playing ? "Stop" : "Hear it"}
              </button>
              <button
                type="button"
                className={`btn small${chosen === v.name ? " primary" : " ghost"}`}
                aria-pressed={chosen === v.name}
                onClick={() => {
                  setChosen(v.name);
                  reader.setPrefs({ voice: `narrator:${v.name}` });
                }}
              >
                {chosen === v.name ? "Your narrator" : "Use this voice"}
              </button>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ReaderBar() {
  const s = useReader();
  const [rate, setRate] = useState(1);
  useEffect(() => setRate(reader.getPrefs().rate), [s.status]);
  if (s.status === "idle") return null;
  return (
    <div className="reader-bar band" role="region" aria-label="Read aloud">
      <span className="reader-now" aria-live="polite">
        Reading part {s.index + 1} of {s.total}
      </span>
      <button type="button" className="icon-btn" aria-label="Previous part" onClick={() => reader.jump(-1)}>
        ‹
      </button>
      {s.status === "speaking" ? (
        <button type="button" className="icon-btn solid" aria-label="Pause" onClick={() => reader.pause()}>
          ❚❚
        </button>
      ) : (
        <button type="button" className="icon-btn solid" aria-label="Resume" onClick={() => reader.resume()}>
          ▶
        </button>
      )}
      <button type="button" className="icon-btn" aria-label="Next part" onClick={() => reader.jump(1)}>
        ›
      </button>
      <label className="reader-rate">
        <span className="sr-only">Speed</span>
        <select
          value={rate}
          onChange={(e) => {
            const r = Number(e.target.value);
            setRate(r);
            reader.setPrefs({ rate: r });
          }}
        >
          <option value={0.8}>Slower</option>
          <option value={1}>Normal</option>
          <option value={1.2}>Faster</option>
        </select>
      </label>
      <VoicePicker />
      <button type="button" className="icon-btn" aria-label="Stop reading" onClick={() => reader.stop()}>
        ✕
      </button>
    </div>
  );
}

export function SpeakerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
