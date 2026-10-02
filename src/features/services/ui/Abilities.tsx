import type { Disc, SiteContent } from "@/features/content/domain/content";
import type { Messages } from "@/features/i18n/domain/messages";
import { ProofLink, StartQuestLink } from "@/features/party/ui/QuestLinks";
import { Corners, Sigil } from "@/features/theme/ui/ornaments";
import { SectionHead } from "@/features/theme/ui/SectionHead";
import { isServiceId, SERVICE_SIGILS } from "../domain/classes";

/** The four classes. Facts live in server HTML; only the two links are client islands. */
export function Abilities({ content, discs, t }: { content: SiteContent; discs: Disc[]; t: Messages }) {
  const questTitle = Object.fromEntries(discs.map((d) => [d.id, d.title]));
  return (
    <section id="abilities" aria-labelledby="abilities-h" className="chapter" tabIndex={-1}>
      <SectionHead id="abilities" copy={t.sections.abilities} />
      <ul className="classes">
        {content.services.map((s) => {
          const c = t.classes[s.id];
          if (!c) return null;
          const proof = s.proof.filter((id) => questTitle[id]);
          return (
            <li key={s.id} data-reveal>
              <article className="frame class" id={`service-${s.id}`} data-testid="class-card" aria-labelledby={`class-${s.id}`}>
                <Corners />
                <Sigil kind={isServiceId(s.id) ? SERVICE_SIGILS[s.id] : "smith"} />
                <h3 id={`class-${s.id}`}>
                  {c.name}
                  <span className="plain-name">{s.title}</span>
                </h3>
                <p className="what">{s.tagline}</p>
                <div className="block">
                  <h4>{t.abilities.idealFor}</h4>
                  <p>{c.idealFor}</p>
                </div>
                <div className="block">
                  <h4>{t.abilities.gets}</h4>
                  <ul>
                    {c.gets.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
                <div className="block">
                  <h4>{t.abilities.proof}</h4>
                  <div className="proof-links">
                    {proof.length ? proof.map((id) => <ProofLink key={id} questId={id} label={questTitle[id] ?? id} />) : c.ownProof ? <span>{c.ownProof}</span> : null}
                  </div>
                </div>
                <StartQuestLink serviceId={s.id} label={t.abilities.start} ariaLabel={`${t.abilities.startFor} ${s.title}`} />
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
