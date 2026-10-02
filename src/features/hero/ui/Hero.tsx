import type { Messages } from "@/features/i18n/domain/messages";
import { MENU_IDS } from "@/features/i18n/domain/messages";
import { EmbersLayer } from "@/features/embers/ui/EmbersLayer";
import { AnchorLink } from "@/features/motion/ui/AnchorLink";

/**
 * Title screen: name, lore headline, one plain sentence of what is sold, the CTAs and the vertical menu.
 * On phones the menu collapses into the HUD menu so the CTA stays in the first screen.
 */
export function Hero({ name, copy, nav }: { name: string; copy: Messages["hero"]; nav: Messages["nav"] }) {
  const [first, ...rest] = name.split(" ");
  return (
    <section id="top" className="screen" aria-labelledby="hero-h" tabIndex={-1}>
      <EmbersLayer />
      <div className="screen-grid">
        <div className="mark">
          <span className="hud-text">{copy.eyebrow}</span>
          <h1 id="hero-h" className="title">
            {first}
            <br />
            {rest.join(" ")}
          </h1>
          <p className="lore">{copy.lore}</p>
          <p className="plain">{copy.plain}</p>
          <div className="row">
            <AnchorLink to="party" className="btn primary" data-testid="hero-join">
              {copy.joinCta}
            </AnchorLink>
            <AnchorLink to="quests" className="btn secondary" data-testid="hero-quests">
              {copy.questsCta}
            </AnchorLink>
          </div>
        </div>
        <nav aria-label={copy.menuLabel}>
          <ul className="menu">
            {MENU_IDS.map((id) => (
              <li key={id}>
                <AnchorLink to={id}>
                  <span className="gem" aria-hidden="true" />
                  <span className="lbl">{nav[id].label}</span>
                  <span className="sub">{nav[id].sub}</span>
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
