import { describe, expect, it } from "vitest";
import { groupArsenal } from "./arsenal";

const services = [
  { id: "mcp", title: "Custom MCP servers", tagline: "t", details: "Typed tools. Proof: x.", proof: ["a"] },
  { id: "harness", title: "AI coding harness", tagline: "t", details: "CLAUDE.md and AGENTS.md, Claude Code in CI (GitHub Actions).", proof: [] },
  { id: "empty", title: "Nothing", tagline: "t", details: "Plain words only.", proof: [] },
];
const cases = [{ id: "a", stack: ["TypeScript", "MCP SDK", "TypeScript"] }];

describe("groupArsenal", () => {
  it("collects the stack of each service's proof cases without duplicates", () => {
    const g = groupArsenal(services, cases);
    expect(g.find((x) => x.serviceId === "mcp")?.items).toEqual(["TypeScript", "MCP SDK", "MCP"]);
  });
  it("adds technologies named in the service text, never invented ones", () => {
    const items = groupArsenal(services, cases).find((x) => x.serviceId === "harness")?.items ?? [];
    expect(items).toEqual(expect.arrayContaining(["Claude Code", "GitHub Actions"]));
    expect(items).not.toContain("Docker");
  });
  it("drops services that end up with no technologies", () => {
    expect(groupArsenal(services, cases).map((x) => x.serviceId)).toEqual(["mcp", "harness"]);
  });
  it("caps each group to keep the grid compact", () => {
    const many = [{ id: "a", stack: Array.from({ length: 20 }, (_, i) => `T${i}`) }];
    expect(groupArsenal([services[0]!], many, 8)[0]?.items).toHaveLength(8);
  });
});
