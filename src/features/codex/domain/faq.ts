import { cleanValue } from "@/features/content/domain/content";

export interface FaqCopy {
  languagesQ: string;
  locationQ: string;
  scopeQ: string;
  /** Opening of the scope answer; the process step supplies the rest. */
  scopeLead: string;
  whereQ: string;
  whereUpwork: string;
  whereBooking: string;
  whereBoth: string;
  whereSoon: string;
  backgroundQ: string;
}

export interface FaqLink {
  key: "upwork" | "booking";
  href: string;
}

export interface FaqEntry {
  id: "languages" | "location" | "scope" | "where" | "background";
  question: string;
  answer: string;
  links: FaqLink[];
}

export interface FaqInput {
  content: {
    languages: string;
    place: string;
    background: { text: string };
    process: ReadonlyArray<{ step: number; details: string }>;
  };
  contact: { upwork?: string | null; booking?: string | null };
  copy: FaqCopy;
}

/** Colombia has no daylight saving time, so this is a fixed fact. */
const TIMEZONE = "UTC-5";

/** Every answer is built from existing content facts. No prices, no guarantees. */
export function buildFaq({ content, contact, copy }: FaqInput): FaqEntry[] {
  const upwork = cleanValue(contact.upwork);
  const booking = cleanValue(contact.booking);
  const links: FaqLink[] = [];
  if (upwork) links.push({ key: "upwork", href: upwork });
  if (booking) links.push({ key: "booking", href: booking });
  const where = upwork && booking ? copy.whereBoth : upwork ? copy.whereUpwork : booking ? copy.whereBooking : copy.whereSoon;

  const scopeStep = content.process.find((p) => p.step === 2);
  const entries: FaqEntry[] = [
    { id: "languages", question: copy.languagesQ, answer: `${content.languages}.`, links: [] },
    { id: "location", question: copy.locationQ, answer: `${content.place} (${TIMEZONE}).`, links: [] },
  ];
  if (scopeStep) entries.push({ id: "scope", question: copy.scopeQ, answer: `${copy.scopeLead} ${scopeStep.details}`, links: [] });
  entries.push(
    { id: "where", question: copy.whereQ, answer: where, links },
    { id: "background", question: copy.backgroundQ, answer: content.background.text, links: [] },
  );
  return entries;
}
