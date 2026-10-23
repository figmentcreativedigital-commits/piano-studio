import type { Metadata } from "next";
import { ProgressView } from "@/components/ProgressView";

export const metadata: Metadata = { title: "Progress" };

export default function ProgressPage() {
  return (
    <>
      <div className="wrap page-head">
        <h1>Progress</h1>
        <p>What&apos;s steady, what needs another pass, and what comes back for review when. Self-ratings and anything measured are kept apart.</p>
      </div>
      <ProgressView />
    </>
  );
}
