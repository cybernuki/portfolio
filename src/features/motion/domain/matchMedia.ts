/**
 * gsap.matchMedia conditions. `all` is always true on purpose: registering ONLY a
 * `(pointer: fine)` condition makes GSAP skip the whole setup on phones, which silently
 * kills scroll progress there. Keep `all` next to the specialised conditions.
 */
export const MOTION_CONDITIONS = {
  all: "all",
  fine: "(pointer: fine)",
  coarse: "(pointer: coarse)",
} as const;

export interface MatchMediaContext {
  conditions?: Record<string, boolean>;
}

export interface MatchMediaLike {
  add(conditions: Record<string, string>, fn: (ctx: MatchMediaContext) => void | (() => void)): unknown;
  revert(): void;
}

export interface ScrollMatchMediaHandlers {
  /** Runs on every device, including phones. */
  onAll: () => void | (() => void);
  /** Runs only when a fine pointer is available (smooth scroll, hover affordances). */
  onFine?: () => void | (() => void);
}

export function setupScrollMatchMedia(mm: MatchMediaLike, handlers: ScrollMatchMediaHandlers): void {
  mm.add({ ...MOTION_CONDITIONS }, (ctx) => {
    const cleanups: Array<void | (() => void)> = [handlers.onAll()];
    if (ctx.conditions?.fine && handlers.onFine) cleanups.push(handlers.onFine());
    return () => {
      for (const c of cleanups) if (typeof c === "function") c();
    };
  });
}
