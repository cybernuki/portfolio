export interface ArsenalGroup {
  serviceId: string;
  items: string[];
}

interface ServiceLike {
  id: string;
  title: string;
  tagline: string;
  details: string;
  proof: string[];
}
interface CaseLike {
  id: string;
  stack: string[];
}

/** Technologies that may be named when the service text really mentions them. Never invented. */
const VOCABULARY = [
  "MCP",
  "Claude Code",
  "GitHub Actions",
  "AGENTS.md",
  "CLAUDE.md",
  "Docker",
  "AWS CDK",
  "CI/CD",
  "Slack",
  "Discord",
  "Microsoft Teams",
  "AWS Bedrock",
  "Jev",
  "Lovable",
  "Cursor",
];

function termRegExp(term: string): RegExp {
  const escaped = term.replace(/[.*+?^${}()|[\]\\/]/g, (m) => "\\" + m);
  return new RegExp("(^|[^\\w])" + escaped + "($|[^\\w])", "i");
}

/** Compact chips per service: the stack of its proof projects, then technologies named in its own text. */
export function groupArsenal(services: readonly ServiceLike[], cases: readonly CaseLike[], max = 8): ArsenalGroup[] {
  const groups: ArsenalGroup[] = [];
  for (const s of services) {
    const seen = new Set<string>();
    const items: string[] = [];
    const add = (name: string) => {
      const key = name.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      items.push(name);
    };
    for (const c of cases) if (s.proof.includes(c.id)) c.stack.forEach(add);
    const text = `${s.title} ${s.tagline} ${s.details}`;
    for (const term of VOCABULARY) if (termRegExp(term).test(text)) add(term);
    if (items.length) groups.push({ serviceId: s.id, items: items.slice(0, max) });
  }
  return groups;
}
