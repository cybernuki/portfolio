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
});
