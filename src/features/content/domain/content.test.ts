import { describe, expect, it } from "vitest";
import { cleanValue, isTodo, mergeRepos, resolveContact, selectContent, type RawContent, type RepoInfo } from "./content";

const raw: RawContent = {
  contact: {
    upwork: "TODO(jhonatan): Upwork profile URL",
    github: "https://github.com/cybernuki",
    linkedin: "https://linkedin.com/in/x",
    booking: "TODO(jhonatan): link",
  },
  en: {
    name: "J",
    headline: "h",
    role: "r",
    focus: "f",
    place: "p",
    languages: "l",
    services: [{ id: "s", title: "t", tagline: "g", proof: [], details: "d" }],
    caseStudies: [
      { id: "triage-bot", title: "discord-triage-agent", role: "r", problem: "p", did: "d", result: "r", stack: ["TypeScript"], status: "open-source", link: "TODO(jhonatan): later", details: "x" },
      { id: "hostreach", title: "HostReach", role: "r", problem: "p", did: "d", result: "r", stack: ["NestJS"], status: "live", link: "https://www.hostreach.io/", details: "x" },
    ],
    process: [],
    background: { title: "b", text: "t", details: "d" },
    cta: { headline: "h", primary: "p", secondary: "s", tertiary: "t" },
  },
  es: {
    name: "J",
    headline: "h",
    role: "r",
    focus: "f",
    place: "p",
    languages: "l",
    services: [],
    caseStudies: [],
    process: [],
    background: { title: "b", text: "t", details: "d" },
    cta: { headline: "h", primary: "p", secondary: "s", tertiary: "t" },
  },
};

describe("TODO sanitising", () => {
  it("detects TODO markers", () => {
    expect(isTodo("TODO(jhonatan): x")).toBe(true);
    expect(isTodo("https://a.b")).toBe(false);
    expect(isTodo(null)).toBe(false);
  });
  it("cleanValue turns TODO and empty values into null", () => {
    expect(cleanValue("TODO(jhonatan): x")).toBeNull();
    expect(cleanValue("  ")).toBeNull();
    expect(cleanValue(undefined)).toBeNull();
    expect(cleanValue("https://ok.dev")).toBe("https://ok.dev");
  });
  it("resolveContact hides TODO channels", () => {
    expect(resolveContact(raw.contact)).toEqual({ upwork: null, github: "https://github.com/cybernuki", linkedin: "https://linkedin.com/in/x", booking: null });
  });
  it("selectContent never leaks TODO text and keeps the locale", () => {
    const c = selectContent(raw, "en");
    expect(JSON.stringify(c)).not.toMatch(/TODO/);
    expect(c.caseStudies[0]?.link).toBeNull();
    expect(c.caseStudies[1]?.link).toBe("https://www.hostreach.io/");
  });
});

describe("mergeRepos", () => {
  const cases = selectContent(raw, "en").caseStudies;
  it("falls back to case studies when no repos exist", () => {
    const discs = mergeRepos(cases, []);
    expect(discs.map((d) => d.id)).toEqual(["triage-bot", "hostreach"]);
    expect(discs[0]).toMatchObject({ link: null, stars: 0 });
  });
  it("upgrades a matching case study with the repo url and stars above zero", () => {
    const repos: RepoInfo[] = [{ name: "discord-triage-agent", html_url: "https://github.com/cybernuki/discord-triage-agent", description: null, stargazers_count: 3, language: "TypeScript" }];
    const discs = mergeRepos(cases, repos);
    expect(discs[0]).toMatchObject({ link: "https://github.com/cybernuki/discord-triage-agent", stars: 3 });
  });
  it("hides stars at 0 and ignores unrelated repos", () => {
    const repos: RepoInfo[] = [
      { name: "discord-triage-agent", html_url: "https://github.com/cybernuki/discord-triage-agent", description: null, stargazers_count: 0, language: null },
      { name: "AirBnB_clone", html_url: "https://github.com/cybernuki/AirBnB_clone", description: null, stargazers_count: 9, language: null },
    ];
    const discs = mergeRepos(cases, repos);
    expect(discs).toHaveLength(2);
    expect(discs[0]?.stars).toBe(0);
  });
  it("appends allowed repos that have no case study as repo discs", () => {
    const repos: RepoInfo[] = [{ name: "context-engine-mcp", html_url: "https://github.com/cybernuki/context-engine-mcp", description: "MCP server", stargazers_count: 1, language: "TypeScript" }];
    const discs = mergeRepos(cases, repos);
    expect(discs.at(-1)).toMatchObject({ id: "context-engine-mcp", kind: "repo", link: "https://github.com/cybernuki/context-engine-mcp", stars: 1, stack: ["TypeScript"] });
  });
});

describe("service catalogUrl", () => {
  const withCatalog = (catalogUrl: unknown): RawContent => ({
    ...raw,
    en: { ...raw.en, services: [{ ...raw.en.services[0]!, catalogUrl: catalogUrl as string }, { id: "plain", title: "p", tagline: "g", proof: [], details: "d" }] },
  });
  it("keeps a real catalogUrl and leaves services without one as null", () => {
    const s = selectContent(withCatalog("https://www.upwork.com/services/product/x"), "en").services;
    expect(s[0]?.catalogUrl).toBe("https://www.upwork.com/services/product/x");
    expect(s[1]?.catalogUrl ?? null).toBeNull();
  });
  it("turns TODO and blank catalogUrl values into null", () => {
    expect(selectContent(withCatalog("TODO: later"), "en").services[0]?.catalogUrl).toBeNull();
    expect(selectContent(withCatalog("  "), "en").services[0]?.catalogUrl).toBeNull();
  });
});
