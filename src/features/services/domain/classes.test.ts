import { describe, expect, it } from "vitest";
import raw from "@/content/portfolio-content.json";
import { MESSAGES } from "@/features/i18n/domain/messages";
import { selectContent, type RawContent } from "@/features/content/domain/content";
import { SERVICE_IDS, SERVICE_SIGILS } from "./classes";

const content = raw as unknown as RawContent;
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ");

describe("class cards copy", () => {
  it("knows exactly the four services of the content source", () => {
    expect(selectContent(content, "en").services.map((s) => s.id)).toEqual([...SERVICE_IDS]);
    expect(Object.keys(SERVICE_SIGILS).sort()).toEqual([...SERVICE_IDS].sort());
  });
  for (const locale of ["en", "es"] as const) {
    const services = selectContent(content, locale).services;
    for (const s of services) {
      const c = MESSAGES[locale].classes[s.id];
      it(`${locale}/${s.id}: has a proper class name and exactly 3 bullets taken from the service details`, () => {
        expect(c).toBeDefined();
        expect(c?.name).toMatch(locale === "en" ? /^The (Conduit|Artificer|Herald|Smith)$/ : /^(El Conducto|El Artífice|El Heraldo|El Herrero)$/);
        expect(c?.gets).toHaveLength(3);
        for (const g of c?.gets ?? []) expect(norm(s.details), g).toContain(norm(g));
        expect(c?.idealFor.length).toBeGreaterThan(10);
        expect(c?.idealFor.trim().split(/\s+/).length).toBeLessThanOrEqual(18);
      });
    }
  }
});
