import type { Disc, SiteContent } from "@/features/content/domain/content";
import type { Messages } from "@/features/i18n/domain/messages";
import { ProofLink } from "@/features/party/ui/QuestLinks";
import { OverviewVideo } from "@/features/services/ui/OverviewVideo";
import { Corners } from "@/features/theme/ui/ornaments";
import { SectionHead } from "@/features/theme/ui/SectionHead";
import { featuredPackage, tierRows } from "../domain/package";
import { PackageLoop } from "./PackageLoop";

const PROOF_IDS = ["fulepu", "subinvoxa"] as const;

/** Featured fixed-price package: inline preview, three tiers, one primary CTA, the full video in a dialog. */
export function PackageSection({ content, discs, t }: { content: SiteContent; discs: Disc[]; t: Messages }) {
  const featured = featuredPackage(content.services);
  if (!featured) return null;
  const p = t.package;
  const rows = tierRows(p.tiers, p.plus);
  const known = new Set(discs.map((d) => d.id));
  const proof = PROOF_IDS.filter((id) => known.has(id));
  return (
    <section id="package" aria-labelledby="package-h" className="chapter" tabIndex={-1}>
      <SectionHead id="package" copy={t.sections.package} />
      <div className="package" data-reveal>
        <div className="frame package-video">
          <Corners />
          <PackageLoop src={featured.video.loop} poster={featured.video.poster} label={p.previewLabel} playLabel={p.play} pauseLabel={p.pause} />
        </div>
        <div className="package-body">
          <p className="package-pitch">{p.pitch}</p>
          <ul className="package-tiers">
            {rows.map((r) => (
              <li key={r.name} data-testid="package-tier">
                <strong>{r.name}</strong>
                <span>{r.summary}</span>
              </li>
            ))}
          </ul>
          <div className="package-actions">
            <a className="btn primary" href={featured.catalogUrl} target="_blank" rel="noopener" data-testid="package-cta">
              {p.cta}
            </a>
            <OverviewVideo
              src={featured.video.src}
              poster={featured.video.poster}
              label={p.watchFull}
              title={t.abilities.videoTitle}
              closeLabel={t.abilities.close}
              fallback={t.abilities.videoFallback}
              triggerClass="btn secondary"
            />
          </div>
          {proof.length ? (
            <p className="package-proof" data-testid="package-proof">
              {p.proofLead}{" "}
              {proof.map((id, i) => (
                <span key={id}>
                  {i > 0 ? " · " : null}
                  <ProofLink questId={id} label={p.proofLabels[id] ?? id} />
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
