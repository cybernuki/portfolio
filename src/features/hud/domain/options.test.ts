import { describe, expect, it } from "vitest";
import { audioActive, optionRows } from "./options";

describe("optionRows", () => {
  it("hides the music and sfx switches when audio is off", () => {
    expect(optionRows(false)).toEqual(["motion"]);
  });
  it("shows them when audio is on", () => {
    expect(optionRows(true)).toEqual(["motion", "music", "sfx"]);
  });
});

describe("audioActive", () => {
  it("never plays with the flag off, even if the visitor stored a preference", () => {
    expect(audioActive(false, true)).toBe(false);
  });
  it("follows the preference with the flag on", () => {
    expect(audioActive(true, true)).toBe(true);
    expect(audioActive(true, false)).toBe(false);
  });
});
