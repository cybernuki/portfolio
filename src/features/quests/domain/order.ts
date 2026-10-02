export type QuestGroup = "open-source" | "client";

/** Open source is proof anyone can read, so it leads. Client work follows in this order. */
const OPEN_SOURCE_ORDER = ["context-engine-mcp", "triage-bot"];
const CLIENT_ORDER = ["fulepu", "subinvoxa", "hostreach", "buitrago"];

export function questGroup(quest: { status: string }): QuestGroup {
  return quest.status === "open-source" ? "open-source" : "client";
}

export function orderQuests<T extends { id: string; status: string }>(quests: readonly T[]): T[] {
  const rank = (q: T): number => {
    const group = questGroup(q);
    const order = group === "open-source" ? OPEN_SOURCE_ORDER : CLIENT_ORDER;
    const at = order.indexOf(q.id);
    const base = group === "open-source" ? 0 : 1000;
    return base + (at === -1 ? 500 : at);
  };
  return quests
    .map((q, index) => ({ q, index, r: rank(q) }))
    .sort((a, b) => a.r - b.r || a.index - b.index)
    .map((x) => x.q);
}
