/**
 * Detects English UI words in text that must be Spanish. Used by the unit guard on the copy
 * and by the Playwright walk of the rendered /es page. Product and tech names are removed first.
 */

/** Phrases that stay as they are in every locale (product names, repo names, one approved role title). */
export const PRODUCT_ALLOWLIST: readonly string[] = [
  "Claude Code",
  "Co-founder y Tech Lead",
  "GitHub Actions",
  "AWS Bedrock",
  "Amazon Bedrock",
  "AWS CDK",
  "AWS Amplify",
  "Amazon Cognito",
  "Amazon SES",
  "Docker Compose",
  "Google APIs",
  "Next.js",
  "Open Graph",
];

/** Distinctive English UI words. Words that are also Spanish (arsenal, no, a, me, red) are left out on purpose. */
const ENGLISH_WORDS = new Set(
  (
    "the and for with your you our from into this that are is of to quest quests menu options option close open join party skip content hire book call see view visit start " +
    "build built client clients work engineer problem outcome did what how where which who proof tools get gets ship shipped coming soon link languages language switch " +
    "on off full calm motion music sfx conduit artificer herald smith abilities journey codex chapter lore summons pact road hand-off discovery scope weekly updates stars " +
    "back top sections section menu hire me"
  )
    .split(/\s+/)
    .filter((w) => w !== "me"),
);

function stripAllowlist(text: string): string {
  let out = text;
  for (const phrase of PRODUCT_ALLOWLIST) out = out.split(phrase).join(" ");
  return out;
}

/** English words found in the text, lowercased, in order of appearance. */
export function findEnglishWords(text: string): string[] {
  const words = stripAllowlist(text).toLowerCase().match(/[a-záéíóúñü][a-záéíóúñü'-]*/g) ?? [];
  return words.filter((w) => ENGLISH_WORDS.has(w));
}

export function hasEnglishLeak(text: string): boolean {
  return findEnglishWords(text).length > 0;
}
