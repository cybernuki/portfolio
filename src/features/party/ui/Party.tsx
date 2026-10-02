import type { Contact, SiteContent } from "@/features/content/domain/content";
import type { Messages } from "@/features/i18n/domain/messages";
import { Corners } from "@/features/theme/ui/ornaments";
import { PartyPanel } from "./PartyPanel";

/** Contact: the lore line, the chosen quest and the CTAs. Missing destinations render as "coming soon". */
export function Party({ content, contact, t }: { content: SiteContent; contact: Contact; t: Messages }) {
  const services = Object.fromEntries(content.services.map((s) => [s.id, s.title]));
  const labels = {
    upwork: content.cta.primary,
    booking: content.cta.secondary,
    github: content.cta.tertiary,
    linkedin: "LinkedIn",
  };
  return (
    <section id="party" className="frame party" aria-labelledby="party-h" tabIndex={-1} data-reveal>
      <Corners />
      <span className="hud-text">{t.sections.party.kicker}</span>
      <h2 id="party-h" className="title">
        <span>{t.sections.party.label}</span>
        <span className="h-sub">{t.sections.party.sub}</span>
      </h2>
      <p className="lore">
        {content.cta.headline} {t.party.loreTail}
      </p>
      <PartyPanel services={services} contact={contact} labels={labels} copy={t.party} />
      <span className="hud-text">
        {t.party.languages}: {content.languages}
      </span>
    </section>
  );
}
