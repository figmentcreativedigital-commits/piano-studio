import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckInForm } from "@/components/CheckInForm";

export const metadata: Metadata = { title: "Check in" };

export default function CheckInPage() {
  return (
    <>
      <div className="wrap page-head">
        <h1>Check in</h1>
        <p>Under a minute. A finished timer isn&apos;t proof of anything; these answers decide whether the next step is repetition, a simpler version, consolidation or something new.</p>
      </div>
      <div className="wrap" style={{ paddingBottom: 48 }}>
        <Suspense>
          <CheckInForm />
        </Suspense>
      </div>
    </>
  );
}
