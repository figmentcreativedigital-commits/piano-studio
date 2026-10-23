import type { Metadata } from "next";
import { ProgressView } from "@/components/ProgressView";

export const metadata: Metadata = { title: "Progress" };

export default function ProgressPage() {
  return (
    <>
      <div className="wrap page-head">
        <h1>Progress</h1>
        <p>See what&apos;s steady, what needs another try, and when each skill comes back for review. Your own ratings are kept apart from anything the app measures.</p>
      </div>
      <ProgressView />
    </>
  );
}
