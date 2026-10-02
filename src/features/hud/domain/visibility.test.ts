import { describe, expect, it } from "vitest";
import { initialHud, reduceHud } from "./visibility";

describe("hud visibility", () => {
  it("starts visible", () => {
    expect(initialHud.visible).toBe(true);
  });
  it("hides when scrolling down away from the top", () => {
    let s = reduceHud(initialHud, { type: "scroll", y: 400 });
    s = reduceHud(s, { type: "scroll", y: 520 });
    expect(s.visible).toBe(false);
  });
  it("returns on scroll up", () => {
    let s = reduceHud(initialHud, { type: "scroll", y: 900 });
    s = reduceHud(s, { type: "scroll", y: 1000 });
    expect(s.visible).toBe(false);
    s = reduceHud(s, { type: "scroll", y: 950 });
    expect(s.visible).toBe(true);
  });
  it("is visible near the top", () => {
    let s = reduceHud(initialHud, { type: "scroll", y: 900 });
    s = reduceHud(s, { type: "scroll", y: 1000 });
    s = reduceHud(s, { type: "scroll", y: 20 });
    expect(s.visible).toBe(true);
  });
  it("ignores sub-threshold jitter", () => {
    let s = reduceHud(initialHud, { type: "scroll", y: 900 });
    s = reduceHud(s, { type: "scroll", y: 1000 });
    s = reduceHud(s, { type: "scroll", y: 1001 });
    expect(s.visible).toBe(false);
  });
  it("stays visible on keyboard focus-visible and while the menu is open", () => {
    let s = reduceHud(initialHud, { type: "scroll", y: 900 });
    s = reduceHud(s, { type: "scroll", y: 1000 });
    expect(reduceHud(s, { type: "focus" }).visible).toBe(true);
    const open = reduceHud(s, { type: "menu", open: true });
    expect(open.visible).toBe(true);
    expect(reduceHud(open, { type: "scroll", y: 1200 }).visible).toBe(true);
    const closed = reduceHud(open, { type: "menu", open: false });
    expect(reduceHud(closed, { type: "scroll", y: 1400 }).visible).toBe(false);
  });
  it("hides again after blur when scrolling down", () => {
    let s = reduceHud(initialHud, { type: "scroll", y: 900 });
    s = reduceHud(s, { type: "focus" });
    s = reduceHud(s, { type: "blur" });
    s = reduceHud(s, { type: "scroll", y: 1100 });
    expect(s.visible).toBe(false);
  });
});
