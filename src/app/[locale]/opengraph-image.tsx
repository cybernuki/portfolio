import { ImageResponse } from "next/og";
import { isLocale, LOCALES } from "@/features/i18n/domain/locale";
import { MESSAGES } from "@/features/i18n/domain/messages";
import { loadPageData } from "@/features/content/infra/load";
import { loadOgFont } from "@/features/seo/infra/ogFonts";
import { TOKENS } from "@/features/theme/domain/tokens";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Jhonatan Arenas";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

function Diamond({ filled = false, s = 12 }: { filled?: boolean; s?: number }) {
  return (
    <div
      style={{
        display: "flex",
        width: s,
        height: s,
        transform: "rotate(45deg)",
        border: `1px solid ${TOKENS.gold}`,
        background: filled ? TOKENS.gold : "transparent",
      }}
    />
  );
}

/** Obsidian Guild OG card: void, ember glow, gold hairline frame, name, lore line and the four classes. */
export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const { content } = await loadPageData(locale);
  const t = MESSAGES[locale];
  const CLASS_NAMES = Object.values(t.classes).map((c) => c.name);
  const name = content.name.toUpperCase();
  const eyebrow = t.hero.eyebrow.toUpperCase();
  const fontText = `${name}${eyebrow}${t.hero.lore}${CLASS_NAMES.join("").toUpperCase()}`;
  const [title, lore] = await Promise.all([loadOgFont("Cinzel", 700, fontText), loadOgFont("Cormorant Garamond", 400, fontText, true)]);
  const fonts = [title, lore].filter((f): f is NonNullable<typeof f> => f !== null);
  const titleFamily = title ? "Cinzel" : "sans-serif";
  const loreFamily = lore ? "Cormorant Garamond" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 28,
          background: `radial-gradient(60% 80% at 75% 85%, rgba(200,69,43,0.35), transparent 70%), radial-gradient(50% 60% at 15% 20%, rgba(233,209,156,0.10), transparent 70%), ${TOKENS.void}`,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: `1px solid ${TOKENS.oldGold}`,
            padding: "48px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 5, color: TOKENS.ash }}>
            <Diamond filled s={10} />
            <div style={{ display: "flex" }}>{eyebrow}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", fontFamily: titleFamily, fontWeight: 700, fontSize: 104, letterSpacing: 6, lineHeight: 1, color: TOKENS.gold }}>{name}</div>
            <div style={{ display: "flex", fontFamily: loreFamily, fontStyle: "italic", fontSize: 48, color: TOKENS.bone, maxWidth: 900, lineHeight: 1.15 }}>{t.hero.lore}</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: titleFamily, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: TOKENS.oldGold }}>
            {CLASS_NAMES.map((n, i) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 22 }}>
                {i > 0 ? <Diamond /> : null}
                <div style={{ display: "flex" }}>{n.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
