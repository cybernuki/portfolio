import { describe, expect, it, vi } from "vitest";
import { MOTION_CONDITIONS, setupScrollMatchMedia, type MatchMediaLike } from "./matchMedia";

type Ctx = { conditions: Record<string, boolean> };

/** Minimal fake of gsap.matchMedia(): evaluates each condition against a predicate. */
function fakeMatchMedia(matching: (query: string) => boolean): { mm: MatchMediaLike; run: () => void } {
  let registered: { conditions: Record<string, string>; fn: (ctx: Ctx) => void } | null = null;
  const mm: MatchMediaLike = {
    add(conditions, fn) {
      registered = { conditions: conditions as Record<string, string>, fn: fn as (ctx: Ctx) => void };
    },
    revert() {},
  };
  return {
    mm,
    run() {
      if (!registered) return;
      const evaluated: Record<string, boolean> = {};
      for (const [key, query] of Object.entries(registered.conditions)) evaluated[key] = matching(query);
      // GSAP only calls the function when at least one condition matches.
      if (Object.values(evaluated).some(Boolean)) registered.fn({ conditions: evaluated });
    },
  };
}

describe("setupScrollMatchMedia", () => {
  it("always includes an always-true all condition", () => {
    expect(MOTION_CONDITIONS.all).toBeTruthy();
    expect(MOTION_CONDITIONS).toHaveProperty("fine");
  });

  it("runs the base setup on a phone where pointer fine never matches", () => {
    const base = vi.fn();
    const fine = vi.fn();
    const { mm, run } = fakeMatchMedia((q) => q !== MOTION_CONDITIONS.fine);
    setupScrollMatchMedia(mm, { onAll: base, onFine: fine });
    run();
    expect(base).toHaveBeenCalledTimes(1);
    expect(fine).not.toHaveBeenCalled();
  });

  it("also enables fine-pointer extras on desktop", () => {
    const base = vi.fn();
    const fine = vi.fn();
    const { mm, run } = fakeMatchMedia(() => true);
    setupScrollMatchMedia(mm, { onAll: base, onFine: fine });
    run();
    expect(base).toHaveBeenCalledTimes(1);
    expect(fine).toHaveBeenCalledTimes(1);
  });

  it("documents why: a fine-only setup silently skips phones", () => {
    const onlyFine = vi.fn();
    const { mm, run } = fakeMatchMedia((q) => q !== "(pointer: fine)");
    mm.add({ fine: "(pointer: fine)" }, onlyFine);
    run();
    expect(onlyFine).not.toHaveBeenCalled();
  });
});
