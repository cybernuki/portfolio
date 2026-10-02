import { createHash } from "node:crypto";
import hashes from "./forbidden-hashes.json";

/**
 * Confidential-name guard. The repo stores only SHA-256 hashes of the forbidden terms (see
 * scripts/gen-forbidden-hashes.mjs), never the names. Text is tokenised into words and every
 * 1-, 2- and 3-gram is hashed, so multi-word names are caught too.
 */
export const FORBIDDEN_HASHES: readonly string[] = hashes;

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

/** Returns the n-grams (1 to 3 words) of `text` whose hash is in `list`. Empty means clean. */
export function findForbidden(text: string, list: readonly string[] = FORBIDDEN_HASHES): string[] {
  const known = new Set(list);
  const words = tokenize(text);
  const hits = new Set<string>();
  for (let i = 0; i < words.length; i++) {
    for (let n = 1; n <= 3 && i + n <= words.length; n++) {
      const gram = words.slice(i, i + n).join(" ");
      if (known.has(sha256(gram))) hits.add(sha256(gram).slice(0, 8));
    }
  }
  return [...hits];
}
