import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckInForm } from "@/components/CheckInForm";

export const metadata: Metadata = { title: "Check in" };

export default function CheckInPage() {
  return (
    <>
      <div className="wrap page-head">
        <h1>Check in</h1>
        <p>This takes less than a minute. Finishing the timer doesn&apos;t prove you learned something. Your answers decide what&apos;s next: repeat it, go easier, make it solid, or learn something new.</p>
      </div>
      <div className="wrap" style={{ paddingBottom: 48 }}>
        <Suspense>
          <CheckInForm />
        </Suspense>
      </div>
    </>
  );
}
