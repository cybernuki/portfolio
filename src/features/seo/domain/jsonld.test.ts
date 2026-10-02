import { describe, expect, it } from "vitest";
import { buildJsonLd } from "./jsonld";

const input = {
  siteUrl: "https://x.dev",
  locale: "en" as const,
  name: "Jhonatan Arenas",
  headline: "h",
  role: "r",
  place: "Colombia",
  services: [{ id: "mcp-servers", title: "Custom MCP servers", tagline: "t", details: "d" }],
  sameAs: ["https://github.com/cybernuki", "https://linkedin.com/in/x"],
};

describe("buildJsonLd", () => {
  it("emits WebSite, ProfilePage, Person and one Service/Offer per service", () => {
    const g = buildJsonLd(input)["@graph"];
    const types = g.map((n) => n["@type"]);
    expect(types).toContain("WebSite");
    expect(types).toContain("ProfilePage");
    expect(types).toContain("Person");
    expect(types.filter((t) => t === "Service")).toHaveLength(1);
    const service = g.find((n) => n["@type"] === "Service");
    expect(service).toMatchObject({ name: "Custom MCP servers", offers: { "@type": "Offer" } });
  });
  it("never includes an email or empty sameAs", () => {
    const json = JSON.stringify(buildJsonLd({ ...input, sameAs: [] }));
    expect(json).not.toMatch(/email|@gmail/i);
    expect(json).not.toMatch(/"sameAs":\[\]/);
  });
  it("uses the catalog URL as the Offer url only for services that have one", () => {
    const g = buildJsonLd({
      ...input,
      services: [...input.services, { id: "prototype-to-production", title: "p", tagline: "t", details: "d", catalogUrl: "https://www.upwork.com/services/product/abc" }],
    })["@graph"].filter((n) => n["@type"] === "Service");
    expect((g[0]?.offers as { url: string }).url).toBe("https://x.dev/en#party");
    expect((g[1]?.offers as { url: string }).url).toBe("https://www.upwork.com/services/product/abc");
  });
});
