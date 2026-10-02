"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { MENU_IDS, SECTION_IDS } from "@/features/i18n/domain/messages";
import { otherLocale } from "@/features/i18n/domain/locale";
import { AnchorLink } from "@/features/motion/ui/AnchorLink";
import { useMotion } from "@/features/motion/ui/MotionProvider";
import { activeSection } from "../domain/active";
import { initialHud, reduceHud } from "../domain/visibility";
import { OptionsPanel } from "./OptionsPanel";

function Icon({ name }: { name: "menu" | "close" | "options" }) {
  const common = { width: 20, height: 20, viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.6, "aria-hidden": true, focusable: false } as const;
  if (name === "menu") return <svg {...common}><path d="M3 5h14M3 10h14M3 15h14" /></svg>;
  if (name === "close") return <svg {...common}><path d="M4 4l12 12M16 4L4 16" /></svg>;
  return (
    <svg {...common}>
      <path d="M3 6h9M15 6h2M3 14h2M8 14h9" />
      <circle cx="13.5" cy="6" r="1.8" />
      <circle cx="6.5" cy="14" r="1.8" />
    </svg>
  );
}

const TRACKED = ["top", ...SECTION_IDS] as const;

/** Slim top bar: name mark, section menu, language, options, and an always-visible compact ember CTA. */
export function Hud() {
  const { t, locale } = useMotion();
  const [state, dispatch] = useReducer(reduceHud, initialHud);
  const [menuOpen, setMenuOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [active, setActive] = useState<string>("top");
  const menuBtn = useRef<HTMLButtonElement>(null);
  const optionsBtn = useRef<HTMLButtonElement>(null);
  const other = otherLocale(locale);

  useEffect(() => {
    const onScroll = () => {
      dispatch({ type: "scroll", y: window.scrollY });
      const els = TRACKED.map((id) => document.getElementById(id));
      const tops = els.map((el) => (el ? el.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY));
      setActive(TRACKED[activeSection(window.scrollY, window.innerHeight, tops)] ?? "top");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const anyOpen = menuOpen || optionsOpen;
  useEffect(() => {
    dispatch({ type: "menu", open: anyOpen });
  }, [anyOpen]);

  useEffect(() => {
    if (!anyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const target = menuOpen ? menuBtn : optionsBtn;
      setMenuOpen(false);
      setOptionsOpen(false);
      target.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [anyOpen, menuOpen]);

  return (
    <header
      className="hud"
      data-hud
      data-visible={state.visible}
      onFocusCapture={(e) => {
        if ((e.target as HTMLElement).matches(":focus-visible")) dispatch({ type: "focus" });
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) dispatch({ type: "blur" });
      }}
    >
      <div className="hud-strip">
        <AnchorLink to="top" className="hud-mark" aria-label={t.hud.home} data-testid="hud-mark">
          <i aria-hidden="true" />
          <span className="short" aria-hidden="true">
            JA
          </span>
          <span className="full" aria-hidden="true">
            Jhonatan Arenas
          </span>
        </AnchorLink>

        <nav className="hud-nav" aria-label={t.hud.sections}>
          {MENU_IDS.map((id) => (
            <AnchorLink key={id} to={id} className="hud-link" aria-current={active === id ? "true" : undefined}>
              {t.nav[id].label}
            </AnchorLink>
          ))}
        </nav>

        <div className="hud-tools">
          <a className="hud-ctl" href={`/${other}`} hrefLang={other} aria-label={t.hud.languageSwitch} data-testid="lang-switch">
            {other.toUpperCase()}
          </a>
          <button
            ref={optionsBtn}
            type="button"
            className="hud-ctl"
            aria-expanded={optionsOpen}
            aria-controls="hud-options"
            aria-label={optionsOpen ? t.hud.closeOptions : t.hud.options}
            onClick={() => {
              setMenuOpen(false);
              setOptionsOpen((o) => !o);
            }}
            data-testid="options-btn"
          >
            <Icon name={optionsOpen ? "close" : "options"} />
          </button>
          <AnchorLink to="party" className="btn primary compact" aria-label={t.hud.join} data-testid="hud-join">
            <span className="long">{t.hud.join}</span>
            <span className="short" aria-hidden="true">
              {t.hud.joinShort}
            </span>
          </AnchorLink>
          <button
            ref={menuBtn}
            type="button"
            className="hud-ctl menu-btn"
            aria-expanded={menuOpen}
            aria-controls="hud-menu"
            aria-label={menuOpen ? t.hud.closeMenu : t.hud.menu}
            onClick={() => {
              setOptionsOpen(false);
              setMenuOpen((o) => !o);
            }}
            data-testid="menu-btn"
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      <div id="hud-menu" className="hud-panel" hidden={!menuOpen} data-testid="site-menu">
        <nav aria-label={t.hud.sections}>
          <ul className="menu">
            {MENU_IDS.map((id) => (
              <li key={id}>
                <AnchorLink to={id} aria-current={active === id ? "true" : undefined} onNavigate={() => setMenuOpen(false)}>
                  <span className="gem" aria-hidden="true" />
                  <span className="lbl">{t.nav[id].label}</span>
                  <span className="sub">{t.nav[id].sub}</span>
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <OptionsPanel open={optionsOpen} />
    </header>
  );
}
