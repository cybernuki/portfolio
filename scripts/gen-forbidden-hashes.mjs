// Local one-off: turns the plain-text terms in `.forbidden-terms.local` (gitignored, one per line)
// into SHA-256 hashes, so the repo can enforce a confidential-name guard without containing the names.
// Run: node scripts/gen-forbidden-hashes.mjs
// Normalisation MUST match src/features/content/domain/forbidden.ts: lowercase, split on non letters/digits, join with one space.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const termsFile = resolve(root, ".forbidden-terms.local");
const out = resolve(root, "src/features/content/domain/forbidden-hashes.json");

if (!existsSync(termsFile)) {
  console.error("[forbidden] .forbidden-terms.local not found; create it with one term per line");
  process.exit(1);
}
const normalise = (s) => (s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).join(" ");
const hashes = [
  ...new Set(
    readFileSync(termsFile, "utf8")
      .split(/\r?\n/)
      .map(normalise)
      .filter(Boolean)
      .map((t) => createHash("sha256").update(t).digest("hex")),
  ),
].sort();
writeFileSync(out, JSON.stringify(hashes, null, 2) + "\n");
console.log(`[forbidden] wrote ${hashes.length} hashes to ${out}`);
