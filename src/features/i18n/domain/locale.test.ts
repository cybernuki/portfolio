import { describe, expect, it } from "vitest";
import { alternates, detectLocale, isLocale, otherLocale } from "./locale";

describe("locale", () => {
  it("detects Spanish from Accept-Language", () => {
    expect(detectLocale("es-CO,es;q=0.9,en;q=0.8")).toBe("es");
    expect(detectLocale("en-US,en;q=0.9,es;q=0.5")).toBe("en");
    expect(detectLocale("fr-FR,fr;q=0.9,es;q=0.4")).toBe("es");
  });
  it("defaults to English", () => {
    expect(detectLocale(null)).toBe("en");
    expect(detectLocale("de-DE")).toBe("en");
  });
  it("validates and toggles locales", () => {
    expect(isLocale("es")).toBe(true);
    expect(isLocale("pt")).toBe(false);
    expect(otherLocale("es")).toBe("en");
  });
  it("builds hreflang alternates with x-default", () => {
    expect(alternates("https://x.dev")).toEqual({ es: "https://x.dev/es", en: "https://x.dev/en", "x-default": "https://x.dev/en" });
  });
});
