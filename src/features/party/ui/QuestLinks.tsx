"use client";

import { AnchorLink } from "@/features/motion/ui/AnchorLink";
import { guildStore } from "./guildStore";

/** "Start this quest": goes to #party and records the chosen service. A plain #party link without JavaScript. */
export function StartQuestLink({ serviceId, label, ariaLabel }: { serviceId: string; label: string; ariaLabel: string }) {
  return (
    <AnchorLink to="party" className="btn secondary" aria-label={ariaLabel} data-testid="start-quest" data-service={serviceId} onNavigate={() => guildStore.dispatch({ type: "service", id: serviceId })}>
      {label}
    </AnchorLink>
  );
}

/** A proof link on a class card: opens that project in the quest log. */
export function ProofLink({ questId, label }: { questId: string; label: string }) {
  return (
    <AnchorLink to="quests" data-testid="proof-link" onNavigate={() => guildStore.dispatch({ type: "quest", id: questId })}>
      {label}
    </AnchorLink>
  );
}
