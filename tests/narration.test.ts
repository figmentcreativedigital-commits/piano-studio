import { afterEach, describe, expect, it, vi } from "vitest";
import { LESSONS } from "@/content";
import { NARRATOR_SAMPLE, NARRATOR_VOICES, lessonIdLine, narrationFor, narrationTexts, whenLine } from "@/lib/narration";
import { speechKey } from "@/lib/speech-text";
import { GET } from "@/app/api/voice/[id]/route";

const call = (id: string, v?: string) => GET(new Request(`https://x.test/api/voice/${id}${v ? `?v=${v}` : ""}`), { params: Promise.resolve({ id }) });

describe("narration whitelist", () => {
  it("knows every lesson's spoken lines", () => {
    for (const l of LESSONS) {
      for (const t of [l.title, l.objective, lessonIdLine(l), whenLine(l, "not-started")]) expect(narrationFor(speechKey(t)), t).toBe(t);
    }
    expect(narrationFor(speechKey(NARRATOR_SAMPLE))).toBe(NARRATOR_SAMPLE);
  });
  it("keys are stable and whitespace-insensitive", () => {
    expect(speechKey("Movement +  Blues Guide Tones ")).toBe(speechKey("Movement + Blues Guide Tones"));
    expect(speechKey("abc")).not.toBe(speechKey("abd"));
  });
  it("stays well inside the free tier", () => {
    const chars = [...new Set(narrationTexts())].join(" ").length;
    expect(chars).toBeLessThan(400_000);
  });
});

describe("voice route", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("refuses anything the app doesn't read", async () => {
    vi.stubEnv("GOOGLE_TTS_API_KEY", "test-key");
    const r = await call(speechKey("Say something the site never says."));
    expect(r.status).toBe(404);
  });

  it("is off without a key", async () => {
    vi.stubEnv("GOOGLE_TTS_API_KEY", "");
    const r = await call(speechKey(NARRATOR_SAMPLE));
    expect(r.status).toBe(503);
  });

  it("rejects unknown voices", async () => {
    vi.stubEnv("GOOGLE_TTS_API_KEY", "test-key");
    const r = await call(speechKey(NARRATOR_SAMPLE), "Nobody");
    expect(r.status).toBe(400);
  });

  it("voices a known passage with Chirp 3 HD and caches it", async () => {
    vi.stubEnv("GOOGLE_TTS_API_KEY", "test-key");
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ audioContent: Buffer.from("ID3fake").toString("base64") }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const r = await call(speechKey(NARRATOR_SAMPLE), NARRATOR_VOICES[1].name);
    expect(r.status).toBe(200);
    expect(r.headers.get("content-type")).toBe("audio/mpeg");
    expect(r.headers.get("cache-control")).toContain("immutable");
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("texttospeech.googleapis.com/v1/text:synthesize");
    const body = JSON.parse(String(init.body));
    expect(body.voice.name).toBe(`en-US-Chirp3-HD-${NARRATOR_VOICES[1].name}`);
    expect(body.input.text).toContain("E flat 3");
    expect(body.input.text).toContain("quarter note equals 60");
  });

  it("doesn't cache a failure", async () => {
    vi.stubEnv("GOOGLE_TTS_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 403 })));
    const r = await call(speechKey(NARRATOR_SAMPLE), NARRATOR_VOICES[2].name);
    expect(r.status).toBe(502);
    expect(r.headers.get("cache-control")).toBe("no-store");
  });

  it("keeps audio in the runtime cache, so Google is asked once per passage and voice", async () => {
    vi.stubEnv("GOOGLE_TTS_API_KEY", "test-key");
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ audioContent: Buffer.from("ID3again").toString("base64") }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const first = await call(speechKey(NARRATOR_SAMPLE), NARRATOR_VOICES[3].name);
    const second = await call(speechKey(NARRATOR_SAMPLE), NARRATOR_VOICES[3].name);
    expect(first.headers.get("x-narration-cache")).toBe("miss");
    expect(second.headers.get("x-narration-cache")).toBe("hit");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(Buffer.from(await second.arrayBuffer()).toString()).toBe("ID3again");
  });
});
