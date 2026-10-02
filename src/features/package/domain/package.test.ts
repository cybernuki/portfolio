import { describe, expect, it } from "vitest";
import raw from "@/content/portfolio-content.json";
import { selectContent, type RawContent } from "@/features/content/domain/content";
import { MESSAGES } from "@/features/i18n/domain/messages";
import { featuredPackage, previewPolicy, tierRows } from "./package";

const content = raw as unknown as RawContent;

describe("featuredPackage (section visibility)", () => {
  const base = { id: "a", title: "t", tagline: "g", proof: [], details: "d", catalogUrl: null };
  it("is null when no service has both a catalog url and a video", () => {
    expect(featuredPackage([base])).toBeNull();
    expect(featuredPackage([{ ...base, catalogUrl: "https://x.dev/p" }])).toBeNull();
    expect(featuredPackage([{ ...base, catalogUrl: null, video: { src: "/a.mp4", poster: "/a.png", loop: "/l.mp4" } }])).toBeNull();
  });
  it("returns the first service that has both", () => {
    const s = { ...base, id: "b", catalogUrl: "https://x.dev/p", video: { src: "/a.mp4", poster: "/a.png", loop: "/l.mp4" } };
    expect(featuredPackage([base, s])?.service.id).toBe("b");
    expect(featuredPackage([base, s])?.catalogUrl).toBe("https://x.dev/p");
  });
  for (const locale of ["en", "es"] as const) {
    it(`${locale}: the real content has a featured package with a loop and a poster`, () => {
      const f = featuredPackage(selectContent(content, locale).services);
      expect(f?.service.id).toBe("prototype-to-production");
      expect(f?.video.loop).toMatch(/^\/media\/.*\.mp4$/);
      expect(f?.video.poster).toMatch(/^\/media\//);
    });
  }
});

describe("tierRows", () => {
  it("maps tiers to rows, the later tiers prefixed with the plus word", () => {
    const rows = tierRows(
      [
        { name: "A", items: ["x", "y"] },
        { name: "B", items: ["z"] },
      ],
      "plus",
    );
    expect(rows).toEqual([
      { name: "A", summary: "x, y" },
      { name: "B", summary: "plus z" },
    ]);
  });
  for (const locale of ["en", "es"] as const) {
    it(`${locale}: exactly three tiers, no prices`, () => {
      const p = MESSAGES[locale].package;
      const rows = tierRows(p.tiers, p.plus);
      expect(rows).toHaveLength(3);
      expect(JSON.stringify(rows)).not.toMatch(/[$€]|\busd\b|\d{2,}/i);
    });
  }
});

describe("previewPolicy (play policy per motion tier)", () => {
  it("full: autoplays only while in view", () => {
    expect(previewPolicy("full", true)).toEqual({ render: "video", control: false, play: true });
    expect(previewPolicy("full", false)).toEqual({ render: "video", control: false, play: false });
  });
  it("calm: poster with a play button, never plays on its own", () => {
    expect(previewPolicy("calm", true)).toEqual({ render: "video", control: true, play: false });
    expect(previewPolicy("calm", false).play).toBe(false);
  });
  it("static: poster image only", () => {
    expect(previewPolicy("static", true)).toEqual({ render: "poster", control: false, play: false });
  });
});
