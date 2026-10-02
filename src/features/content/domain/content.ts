export type Locale = "es" | "en";

export interface RawService {
  id: string;
  title: string;
  tagline: string;
  proof: string[];
  details: string;
}
export interface RawCase {
  id: string;
  title: string;
  role: string;
  problem: string;
  did: string;
  result: string;
  stack: string[];
  status: string;
  link?: string | null;
  details: string;
}
export interface RawLocale {
  name: string;
  headline: string;
  role: string;
  focus: string;
  place: string;
  languages: string;
  services: RawService[];
  caseStudies: RawCase[];
  process: Array<{ step: number; title: string; details: string }>;
  background: { title: string; text: string; details: string };
  cta: { headline: string; primary: string; secondary: string; tertiary: string };
}
export interface RawContent {
  contact: Record<"upwork" | "github" | "linkedin" | "booking", string | null | undefined>;
  en: RawLocale;
  es: RawLocale;
}

export interface CaseStudy extends Omit<RawCase, "link"> {
  link: string | null;
}
export interface Contact {
  upwork: string | null;
  github: string | null;
  linkedin: string | null;
  booking: string | null;
}
export interface SiteContent extends Omit<RawLocale, "caseStudies"> {
  caseStudies: CaseStudy[];
}

export const ALLOWED_REPOS = ["discord-triage-agent", "context-engine-mcp"] as const;

const TODO_PATTERN = /^\s*TODO\b/i;

export function isTodo(value: unknown): boolean {
  return typeof value === "string" && TODO_PATTERN.test(value);
}

/** Turns TODO markers, blanks and non-strings into null so they never render. */
export function cleanValue(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || isTodo(trimmed)) return null;
  return trimmed;
}

export function resolveContact(raw: RawContent["contact"]): Contact {
  return {
    upwork: cleanValue(raw.upwork),
    github: cleanValue(raw.github),
    linkedin: cleanValue(raw.linkedin),
    booking: cleanValue(raw.booking),
  };
}

export function selectContent(raw: RawContent, locale: Locale): SiteContent {
  const l = raw[locale];
  return { ...l, caseStudies: l.caseStudies.map((c) => ({ ...c, link: cleanValue(c.link) })) };
}

export interface RepoInfo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
}

export interface Disc {
  id: string;
  kind: "case" | "repo";
  title: string;
  role?: string;
  problem?: string;
  did?: string;
  result?: string;
  description?: string;
  stack: string[];
  status: string;
  link: string | null;
  /** Stars are only shown when above zero. */
  stars: number;
}

/** Case studies are the base; allowed public repos upgrade them or add extra discs. */
export function mergeRepos(cases: CaseStudy[], repos: RepoInfo[]): Disc[] {
  const allowed = repos.filter((r) => (ALLOWED_REPOS as readonly string[]).includes(r.name));
  const used = new Set<string>();
  const discs: Disc[] = cases.map((c) => {
    const repo = allowed.find((r) => r.name === c.title);
    if (repo) used.add(repo.name);
    return {
      id: c.id,
      kind: "case",
      title: c.title,
      role: c.role,
      problem: c.problem,
      did: c.did,
      result: c.result,
      stack: c.stack,
      status: c.status,
      link: repo ? repo.html_url : c.link,
      stars: repo && repo.stargazers_count > 0 ? repo.stargazers_count : 0,
    };
  });
  for (const r of allowed) {
    if (used.has(r.name)) continue;
    discs.push({
      id: r.name,
      kind: "repo",
      title: r.name,
      description: r.description ?? undefined,
      stack: r.language ? [r.language] : [],
      status: "open-source",
      link: r.html_url,
      stars: r.stargazers_count > 0 ? r.stargazers_count : 0,
    });
  }
  return discs;
}
