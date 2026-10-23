import { NARRATOR_DEFAULT, NARRATOR_VOICES, narrationFor } from "@/lib/narration";
import { toSpeech } from "@/lib/speech-text";

export const runtime = "nodejs";

const VOICES = new Set<string>(NARRATOR_VOICES.map((v) => v.name));

/**
 * One passage, voiced. The id is the passage's key; only passages the app
 * itself reads are accepted. Responses are immutable for a given key and
 * voice, so Vercel's CDN keeps them and Google is asked once.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const text = narrationFor(id);
  if (!text) return new Response("Unknown passage", { status: 404 });
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) return new Response("Narrator is off", { status: 503 });
  const voice = new URL(req.url).searchParams.get("v") ?? NARRATOR_DEFAULT;
  if (!VOICES.has(voice)) return new Response("Unknown voice", { status: 400 });

  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text: toSpeech(text) },
      voice: { languageCode: "en-US", name: `en-US-Chirp3-HD-${voice}` },
      audioConfig: { audioEncoding: "MP3" },
    }),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 400);
    console.error(`Narration failed (${res.status}): ${detail}`);
    return new Response("Narration failed", { status: 502, headers: { "Cache-Control": "no-store" } });
  }
  const { audioContent } = (await res.json()) as { audioContent?: string };
  if (!audioContent) return new Response("Narration failed", { status: 502, headers: { "Cache-Control": "no-store" } });
  return new Response(Buffer.from(audioContent, "base64"), {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}
