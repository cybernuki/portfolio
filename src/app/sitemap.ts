import type { MetadataRoute } from "next";
import { alternates, LOCALES } from "@/features/i18n/domain/locale";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const alt = alternates(SITE_URL);
  return LOCALES.map((locale) => ({
    url: alt[locale],
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
    alternates: { languages: { es: alt.es, en: alt.en } },
  }));
}
