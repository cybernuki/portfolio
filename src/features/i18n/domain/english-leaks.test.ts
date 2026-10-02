import { describe, expect, it } from "vitest";
import raw from "@/content/portfolio-content.json";
import { selectContent, type RawContent } from "@/features/content/domain/content";
import { findEnglishWords, hasEnglishLeak } from "./english-leaks";
import { MESSAGES } from "./messages";

describe("findEnglishWords", () => {
  it("flags English UI words", () => {
    expect(findEnglishWords("Start this quest")).toEqual(["start", "this", "quest"]);
    expect(findEnglishWords("MOTION: FULL")).toEqual(["motion", "full"]);
    expect(findEnglishWords("The Conduit")).toEqual(["the", "conduit"]);
  });
  it("passes Spanish copy and allowlisted product names", () => {
    expect(hasEnglishLeak("Empezar esta misión")).toBe(false);
    expect(hasEnglishLeak("Claude Code en CI (GitHub Actions)")).toBe(false);
    expect(hasEnglishLeak("Co-founder y Tech Lead")).toBe(false);
    expect(hasEnglishLeak("Servidores MCP a medida")).toBe(false);
  });
});

describe("the Spanish copy has no English UI words", () => {
  it("MESSAGES.es, except the allowlist, is clean", () => {
    const strings: string[] = [];
    const walk = (v: unknown) => {
      if (typeof v === "string") strings.push(v);
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") Object.values(v).forEach(walk);
    };
    walk(MESSAGES.es);
    const leaks = strings.filter(hasEnglishLeak);
    expect(leaks).toEqual([]);
  });
  it("the es content source has no English UI words in visible fields", () => {
    const c = selectContent(raw as unknown as RawContent, "es");
    const strings = [
      c.headline,
      c.role,
      c.focus,
      c.place,
      c.languages,
      c.cta.headline,
      c.cta.primary,
      c.cta.secondary,
      c.cta.tertiary,
      ...c.services.flatMap((s) => [s.title, s.tagline]),
      ...c.caseStudies.flatMap((s) => [s.role, s.problem, s.did, s.result]),
      ...c.process.flatMap((p) => [p.title, p.details]),
      c.background.title,
      c.background.text,
    ];
    expect(strings.filter(hasEnglishLeak)).toEqual([]);
  });
});
