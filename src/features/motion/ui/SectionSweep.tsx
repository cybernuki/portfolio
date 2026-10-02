"use client";

import { useEffect, useState } from "react";
import { useMotion } from "./MotionProvider";
import { NAVIGATE_EVENT } from "./scroll";

/** Replaces any scene transition: a subtle gold light sweep (full) or a plain fade (calm) when jumping between sections. */
export function SectionSweep() {
  const { caps } = useMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (caps.sweep === "none") return;
    const onNavigate = () => setTick((n) => n + 1);
    window.addEventListener(NAVIGATE_EVENT, onNavigate);
    return () => window.removeEventListener(NAVIGATE_EVENT, onNavigate);
  }, [caps.sweep]);

  if (caps.sweep === "none" || tick === 0) return null;
  return <div key={tick} className="sweep" data-kind={caps.sweep} aria-hidden="true" onAnimationEnd={() => setTick(0)} />;
}
