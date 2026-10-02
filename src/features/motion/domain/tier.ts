export type MotionTier = "full" | "calm" | "static";

export const TIERS: readonly MotionTier[] = ["full", "calm", "static"];

export function isTier(value: unknown): value is MotionTier {
  return typeof value === "string" && (TIERS as readonly string[]).includes(value);
}

/** Resolution order: stored choice, then prefers-reduced-motion (calm, never static), then full. */
export function resolveTier(input: { stored?: unknown; prefersReducedMotion: boolean }): MotionTier {
  if (isTier(input.stored)) return input.stored;
  return input.prefersReducedMotion ? "calm" : "full";
}

export function nextTier(tier: MotionTier): MotionTier {
  const i = TIERS.indexOf(tier);
  return TIERS[(i + 1) % TIERS.length] ?? "full";
}

export interface TierCapabilities {
  /** Download and use GSAP + ScrollTrigger (reveals). */
  gsap: boolean;
  /** Smooth scrolling (also requires a fine pointer). */
  lenis: boolean;
  reveals: "full" | "opacity" | "none";
  /** Ember layer: moving, a single still frame, or absent. */
  embers: "animated" | "still" | "off";
  /** Section transition: gold light sweep, plain fade, or nothing. */
  sweep: "full" | "fade" | "none";
}

export function capabilities(tier: MotionTier): TierCapabilities {
  switch (tier) {
    case "full":
      return { gsap: true, lenis: true, reveals: "full", embers: "animated", sweep: "full" };
    case "calm":
      return { gsap: true, lenis: false, reveals: "opacity", embers: "still", sweep: "fade" };
    case "static":
      return { gsap: false, lenis: false, reveals: "none", embers: "off", sweep: "none" };
  }
}
