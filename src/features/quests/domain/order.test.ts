import { describe, expect, it } from "vitest";
import { orderQuests, questGroup } from "./order";

const q = (id: string, status: string) => ({ id, status });

describe("orderQuests", () => {
  it("puts open source first, then client work in the agreed order", () => {
    const input = [q("buitrago", "client"), q("hostreach", "live"), q("fulepu", "client"), q("triage-bot", "open-source"), q("subinvoxa", "live"), q("context-engine-mcp", "open-source")];
    expect(orderQuests(input).map((d) => d.id)).toEqual(["context-engine-mcp", "triage-bot", "fulepu", "subinvoxa", "hostreach", "buitrago"]);
  });
  it("keeps unknown items after their group, in input order", () => {
    const input = [q("zeta", "client"), q("repo-x", "open-source"), q("hostreach", "live"), q("context-engine-mcp", "open-source")];
    expect(orderQuests(input).map((d) => d.id)).toEqual(["context-engine-mcp", "repo-x", "hostreach", "zeta"]);
  });
  it("does not mutate its input", () => {
    const input = [q("hostreach", "live"), q("context-engine-mcp", "open-source")];
    const copy = [...input];
    orderQuests(input);
    expect(input).toEqual(copy);
  });
});

describe("questGroup", () => {
  it("separates open source from client work", () => {
    expect(questGroup(q("a", "open-source"))).toBe("open-source");
    expect(questGroup(q("a", "live"))).toBe("client");
    expect(questGroup(q("a", "client"))).toBe("client");
  });
});
