"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@/content/types";
import { Sleeve } from "./Sleeve";

/** The sleeve with its record. The record slides out once on arrival and turns only while a session is running. */
export function SleeveStage({ lesson, spinning = false, slide = true }: { lesson: Lesson; spinning?: boolean; slide?: boolean }) {
  const [out, setOut] = useState(!slide);
  useEffect(() => {
    if (!slide) return;
    const t = setTimeout(() => setOut(true), 250);
    return () => clearTimeout(t);
  }, [slide]);
  return (
    <div className={`sleeve-stage${out ? " out" : ""}${spinning ? " spinning" : ""}`} style={{ ["--label" as string]: lesson.color }}>
      <div className="disc" aria-hidden="true" />
      <Sleeve lesson={lesson} />
    </div>
  );
}
