import { describe, expect, it } from "vitest";
import { initialSelection, reduceSelection } from "./selection";

const valid = { services: ["mcp-servers", "bots-agents"], quests: ["context-engine-mcp", "hostreach"] } as const;

describe("reduceSelection", () => {
  it("starts with nothing chosen", () => {
    expect(initialSelection).toEqual({ serviceId: null, questId: null });
  });
  it("records the chosen service", () => {
    expect(reduceSelection(initialSelection, { type: "service", id: "bots-agents" }, valid).serviceId).toBe("bots-agents");
  });
  it("replaces the previous choice", () => {
    const a = reduceSelection(initialSelection, { type: "service", id: "mcp-servers" }, valid);
    expect(reduceSelection(a, { type: "service", id: "bots-agents" }, valid).serviceId).toBe("bots-agents");
  });
  it("ignores ids that are not real services", () => {
    const a = reduceSelection(initialSelection, { type: "service", id: "mcp-servers" }, valid);
    expect(reduceSelection(a, { type: "service", id: "<script>" }, valid)).toBe(a);
  });
  it("tracks the open quest independently and rejects unknown quests", () => {
    const a = reduceSelection(initialSelection, { type: "quest", id: "hostreach" }, valid);
    expect(a).toEqual({ serviceId: null, questId: "hostreach" });
    expect(reduceSelection(a, { type: "quest", id: "nope" }, valid)).toBe(a);
  });
  it("clears only the service", () => {
    const a = reduceSelection({ serviceId: "mcp-servers", questId: "hostreach" }, { type: "clear" }, valid);
    expect(a).toEqual({ serviceId: null, questId: "hostreach" });
  });
});
