import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { LESSONS, getLesson, lessonCode, lessonLabel } from "@/content";
import { SessionRunner } from "@/components/SessionRunner";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const l = getLesson(id);
  return l ? { title: `Session: ${lessonLabel(l)}` } : {};
}

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) notFound();
  return (
    <>
      {/* Focus mode: no tab bar on phones, so the way out is right here. */}
      <div className="wrap session-top">
        <Breadcrumbs items={[{ label: "Lessons", href: "/lessons" }, { label: lessonCode(lesson), href: `/lessons/${lesson.id}` }, { label: "Session" }]} />
        <Link className="btn small leave-btn" href={`/lessons/${lesson.id}`} data-tour="session-leave">
          <span aria-hidden="true">←</span> Leave session
        </Link>
      </div>
      <Suspense>
        <SessionRunner id={id} />
      </Suspense>
    </>
  );
}
