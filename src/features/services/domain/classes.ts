/** The four services of the content source, in display order. */
export const SERVICE_IDS = ["mcp-servers", "ai-coding-harness", "bots-agents", "prototype-to-production"] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

export type SigilKey = "conduit" | "artificer" | "herald" | "smith";

/** Each class has its own inline SVG sigil (see the Sigil component). */
export const SERVICE_SIGILS: Record<ServiceId, SigilKey> = {
  "mcp-servers": "conduit",
  "ai-coding-harness": "artificer",
  "bots-agents": "herald",
  "prototype-to-production": "smith",
};

export interface ClassCopy {
  /** Proper class name, translated per locale. */
  name: string;
  /** One line, derived from the service tagline and details. */
  idealFor: string;
  /** Exactly three short excerpts of the service details. */
  gets: [string, string, string];
  /** Shown instead of quest links when the service has no public project. */
  ownProof?: string;
}

export function isServiceId(value: string): value is ServiceId {
  return (SERVICE_IDS as readonly string[]).includes(value);
}
