import type { Locale } from "../../i18n/domain/locale";

interface ServiceInput {
  id: string;
  title: string;
  tagline: string;
  details: string;
}

export interface JsonLdInput {
  siteUrl: string;
  locale: Locale;
  name: string;
  headline: string;
  role: string;
  place: string;
  services: ServiceInput[];
  sameAs: string[];
}

type Node = Record<string, unknown> & { "@type": string };

export function buildJsonLd(input: JsonLdInput): { "@context": string; "@graph": Node[] } {
  const base = input.siteUrl.replace(/\/$/, "");
  const pageUrl = `${base}/${input.locale}`;
  const personId = `${base}/#person`;
  const person: Node = {
    "@type": "Person",
    "@id": personId,
    name: input.name,
    jobTitle: input.role,
    description: input.headline,
    url: pageUrl,
    address: { "@type": "PostalAddress", addressCountry: input.place },
    ...(input.sameAs.length ? { sameAs: input.sameAs } : {}),
  };
  const graph: Node[] = [
    { "@type": "WebSite", "@id": `${base}/#website`, url: base, name: input.name, inLanguage: input.locale },
    { "@type": "ProfilePage", "@id": `${pageUrl}#profile`, url: pageUrl, name: input.name, inLanguage: input.locale, mainEntity: { "@id": personId } },
    person,
    ...input.services.map<Node>((s) => ({
      "@type": "Service",
      "@id": `${pageUrl}#service-${s.id}`,
      name: s.title,
      description: `${s.tagline} ${s.details}`,
      provider: { "@id": personId },
      areaServed: "Worldwide",
      offers: { "@type": "Offer", url: `${pageUrl}#party`, availability: "https://schema.org/InStock" },
    })),
  ];
  return { "@context": "https://schema.org", "@graph": graph };
}
