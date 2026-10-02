import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cinzel, Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import { alternates, isLocale, LOCALES, type Locale } from "@/features/i18n/domain/locale";
import { MESSAGES } from "@/features/i18n/domain/messages";
import { loadPageData } from "@/features/content/infra/load";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

/** Cinzel: titles only, at 20px and up. Cormorant: lore lines. Inter: UI and body. JetBrains Mono: HUD labels. */
const title = Cinzel({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-cinzel", display: "swap" });
const lore = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["italic"], variable: "--font-cormorant", display: "swap" });
const ui = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const hud = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { content } = await loadPageData(locale);
  const alt = alternates(SITE_URL);
  const title = `${content.name} | ${MESSAGES[locale].siteTitleSuffix}`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: `${content.headline} ${content.focus}.`,
    alternates: { canonical: alt[locale], languages: { es: alt.es, en: alt.en, "x-default": alt["x-default"] } },
    openGraph: {
      type: "profile",
      siteName: content.name,
      title,
      description: content.headline,
      url: alt[locale],
      locale: locale === "es" ? "es_CO" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_CO"],
    },
    twitter: { card: "summary_large_image", title, description: content.headline },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;
  return (
    <html lang={l} className={`${title.variable} ${lore.variable} ${ui.variable} ${hud.variable}`} data-tier="full" data-ready="false">
      <body>{children}</body>
    </html>
  );
}
