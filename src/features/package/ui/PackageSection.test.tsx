import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import raw from "@/content/portfolio-content.json";
import { selectContent, type Disc, type RawContent } from "@/features/content/domain/content";
import { MESSAGES } from "@/features/i18n/domain/messages";
import { MotionProvider } from "@/features/motion/ui/MotionProvider";
import { PackageSection } from "./PackageSection";

const CATALOG = "https://www.upwork.com/services/product/development-it-deploy-your-ai-built-app-to-production-2106139410396282667";
const content = raw as unknown as RawContent;
const disc = (id: string): Disc => ({ id, kind: "case", title: id, stack: [], status: "live", link: null, stars: 0 });

describe("PackageSection", () => {
  for (const locale of ["en", "es"] as const) {
    it(`${locale}: heading, three tiers, primary CTA to the catalog, secondary opens the full video`, () => {
      const t = MESSAGES[locale];
      render(
        <MotionProvider locale={locale} messages={t}>
          <PackageSection content={selectContent(content, locale)} discs={[disc("fulepu"), disc("subinvoxa")]} t={t} />
        </MotionProvider>,
      );
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(t.sections.package.label);
      expect(screen.getAllByTestId("package-tier")).toHaveLength(3);
      const cta = screen.getByTestId("package-cta");
      expect(cta).toHaveAttribute("href", CATALOG);
      expect(cta).toHaveAttribute("target", "_blank");
      expect(cta).toHaveAttribute("rel", expect.stringContaining("noopener"));
      expect(cta).toHaveClass("btn", "primary");
      expect(cta).toHaveTextContent(t.package.cta);
      expect(screen.getByTestId("overview-trigger")).toHaveTextContent(t.package.watchFull);
      expect(within(screen.getByTestId("package-proof")).getAllByTestId("proof-link")).toHaveLength(2);
      const loop = screen.getByTestId("package-loop");
      expect(loop).toHaveAttribute("preload", "none");
      expect(loop).toHaveAttribute("src", "/media/deploy-ai-app-loop.mp4");
      expect(loop).not.toHaveAttribute("autoplay");
    });
  }
  it("renders nothing when no service is featured", () => {
    const c = selectContent(content, "en");
    const t = MESSAGES.en;
    const { container } = render(
      <MotionProvider locale="en" messages={t}>
        <PackageSection content={{ ...c, services: c.services.map((s) => ({ ...s, video: null })) }} discs={[]} t={t} />
      </MotionProvider>,
    );
    expect(container.querySelector("section")).toBeNull();
  });
});
