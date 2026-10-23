import { NARRATOR_DEFAULT, NARRATOR_VOICES } from "@/lib/narration";

export const dynamic = "force-dynamic";

/** Whether the studio narrator is available, and which voices it offers. */
export function GET() {
  const enabled = Boolean(process.env.GOOGLE_TTS_API_KEY);
  return Response.json(
    { enabled, voices: enabled ? NARRATOR_VOICES : [], default: NARRATOR_DEFAULT },
    { headers: { "Cache-Control": "no-store" } },
  );
}
