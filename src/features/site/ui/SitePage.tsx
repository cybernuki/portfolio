import type { Contact, Disc, SiteContent } from "@/features/content/domain/content";
import type { Locale } from "@/features/i18n/domain/locale";
import { MESSAGES } from "@/features/i18n/domain/messages";
import { Arsenal } from "@/features/arsenal/ui/Arsenal";
import { Codex } from "@/features/codex/ui/Codex";
import { Hero } from "@/features/hero/ui/Hero";
import { Hud } from "@/features/hud/ui/Hud";
import { Journey } from "@/features/journey/ui/Journey";
import { MotionProvider } from "@/features/motion/ui/MotionProvider";
import { MotionRuntime } from "@/features/motion/ui/MotionRuntime";
import { SectionSweep } from "@/features/motion/ui/SectionSweep";
import { GuildConfig } from "@/features/party/ui/GuildConfig";
import { PackageSection } from "@/features/package/ui/PackageSection";
import { Party } from "@/features/party/ui/Party";
import { Quests } from "@/features/quests/ui/Quests";
import { Abilities } from "@/features/services/ui/Abilities";
import { CornerDefs } from "@/features/theme/ui/ornaments";

export interface SitePageProps {
  locale: Locale;
  content: SiteContent;
  contact: Contact;
  discs: Disc[];
}

/** Conversion-ordered page: title screen, abilities, quests, journey, codex, arsenal, party. */
export function SitePage({ locale, content, contact, discs }: SitePageProps) {
  const t = MESSAGES[locale];
  return (
    <MotionProvider locale={locale} messages={t}>
      <a className="skip" href="#main">
        {t.skipToContent}
      </a>
      <CornerDefs />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Hud />
      <main id="main">
        <Hero name={content.name} copy={t.hero} nav={t.nav} />
        <div className="wrap">
          <Abilities content={content} discs={discs} t={t} />
          <PackageSection content={content} discs={discs} t={t} />
          <Quests discs={discs} t={t} />
          <Journey content={content} t={t} />
          <Codex content={content} contact={contact} t={t} />
          <Arsenal content={content} t={t} />
          <Party content={content} contact={contact} t={t} />
        </div>
      </main>
      <SectionSweep />
      <MotionRuntime />
      <GuildConfig services={content.services.map((s) => s.id)} quests={discs.map((d) => d.id)} />
    </MotionProvider>
  );
}
