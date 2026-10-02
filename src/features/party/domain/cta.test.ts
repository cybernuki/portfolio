import { describe, expect, it } from "vitest";
import { appendQuest, isSafeHttpsUrl, resolveContactCtas, resolveCta } from "./cta";

const contact = {
  upwork: null,
  booking: null,
  github: "https://github.com/cybernuki",
  linkedin: "https://linkedin.com/in/x",
};

describe("resolveCta", () => {
  it("is available for a real https url", () => {
    expect(resolveCta("https://cal.com/x")).toEqual({ available: true, href: "https://cal.com/x" });
  });
  it("is coming soon for null, blank, TODO and non-https values", () => {
    for (const v of [null, undefined, "", "   ", "TODO(jhonatan): Upwork", "javascript:alert(1)", "http://insecure.dev"]) {
      expect(resolveCta(v)).toEqual({ available: false, href: null });
    }
  });
});

describe("isSafeHttpsUrl", () => {
  it("accepts only parseable https urls", () => {
    expect(isSafeHttpsUrl("https://www.upwork.com/freelancers/~abc")).toBe(true);
    expect(isSafeHttpsUrl("not a url")).toBe(false);
    expect(isSafeHttpsUrl("ftp://x.dev")).toBe(false);
  });
});

describe("appendQuest", () => {
  it("adds the chosen service as a query parameter, keeping existing ones", () => {
    expect(appendQuest("https://cal.com/x?month=2026-10", "mcp-servers")).toBe("https://cal.com/x?month=2026-10&quest=mcp-servers");
  });
  it("does nothing without a selection", () => {
    expect(appendQuest("https://cal.com/x", null)).toBe("https://cal.com/x");
  });
  it("leaves urls with a hash or an existing quest param untouched", () => {
    expect(appendQuest("https://cal.com/x#slot", "mcp-servers")).toBe("https://cal.com/x#slot");
    expect(appendQuest("https://cal.com/x?quest=a", "mcp-servers")).toBe("https://cal.com/x?quest=a");
  });
  it("never touches unsafe urls", () => {
    expect(appendQuest("http://insecure.dev", "mcp-servers")).toBe("http://insecure.dev");
  });
});

describe("resolveContactCtas", () => {
  it("keeps the fixed order upwork, booking, github, linkedin", () => {
    expect(resolveContactCtas(contact, null).map((c) => c.key)).toEqual(["upwork", "booking", "github", "linkedin"]);
  });
  it("marks unavailable ones as coming soon without an href", () => {
    const [upwork, booking] = resolveContactCtas(contact, null);
    expect(upwork).toMatchObject({ available: false, href: null });
    expect(booking).toMatchObject({ available: false, href: null });
  });
  it("gives the single ember primary to the first available of upwork, booking, linkedin, github", () => {
    const only = resolveContactCtas(contact, null).filter((c) => c.primary);
    expect(only.map((c) => c.key)).toEqual(["linkedin"]);
    const withUpwork = resolveContactCtas({ ...contact, upwork: "https://upwork.com/x" }, null).filter((c) => c.primary);
    expect(withUpwork.map((c) => c.key)).toEqual(["upwork"]);
  });
  it("appends the quest only to upwork and booking", () => {
    const all = resolveContactCtas({ ...contact, upwork: "https://upwork.com/x", booking: "https://cal.com/y" }, "bots-agents");
    expect(all.find((c) => c.key === "upwork")?.href).toBe("https://upwork.com/x?quest=bots-agents");
    expect(all.find((c) => c.key === "booking")?.href).toBe("https://cal.com/y?quest=bots-agents");
    expect(all.find((c) => c.key === "github")?.href).toBe("https://github.com/cybernuki");
  });
});
