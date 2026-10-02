import { notFound } from "next/navigation";
import { isLocale } from "@/features/i18n/domain/locale";
import { loadPageData } from "@/features/content/infra/load";
import { buildJsonLd } from "@/features/seo/domain/jsonld";
import { SitePage } from "@/features/site/ui/SitePage";
import { SITE_URL } from "@/lib/site";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { content, contact, discs } = await loadPageData(locale);

  const jsonLd = buildJsonLd({
    siteUrl: SITE_URL,
    locale,
    name: content.name,
    headline: content.headline,
    role: content.role,
    place: content.place,
    services: content.services,
    sameAs: [contact.github, contact.linkedin, contact.upwork].filter((v): v is string => Boolean(v)),
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }} />
      <SitePage locale={locale} content={content} contact={contact} discs={discs} />
    </>
  );
}
