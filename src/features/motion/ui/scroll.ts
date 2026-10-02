import { guildEase } from "../domain/ease";

interface LenisLike {
  scrollTo: (target: number, options?: { immediate?: boolean; duration?: number; easing?: (t: number) => number }) => void;
}

/** Lets UI controls scroll through the same scroller the runtime uses (Lenis or native). */
export const scroller: { lenis: LenisLike | null } = { lenis: null };

export const NAVIGATE_EVENT = "guild:navigate";

export function scrollToY(y: number, smooth: boolean) {
  if (scroller.lenis) scroller.lenis.scrollTo(y, { immediate: !smooth, duration: 1.1, easing: guildEase });
  else window.scrollTo({ top: y, behavior: smooth ? "smooth" : "auto" });
}

/** Scrolls to a section, announces the move (the light sweep listens) and hands focus to the section. */
export function scrollToSection(id: string, smooth: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  window.dispatchEvent(new CustomEvent(NAVIGATE_EVENT, { detail: { id } }));
  const hud = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hud-h")) || 0;
  const y = id === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY - hud;
  scrollToY(y, smooth);
  history.replaceState(null, "", `#${id}`);
  el.focus({ preventScroll: true });
}
