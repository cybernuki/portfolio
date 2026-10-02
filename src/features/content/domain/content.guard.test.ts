import { describe, expect, it } from "vitest";
import raw from "@/content/portfolio-content.json";
import { MESSAGES } from "@/features/i18n/domain/messages";
import { buildJsonLd } from "@/features/seo/domain/jsonld";
import { resolveContact, selectContent, type RawContent } from "./content";
import { findForbidden } from "./forbidden";

const content = raw as unknown as RawContent;
/** Confidential names are enforced through SHA-256 hashes of 1-3 word grams (see forbidden.ts), never written in plain text. */
const expectClean = (text: string) => expect(findForbidden(text), "forbidden n-gram hash(es) found").toEqual([]);

/** Every string a visitor, crawler or share card can see for a locale. */
function visibleText(locale: "en" | "es"): string {
  const c = selectContent(content, locale);
  const jsonLd = buildJsonLd({
    siteUrl: "https://example.com",
    locale,
    name: c.name,
    headline: c.headline,
    role: c.role,
    place: c.place,
    services: c.services,
    sameAs: [],
  });
  const m = MESSAGES[locale];
  const og = [c.name, m.hero.eyebrow, m.hero.lore, ...Object.values(m.classes).map((x) => x.name)];
  return [JSON.stringify(c), JSON.stringify(m), JSON.stringify(jsonLd), og.join(" ")].join(" ");
}

/** Collects every string value of a JSON tree. */
function strings(node: unknown): string[] {
  if (typeof node === "string") return [node];
  if (Array.isArray(node)) return node.flatMap(strings);
  if (node && typeof node === "object") return Object.values(node).flatMap(strings);
  return [];
}
/** The identity borrows a feeling, never assets or names from these games. */
const BORROWED = /Witcher|Baldur|D&D|Dungeons|Forgotten Realms|Geralt/i;

describe("content guard (source of truth)", () => {
  for (const locale of ["en", "es"] as const) {
    const c = selectContent(content, locale);
    it(`${locale}: no forbidden client names and no TODO text after selection`, () => {
      const json = JSON.stringify(c);
      expectClean(json);
      expect(json).not.toMatch(/TODO/);
    });
    it(`${locale}: visible text, JSON-LD and OG text contain no forbidden name (1-3 word grams)`, () => {
      expectClean(visibleText(locale));
    });
    it(`${locale}: no visible string contains TODO`, () => {
      expect(strings(selectContent(content, locale)).filter((v) => /TODO/i.test(v))).toEqual([]);
      expect(strings(MESSAGES[locale]).filter((v) => /TODO/i.test(v))).toEqual([]);
      expect(visibleText(locale)).not.toMatch(/TODO/i);
    });
    it(`${locale}: no education, no lead claims except Subinvoxa`, () => {
      const json = JSON.stringify(c);
      expect(json).not.toMatch(/universidad|university|degree|diploma/i);
      const leads = c.caseStudies.filter((s) => /(tech|team|technical) lead|lead (engineer|developer)/i.test(JSON.stringify(s)));
      expect(leads.map((s) => s.id)).toEqual(["subinvoxa"]);
    });
    it(`${locale}: visible one-liners stay within 14 words (target 12, see TODO in report)`, () => {
      const lines = [
        ...c.services.map((s) => s.tagline),
        ...c.caseStudies.flatMap((s) => [s.problem, s.did, s.result]),
        ...c.process.map((p) => p.details),
        c.background.text,
      ];
      for (const l of lines) expect(l.trim().split(/\s+/).length, l).toBeLessThanOrEqual(14);
    });
  }
  for (const locale of ["en", "es"] as const) {
    it(`${locale}: UI copy (labels, classes, FAQ) has no forbidden names, TODO text, metrics or borrowed game names`, () => {
      const json = JSON.stringify(MESSAGES[locale]);
      expectClean(json);
      expect(json).not.toMatch(BORROWED);
      expect(json).not.toMatch(/TODO/);
      expect(json).not.toMatch(/\d+\s?%|\d+\+? (clients|projects|years)/i);
    });
    it(`${locale}: only Subinvoxa carries the Co-founder & Tech Lead title`, () => {
      const c = selectContent(content, locale);
      expect(JSON.stringify(MESSAGES[locale])).not.toMatch(/co-?founder|tech lead|líder técnico/i);
      const holders = c.caseStudies.filter((s) => /co-?founder/i.test(s.role));
      expect(holders.map((s) => s.id)).toEqual(["subinvoxa"]);
    });
    it(`${locale}: hero and class lines stay short (24 words per sentence at most)`, () => {
      const m = MESSAGES[locale];
      for (const line of [m.hero.lore, m.hero.plain, ...Object.values(m.classes).map((x) => x.idealFor)]) {
        for (const sentence of line.split(/[.!?]+/)) expect(sentence.trim().split(/\s+/).length).toBeLessThanOrEqual(24);
      }
    });
  }
  it("the raw content JSON contains no forbidden name", () => {
    expectClean(JSON.stringify(raw));
  });
  it("the shared contact resolves without TODO values", () => {
    const contact = resolveContact(content.contact);
    expect(JSON.stringify(contact)).not.toMatch(/TODO/);
    expect(contact.github).toMatch(/github\.com\/cybernuki/);
  });
});
