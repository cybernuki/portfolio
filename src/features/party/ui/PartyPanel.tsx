"use client";

import { resolveContactCtas, type ContactKey } from "../domain/cta";
import { useGuild } from "./guildStore";

interface PartyPanelProps {
  /** Plain service titles by id, for the "Quest: <service>" line. */
  services: Record<string, string>;
  contact: Record<ContactKey, string | null>;
  labels: Record<ContactKey, string>;
  copy: { quest: string; hint: string; soon: string };
}

/** The contact buttons and the quest line. Unavailable destinations show a tasteful "coming soon", never TODO text. */
export function PartyPanel({ services, contact, labels, copy }: PartyPanelProps) {
  const { serviceId } = useGuild();
  const ctas = resolveContactCtas(contact, serviceId);
  const chosen = serviceId ? services[serviceId] : undefined;

  return (
    <>
      <p id="party-quest" className="quest-line" data-selected={Boolean(chosen)} aria-live="polite" tabIndex={-1} data-testid="party-quest">
        {chosen ? (
          <>
            <strong>{copy.quest}:</strong> <span data-testid="party-quest-name">{chosen}</span>
          </>
        ) : (
          <span>{copy.hint}</span>
        )}
      </p>
      <div className="row" data-testid="party-ctas">
        {ctas.map((c) =>
          c.available && c.href ? (
            <a key={c.key} className={`btn ${c.primary ? "primary" : "secondary"}`} href={c.href} target="_blank" rel="noopener noreferrer" data-testid={`cta-${c.key}`}>
              {labels[c.key]}
            </a>
          ) : (
            <span key={c.key} className="btn soon" aria-disabled="true" data-testid={`cta-${c.key}`} data-soon="true">
              {labels[c.key]}
              <small>{copy.soon}</small>
            </span>
          ),
        )}
      </div>
    </>
  );
}
