import type { SiteContent } from "@/features/content/domain/content";
import type { Messages } from "@/features/i18n/domain/messages";
import { Corners } from "@/features/theme/ui/ornaments";
import { SectionHead } from "@/features/theme/ui/SectionHead";
import { groupArsenal } from "../domain/arsenal";

/** A compact grid of tech chips grouped by service. No percentages, no skill bars. */
export function Arsenal({ content, t }: { content: SiteContent; t: Messages }) {
  const groups = groupArsenal(content.services, content.caseStudies);
  const byId = Object.fromEntries(content.services.map((s) => [s.id, s]));
  return (
    <section id="arsenal" aria-labelledby="arsenal-h" className="chapter" tabIndex={-1}>
      <SectionHead id="arsenal" copy={t.sections.arsenal} intro={t.arsenal.intro} />
      <div className="arsenal">
        {groups.map((g) => (
          <div key={g.serviceId} className="frame" data-reveal data-testid="arsenal-group">
            <Corners />
            <h3>
              <span className="class-name hud-text">{t.classes[g.serviceId]?.name}</span>
              <span>{byId[g.serviceId]?.title}</span>
            </h3>
            <ul className="tags">
              {g.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
