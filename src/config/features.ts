/**
 * Feature flags. Audio (music and sound effects) is built and tested but switched off:
 * set NEXT_PUBLIC_ENABLE_AUDIO=true at build time to bring it back.
 */
export const FEATURES = {
  audio: process.env.NEXT_PUBLIC_ENABLE_AUDIO === "true",
} as const;
