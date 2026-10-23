import { getContext } from "@vercel/functions";
import { NARRATOR_DEFAULT, NARRATOR_VOICES } from "@/lib/narration";

export const dynamic = "force-dynamic";

/**
 * Whether the studio narrator is available, and which voices it offers.
 * `store` says where recordings are kept: "vercel" (the shared runtime
 * cache, which outlives deploys) or "memory" (one server's memory only).
 */
export function GET() {
  const enabled = Boolean(process.env.GOOGLE_TTS_API_KEY);
  const store = getContext().cache || (process.env.RUNTIME_CACHE_ENDPOINT && process.env.RUNTIME_CACHE_HEADERS) ? "vercel" : "memory";
  return Response.json(
    { enabled, voices: enabled ? NARRATOR_VOICES : [], default: NARRATOR_DEFAULT, store },
    { headers: { "Cache-Control": "no-store" } },
  );
}
