import { LESSONS } from "@/content";
import { buildIcs } from "@/lib/schedule";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * A static calendar file for the authored lessons. Importing it adds events
 * once; it does not stay in sync. Live calendar updates are written directly to
 * Google Calendar when the plan changes.
 */
export function GET() {
  return new Response(buildIcs(LESSONS, SITE_URL), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="woodshed-piano.ics"',
    },
  });
}
