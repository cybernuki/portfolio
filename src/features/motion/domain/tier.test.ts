import { describe, expect, it } from "vitest";
import { capabilities, isTier, nextTier, resolveTier } from "./tier";

describe("resolveTier", () => {
  it("prefers a valid stored choice over everything", () => {
    expect(resolveTier({ stored: "static", prefersReducedMotion: false })).toBe("static");
    expect(resolveTier({ stored: "full", prefersReducedMotion: true })).toBe("full");
  });
  it("maps prefers-reduced-motion to calm, never static", () => {
    expect(resolveTier({ stored: null, prefersReducedMotion: true })).toBe("calm");
  });
  it("defaults to full", () => {
    expect(resolveTier({ stored: null, prefersReducedMotion: false })).toBe("full");
  });
  it("ignores garbage stored values", () => {
    expect(resolveTier({ stored: "banana", prefersReducedMotion: true })).toBe("calm");
    expect(resolveTier({ stored: undefined, prefersReducedMotion: false })).toBe("full");
  });
});

describe("tier helpers", () => {
  it("cycles full -> calm -> static -> full", () => {
    expect(nextTier("full")).toBe("calm");
    expect(nextTier("calm")).toBe("static");
    expect(nextTier("static")).toBe("full");
  });
  it("validates tiers", () => {
    expect(isTier("calm")).toBe(true);
    expect(isTier("nope")).toBe(false);
    expect(isTier(3)).toBe(false);
  });
  it("describes capabilities per tier", () => {
    expect(capabilities("full")).toEqual({ gsap: true, lenis: true, reveals: "full", embers: "animated", sweep: "full" });
    expect(capabilities("calm")).toEqual({ gsap: true, lenis: false, reveals: "opacity", embers: "still", sweep: "fade" });
    expect(capabilities("static")).toEqual({ gsap: false, lenis: false, reveals: "none", embers: "off", sweep: "none" });
  });
});
