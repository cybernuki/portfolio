/** Obsidian Guild palette. The stylesheet declares the same values (guarded by a test). */
export const TOKENS = {
  void: "#0a0a0b",
  obsidian: "#14171a",
  obsidian2: "#1b1f23",
  iron: "#2a2f33",
  gold: "#e9d19c",
  oldGold: "#b78f6d",
  bone: "#ebded2",
  ash: "#a3a09a",
  ember: "#c8452b",
  /** Button gradient stops: slightly deeper than the ember token so the label passes AA. */
  emberTop: "#b8402a",
  emberBottom: "#86281a",
  emberText: "#fff4e6",
} as const;

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
