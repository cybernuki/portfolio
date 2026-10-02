import { describe, expect, it } from "vitest";
import { moveIndex } from "./roving";

describe("roving index", () => {
  it("moves with arrows and wraps", () => {
    expect(moveIndex(0, "ArrowRight", 3)).toBe(1);
    expect(moveIndex(2, "ArrowRight", 3)).toBe(0);
    expect(moveIndex(0, "ArrowLeft", 3)).toBe(2);
    expect(moveIndex(1, "ArrowDown", 3)).toBe(2);
    expect(moveIndex(1, "ArrowUp", 3)).toBe(0);
  });
  it("supports Home and End and ignores other keys", () => {
    expect(moveIndex(1, "Home", 4)).toBe(0);
    expect(moveIndex(1, "End", 4)).toBe(3);
    expect(moveIndex(1, "x", 4)).toBe(1);
    expect(moveIndex(0, "ArrowRight", 0)).toBe(0);
  });
});
