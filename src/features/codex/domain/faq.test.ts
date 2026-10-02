import { describe, expect, it } from "vitest";
import { buildFaq, type FaqCopy } from "./faq";

const copy: FaqCopy = {
  languagesQ: "Languages?",
  locationQ: "Where?",
  scopeQ: "Scope?",
  scopeLead: "Scope is fixed after the call.",
  whereQ: "Where do we work?",
  whereUpwork: "On Upwork.",
  whereBooking: "Book a call.",
  whereBoth: "On Upwork, or book a call.",
  whereSoon: "Coming soon.",
  backgroundQ: "Background?",
};
const content = {
  languages: "Spanish (native), English (B2)",
  place: "Colombia",
  background: { text: "Backend engineer: NestJS, Python and AWS." },
  process: [
    { step: 1, details: "A short call." },
    { step: 2, details: "I write down what is included." },
  ],
};

describe("buildFaq", () => {
  it("answers five questions in a fixed order using only content facts", () => {
    const faq = buildFaq({ content, contact: { upwork: null, booking: null }, copy });
    expect(faq.map((f) => f.id)).toEqual(["languages", "location", "scope", "where", "background"]);
    expect(faq[0]?.answer).toBe("Spanish (native), English (B2).");
    expect(faq[1]?.answer).toBe("Colombia (UTC-5).");
    expect(faq[2]?.answer).toBe("Scope is fixed after the call. I write down what is included.");
    expect(faq[4]?.answer).toBe("Backend engineer: NestJS, Python and AWS.");
  });
  it("describes where we work from what is actually available", () => {
    const base = { content, copy };
    expect(buildFaq({ ...base, contact: { upwork: "https://u.com/x", booking: null } })[3]).toMatchObject({ answer: "On Upwork.", links: [{ key: "upwork", href: "https://u.com/x" }] });
    expect(buildFaq({ ...base, contact: { upwork: null, booking: "https://c.com/y" } })[3]).toMatchObject({ answer: "Book a call.", links: [{ key: "booking", href: "https://c.com/y" }] });
    expect(buildFaq({ ...base, contact: { upwork: "https://u.com/x", booking: "https://c.com/y" } })[3]?.answer).toBe("On Upwork, or book a call.");
    expect(buildFaq({ ...base, contact: { upwork: null, booking: null } })[3]).toMatchObject({ answer: "Coming soon.", links: [] });
  });
  it("treats TODO markers as missing", () => {
    const faq = buildFaq({ content, contact: { upwork: "TODO(jhonatan): x", booking: "TODO" }, copy });
    expect(faq[3]?.answer).toBe("Coming soon.");
  });
  it("skips the scope question when the process has no fixed-scope step", () => {
    const faq = buildFaq({ content: { ...content, process: [] }, contact: { upwork: null, booking: null }, copy });
    expect(faq.map((f) => f.id)).not.toContain("scope");
  });
  it("never mentions prices or guarantees", () => {
    const faq = buildFaq({ content, contact: { upwork: null, booking: null }, copy });
    expect(JSON.stringify(faq)).not.toMatch(/\$|USD|price|guarantee/i);
  });
});
