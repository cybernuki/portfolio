import { cleanValue } from "@/features/content/domain/content";

export type ContactKey = "upwork" | "booking" | "github" | "linkedin";

export interface CtaState {
  available: boolean;
  href: string | null;
}

export interface ContactCta extends CtaState {
  key: ContactKey;
  /** The single ember button: the first available of upwork, booking, linkedin, github. */
  primary: boolean;
}

/** Display order of the contact buttons. */
const DISPLAY_ORDER: readonly ContactKey[] = ["upwork", "booking", "github", "linkedin"];
/** Which button earns the ember style when it is available. */
const PRIMARY_ORDER: readonly ContactKey[] = ["upwork", "booking", "linkedin", "github"];
/** Only these destinations understand the chosen quest. */
const QUEST_AWARE: readonly ContactKey[] = ["upwork", "booking"];

export function isSafeHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/** A missing, TODO, blank or non-https url is "coming soon" and never renders as a link. */
export function resolveCta(value: string | null | undefined): CtaState {
  const clean = cleanValue(value);
  if (!clean || !isSafeHttpsUrl(clean)) return { available: false, href: null };
  return { available: true, href: clean };
}

/** Adds ?quest=<service> to a safe https url. Urls with a hash or an existing quest param are left alone. */
export function appendQuest(url: string, serviceId: string | null): string {
  if (!serviceId || !isSafeHttpsUrl(url)) return url;
  const parsed = new URL(url);
  if (parsed.hash || parsed.searchParams.has("quest")) return url;
  parsed.searchParams.set("quest", serviceId);
  return parsed.toString();
}

export function resolveContactCtas(contact: Record<ContactKey, string | null | undefined>, serviceId: string | null): ContactCta[] {
  const resolved = DISPLAY_ORDER.map((key) => {
    const base = resolveCta(contact[key]);
    const href = base.href && QUEST_AWARE.includes(key) ? appendQuest(base.href, serviceId) : base.href;
    return { key, available: base.available, href, primary: false };
  });
  const primaryKey = PRIMARY_ORDER.find((key) => resolved.find((c) => c.key === key)?.available);
  return resolved.map((c) => ({ ...c, primary: c.key === primaryKey }));
}
