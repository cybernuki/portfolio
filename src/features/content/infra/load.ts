import raw from "@/content/portfolio-content.json";
import { ALLOWED_REPOS, mergeRepos, resolveContact, selectContent, type Disc, type Locale, type RawContent, type RepoInfo, type SiteContent, type Contact } from "../domain/content";

export const GITHUB_USER = "cybernuki";

async function fetchRepo(name: string): Promise<RepoInfo | null> {
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-build" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${name}`, {
      headers,
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const j = (await res.json()) as Partial<RepoInfo> & { private?: boolean };
    if (j.private || typeof j.name !== "string" || typeof j.html_url !== "string") return null;
    return {
      name: j.name,
      html_url: j.html_url,
      description: j.description ?? null,
      stargazers_count: typeof j.stargazers_count === "number" ? j.stargazers_count : 0,
      language: j.language ?? null,
    };
  } catch {
    return null; // optional: fall back to the JSON case studies
  }
}

/** Public repos are optional. Any failure resolves to an empty list. */
export async function fetchPublicRepos(): Promise<RepoInfo[]> {
  const found = await Promise.all(ALLOWED_REPOS.map(fetchRepo));
  return found.filter((r): r is RepoInfo => r !== null);
}

export interface PageData {
  content: SiteContent;
  contact: Contact;
  discs: Disc[];
}

export async function loadPageData(locale: Locale): Promise<PageData> {
  const content = selectContent(raw as unknown as RawContent, locale);
  const contact = resolveContact((raw as unknown as RawContent).contact);
  const repos = await fetchPublicRepos();
  return { content, contact, discs: mergeRepos(content.caseStudies, repos) };
}
