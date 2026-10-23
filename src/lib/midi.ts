"use client";

/**
 * Optional MIDI input. Works in Chrome, Edge and Firefox on a computer with the
 * piano connected by USB; Safari and iPad browsers don't offer Web MIDI.
 * MIDI here reports which keys are down. It can't judge posture, fingering,
 * tension or musical expression, and the app never claims it does.
 */

type NoteListener = (e: { type: "on" | "off"; pitch: number; velocity: number }) => void;

interface MIDIMessageEventLike {
  data: Uint8Array;
}
interface MIDIInputLike {
  name?: string | null;
  onmidimessage: ((e: MIDIMessageEventLike) => void) | null;
}
interface MIDIAccessLike {
  inputs: Map<string, MIDIInputLike> | { forEach: (cb: (i: MIDIInputLike) => void) => void };
  onstatechange: (() => void) | null;
}

const listeners = new Set<NoteListener>();
type ControlListener = (e: { control: number; value: number }) => void;
const controlListeners = new Set<ControlListener>();
const statusListeners = new Set<(s: MidiStatus) => void>();
const down = new Set<number>();

export type MidiStatus = { state: "unsupported" | "idle" | "connecting" | "ready" | "denied" | "no-device"; devices: string[] };
let status: MidiStatus = { state: "idle", devices: [] };

export function midiSupported(): boolean {
  return typeof navigator !== "undefined" && typeof (navigator as Navigator & { requestMIDIAccess?: unknown }).requestMIDIAccess === "function";
}

function setStatus(s: MidiStatus) {
  status = s;
  statusListeners.forEach((l) => l(s));
}

export function getMidiStatus(): MidiStatus {
  if (!midiSupported()) return { state: "unsupported", devices: [] };
  return status;
}

export function onMidiStatus(l: (s: MidiStatus) => void) {
  statusListeners.add(l);
  return () => statusListeners.delete(l);
}

export function onNote(l: NoteListener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Control changes: 64 is the sustain pedal (0–63 up, 64–127 down). */
export function onControl(l: ControlListener) {
  controlListeners.add(l);
  return () => controlListeners.delete(l);
}

/**
 * Double-tap detector for the sustain pedal. Calls `fire` when the pedal goes
 * down twice within `window` ms; a single press does nothing, so normal
 * pedalling never triggers it.
 */
export function pedalDoubleTap(fire: () => void, window = 650) {
  let isDown = false;
  let last = 0;
  return onControl(({ control, value }) => {
    if (control !== 64) return;
    const nowDown = value >= 64;
    if (nowDown && !isDown) {
      const t = Date.now();
      if (t - last < window) {
        last = 0;
        fire();
      } else last = t;
    }
    isDown = nowDown;
  });
}

export function keysDown(): Set<number> {
  return new Set(down);
}

function handle(e: MIDIMessageEventLike) {
  const [st, d1, d2] = e.data;
  const cmd = st & 0xf0;
  if (cmd === 0x90 && d2 > 0) {
    down.add(d1);
    listeners.forEach((l) => l({ type: "on", pitch: d1, velocity: d2 }));
  } else if (cmd === 0x80 || (cmd === 0x90 && d2 === 0)) {
    down.delete(d1);
    listeners.forEach((l) => l({ type: "off", pitch: d1, velocity: 0 }));
  } else if (cmd === 0xb0) {
    controlListeners.forEach((l) => l({ control: d1, value: d2 }));
  }
}

export async function connectMidi(): Promise<MidiStatus> {
  if (!midiSupported()) {
    setStatus({ state: "unsupported", devices: [] });
    return status;
  }
  setStatus({ state: "connecting", devices: [] });
  try {
    const access = (await (navigator as Navigator & { requestMIDIAccess: (o?: object) => Promise<MIDIAccessLike> }).requestMIDIAccess({ sysex: false })) as MIDIAccessLike;
    const bind = () => {
      const names: string[] = [];
      access.inputs.forEach((input: MIDIInputLike) => {
        input.onmidimessage = handle;
        names.push(input.name || "MIDI input");
      });
      setStatus({ state: names.length ? "ready" : "no-device", devices: names });
    };
    bind();
    access.onstatechange = bind;
  } catch {
    setStatus({ state: "denied", devices: [] });
  }
  return status;
}
