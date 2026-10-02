import type { MotionTier } from "@/features/motion/domain/tier";

/** Hard ceiling for the ember layer. */
export const EMBER_MAX = 150;
export const PHONE_MAX_WIDTH = 600;

export interface EmberBudget {
  count: number;
  /** false = one still frame (calm) or nothing at all (static). */
  animate: boolean;
  /** Low pixel ratio range for the canvas. */
  dpr: [number, number];
}

function countFor(width: number): number {
  if (width < PHONE_MAX_WIDTH) return 50;
  if (width < 1024) return 90;
  if (width < 1920) return 120;
  return EMBER_MAX;
}

export function emberBudget({ tier, viewportWidth }: { tier: MotionTier; viewportWidth: number }): EmberBudget {
  if (tier === "static") return { count: 0, animate: false, dpr: [1, 1] };
  const phone = viewportWidth < PHONE_MAX_WIDTH;
  return { count: Math.min(EMBER_MAX, countFor(viewportWidth)), animate: tier === "full", dpr: [1, phone ? 1.25 : 1.5] };
}
