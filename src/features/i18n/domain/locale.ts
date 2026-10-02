export type Locale = "es" | "en";
export const LOCALES: readonly Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return value === "es" || value === "en";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

/** Picks the first supported language by q-weight order in an Accept-Language header. */
export function detectLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { lang: tag.toLowerCase().split("-")[0] ?? "", q: q ? Number(q.slice(2)) : 1, index };
    })
    .sort((a, b) => b.q - a.q || a.index - b.index);
  for (const { lang } of ranked) if (isLocale(lang)) return lang;
  return DEFAULT_LOCALE;
}

export function alternates(siteUrl: string): Record<Locale | "x-default", string> {
  const base = siteUrl.replace(/\/$/, "");
  return { es: `${base}/es`, en: `${base}/en`, "x-default": `${base}/${DEFAULT_LOCALE}` };
}
