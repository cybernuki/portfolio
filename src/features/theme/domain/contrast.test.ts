import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TOKENS, contrastRatio } from "./tokens";

const AA = 4.5;

describe("Obsidian Guild tokens", () => {
  it("match the approved palette", () => {
    expect(TOKENS).toMatchObject({
      void: "#0a0a0b",
      obsidian: "#14171a",
      obsidian2: "#1b1f23",
      iron: "#2a2f33",
      gold: "#e9d19c",
      oldGold: "#b78f6d",
      bone: "#ebded2",
      ash: "#a3a09a",
      ember: "#c8452b",
    });
  });
  it("are the same values the stylesheet declares", () => {
    const css = readFileSync("src/app/globals.css", "utf8").toLowerCase();
    for (const hex of Object.values(TOKENS)) expect(css).toContain(hex);
  });
  it("keep text on every surface at WCAG AA", () => {
    const surfaces = [TOKENS.void, TOKENS.obsidian, TOKENS.obsidian2];
    for (const fg of [TOKENS.bone, TOKENS.ash, TOKENS.gold, TOKENS.oldGold]) {
      for (const bg of surfaces) expect(contrastRatio(fg, bg), `${fg} on ${bg}`).toBeGreaterThanOrEqual(AA);
    }
  });
  it("keep the ember button label readable on both gradient stops", () => {
    expect(contrastRatio(TOKENS.emberText, TOKENS.emberTop)).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(TOKENS.emberText, TOKENS.emberBottom)).toBeGreaterThanOrEqual(AA);
  });
});
