import { narrationTexts } from "@/lib/narration";
import { speechKey } from "@/lib/speech-text";

/*
 * The keys of every passage the narrator may voice. Used to record them all ahead of time,
 * so read-aloud starts at once. The passages are the site's public lesson text.
 */
export const dynamic = "force-static";

export function GET() {
  const keys = [...new Set(narrationTexts().map(speechKey))];
  return Response.json({ count: keys.length, keys });
}
