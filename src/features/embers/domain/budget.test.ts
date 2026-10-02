import { describe, expect, it } from "vitest";
import { EMBER_MAX, emberBudget } from "./budget";

describe("emberBudget", () => {
  it("is absent in the static tier", () => {
    expect(emberBudget({ tier: "static", viewportWidth: 1440 })).toMatchObject({ count: 0, animate: false });
  });
  it("is still (not animated) in the calm tier but present", () => {
    const b = emberBudget({ tier: "calm", viewportWidth: 1440 });
    expect(b.animate).toBe(false);
    expect(b.count).toBeGreaterThan(0);
  });
  it("animates in the full tier", () => {
    expect(emberBudget({ tier: "full", viewportWidth: 1440 }).animate).toBe(true);
  });
  it("uses about 50 particles on phones", () => {
    for (const w of [360, 390, 599]) expect(emberBudget({ tier: "full", viewportWidth: w }).count).toBeLessThanOrEqual(50);
  });
  it("never exceeds the ~150 ceiling and grows with the viewport", () => {
    let prev = 0;
    for (const w of [360, 600, 900, 1280, 1920, 3840]) {
      const { count } = emberBudget({ tier: "full", viewportWidth: w });
      expect(count).toBeLessThanOrEqual(EMBER_MAX);
      expect(count).toBeGreaterThanOrEqual(prev);
      prev = count;
    }
    expect(EMBER_MAX).toBeLessThanOrEqual(150);
  });
  it("keeps the pixel ratio low", () => {
    for (const w of [390, 1440]) {
      const { dpr } = emberBudget({ tier: "full", viewportWidth: w });
      expect(dpr[0]).toBe(1);
      expect(dpr[1]).toBeLessThanOrEqual(1.5);
    }
  });
});
