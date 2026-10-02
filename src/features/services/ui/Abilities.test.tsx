import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import raw from "@/content/portfolio-content.json";
import { selectContent, type RawContent } from "@/features/content/domain/content";
import { MESSAGES } from "@/features/i18n/domain/messages";
import { MotionProvider } from "@/features/motion/ui/MotionProvider";
import { Abilities } from "./Abilities";

const CATALOG = "https://www.upwork.com/services/product/development-it-deploy-your-ai-built-app-to-production-2106139410396282667";
const content = raw as unknown as RawContent;

describe("Abilities catalog link", () => {
  for (const locale of ["en", "es"] as const) {
    it(`${locale}: only the prototype-to-production card links to the catalog`, () => {
      const c = selectContent(content, locale);
      expect(c.services.filter((s) => s.catalogUrl).map((s) => s.id)).toEqual(["prototype-to-production"]);
      const t = MESSAGES[locale];
      render(
        <MotionProvider locale={locale} messages={t}>
          <Abilities content={c} discs={[]} t={t} />
        </MotionProvider>,
      );
      const cards = screen.getAllByTestId("class-card");
      const links = screen.getAllByTestId("catalog-link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute("href", CATALOG);
      expect(links[0]).toHaveAttribute("target", "_blank");
      expect(links[0]).toHaveAttribute("rel", expect.stringContaining("noopener"));
      expect(links[0]).toHaveTextContent(t.abilities.catalog);
      expect(links[0]).toHaveClass("btn", "secondary");
      expect(links[0]).not.toHaveClass("primary");
      expect(within(cards[3]!).getByTestId("catalog-link")).toBe(links[0]);
      for (const card of cards.slice(0, 3)) expect(within(card).queryByTestId("catalog-link")).toBeNull();
    });
  }
  it("has the exact requested copy", () => {
    expect(MESSAGES.en.abilities.catalog).toBe("Buy as a fixed-price package");
    expect(MESSAGES.es.abilities.catalog).toBe("Contrátalo como paquete a precio fijo");
    expect(MESSAGES.en.abilities.watch).toBe("Watch the 40-second overview");
    expect(MESSAGES.es.abilities.watch).toBe("Ver el resumen de 40 segundos");
  });
});

describe("Abilities overview video", () => {
  it("renders the trigger only on the service that has a video, and no <video> until opened", () => {
    const t = MESSAGES.en;
    render(
      <MotionProvider locale="en" messages={t}>
        <Abilities content={selectContent(content, "en")} discs={[]} t={t} />
      </MotionProvider>,
    );
    expect(screen.getAllByTestId("overview-trigger")).toHaveLength(1);
    expect(document.querySelector("video")).toBeNull();
  });
});
