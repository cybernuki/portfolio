import { describe, expect, it } from "vitest";
import { activeSection } from "./active";

describe("activeSection", () => {
  const tops = [0, 900, 1800, 2700];
  it("picks the section under the middle of the viewport", () => {
    expect(activeSection(0, 800, tops)).toBe(0);
    expect(activeSection(600, 800, tops)).toBe(1);
    expect(activeSection(1500, 800, tops)).toBe(2);
  });
  it("clamps to the last section and handles an empty page", () => {
    expect(activeSection(99999, 800, tops)).toBe(3);
    expect(activeSection(100, 800, [])).toBe(0);
  });
});
