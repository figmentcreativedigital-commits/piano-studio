import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LESSONS, getLesson, lessonLabel } from "@/content";
import { SessionRunner } from "@/components/SessionRunner";

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
  if (!getLesson(id)) notFound();
  return (
    <Suspense>
      <SessionRunner id={id} />
    </Suspense>
  );
}
