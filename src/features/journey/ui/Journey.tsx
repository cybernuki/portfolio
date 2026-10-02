import type { SiteContent } from "@/features/content/domain/content";
import type { Messages } from "@/features/i18n/domain/messages";
import { SectionHead } from "@/features/theme/ui/SectionHead";

/** The process as a road with four waypoints (vertical on phones). The order is real: it follows the content's steps. */
export function Journey({ content, t }: { content: SiteContent; t: Messages }) {
  const steps = [...content.process].sort((a, b) => a.step - b.step);
  return (
    <section id="journey" aria-labelledby="journey-h" className="chapter" tabIndex={-1}>
      <SectionHead id="journey" copy={t.sections.journey} />
      <ol className="journey" aria-label={t.journey.map} data-reveal>
        {steps.map((s, i) => (
          <li key={s.step} data-testid="journey-step">
            <span className="node" aria-hidden="true">
              <i />
            </span>
            <h3>{t.journey.steps[i] ?? s.title}</h3>
            <p className="step-name hud-text">{s.title}</p>
            <p className="plain-step">{s.details}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
