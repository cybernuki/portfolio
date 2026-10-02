/** Every storage access is wrapped: private windows and blocked storage must never break the page. */
export function readStorage(kind: "local" | "session", key: string): string | null {
  try {
    const s = kind === "local" ? window.localStorage : window.sessionStorage;
    return s.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(kind: "local" | "session", key: string, value: string): void {
  try {
    const s = kind === "local" ? window.localStorage : window.sessionStorage;
    s.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export const KEYS = {
  tier: "portfolio.motion",
  music: "portfolio.music",
  sfx: "portfolio.sfx",
} as const;
