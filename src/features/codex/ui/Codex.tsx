import type { Contact, SiteContent } from "@/features/content/domain/content";
import type { Messages } from "@/features/i18n/domain/messages";
import { Corners } from "@/features/theme/ui/ornaments";
import { SectionHead } from "@/features/theme/ui/SectionHead";
import { buildFaq } from "../domain/faq";

/** The FAQ as native <details>: open and close work without any JavaScript. */
export function Codex({ content, contact, t }: { content: SiteContent; contact: Contact; t: Messages }) {
  const faq = buildFaq({ content, contact, copy: t.codex });
  return (
    <section id="codex" aria-labelledby="codex-h" className="chapter" tabIndex={-1}>
      <SectionHead id="codex" copy={t.sections.codex} />
      <div className="faq">
        {faq.map((f) => (
          <details key={f.id} className="frame" data-testid="faq-item" data-reveal>
            <Corners />
            <summary>{f.question}</summary>
            <p className="answer">
              {f.answer}
              {f.links.map((l) => (
                <a key={l.key} href={l.href} target="_blank" rel="noopener noreferrer">
                  {new URL(l.href).hostname.replace(/^www\./, "")}
                </a>
              ))}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
