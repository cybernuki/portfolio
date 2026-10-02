import { describe, expect, it } from "vitest";
import { GUILD_EASE, GUILD_EASE_CSS, cubicBezier } from "./ease";

describe("guild easing", () => {
  it("is the one approved curve", () => {
    expect(GUILD_EASE).toEqual([0.22, 0.8, 0.24, 1]);
    expect(GUILD_EASE_CSS).toBe("cubic-bezier(.22,.8,.24,1)");
  });
  it("starts at 0, ends at 1 and never goes backwards", () => {
    const f = cubicBezier(...GUILD_EASE);
    expect(f(0)).toBe(0);
    expect(f(1)).toBe(1);
    let prev = 0;
    for (let i = 1; i <= 100; i++) {
      const y = f(i / 100);
      expect(y).toBeGreaterThanOrEqual(prev);
      prev = y;
    }
  });
  it("is an ease-out: it covers most of the distance early", () => {
    const f = cubicBezier(...GUILD_EASE);
    expect(f(0.25)).toBeGreaterThan(0.5);
    expect(f(0.5)).toBeGreaterThan(0.85);
  });
  it("is linear for the linear control points", () => {
    const f = cubicBezier(1 / 3, 1 / 3, 2 / 3, 2 / 3);
    expect(f(0.3)).toBeCloseTo(0.3, 4);
  });
});
