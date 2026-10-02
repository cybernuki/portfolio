import type { Disc } from "@/features/content/domain/content";
import type { Messages } from "@/features/i18n/domain/messages";
import { SectionHead } from "@/features/theme/ui/SectionHead";
import { orderQuests, questGroup } from "../domain/order";
import { QuestLog, type QuestView } from "./QuestLog";

function shortUrl(url: string): string {
  return url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export function toQuestViews(discs: Disc[], t: Messages): QuestView[] {
  return orderQuests(discs).map((d) => ({
    id: d.id,
    title: d.title,
    groupLabel: questGroup(d) === "open-source" ? t.quests.openSource : t.quests.clientWork,
    role: d.role ?? null,
    problem: d.problem ?? null,
    did: d.did ?? null,
    result: d.result ?? null,
    description: d.description ?? null,
    stack: d.stack,
    link: d.link,
    linkLabel: d.link ? shortUrl(d.link) : null,
    stars: d.stars,
  }));
}

/** Proof: open source first, then client work. GitHub stars only show when above zero. */
export function Quests({ discs, t }: { discs: Disc[]; t: Messages }) {
  const quests = toQuestViews(discs, t);
  return (
    <section id="quests" aria-labelledby="quests-h" className="chapter" tabIndex={-1}>
      <SectionHead id="quests" copy={t.sections.quests} />
      <div data-reveal>
        <QuestLog quests={quests} copy={t.quests} />
      </div>
    </section>
  );
}
