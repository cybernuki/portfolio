"use client";

import { useEffect } from "react";
import { useMotion } from "./MotionProvider";
import { setupScrollMatchMedia, type MatchMediaLike } from "../domain/matchMedia";
import { GUILD_EASE, guildEase } from "../domain/ease";
import { scroller } from "./scroll";

/**
 * Motion runtime: reveals on scroll (GSAP + ScrollTrigger) and smooth scrolling (Lenis, fine pointers only).
 * The static tier downloads none of it. `data-ready` flips once everything is wired.
 */
export function MotionRuntime() {
  const { tier, caps, hydrated } = useMotion();

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.dataset.ready = "false";
    let disposed = false;
    let teardown: (() => void) | null = null;

    if (!caps.gsap) {
      root.dataset.ready = "true";
      return;
    }

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { CustomEase }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/CustomEase"),
      ]);
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const LenisCtor = caps.lenis && finePointer ? (await import("lenis")).default : null;
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger, CustomEase);
      const [x1, y1, x2, y2] = GUILD_EASE;
      CustomEase.create("guild", `M0,0 C${x1},${y1} ${x2},${y2} 1,1`);
      const mm = gsap.matchMedia();

      setupScrollMatchMedia(mm as unknown as MatchMediaLike, {
        // Runs on every device, phones included (see MOTION_CONDITIONS).
        onAll: () => {
          const rise = caps.reveals === "full";
          document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
            gsap.from(el, {
              opacity: 0,
              y: rise ? 18 : 0,
              duration: rise ? 0.8 : 0.4,
              ease: "guild",
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            });
          });
        },
        // Smooth scroll only for fine pointers; touch keeps native scrolling.
        onFine: LenisCtor
          ? () => {
              const lenis = new LenisCtor({ lerp: 0.12, easing: guildEase });
              scroller.lenis = lenis;
              lenis.on("scroll", ScrollTrigger.update);
              const tick = (time: number) => lenis.raf(time * 1000);
              gsap.ticker.add(tick);
              gsap.ticker.lagSmoothing(0);
              return () => {
                gsap.ticker.remove(tick);
                scroller.lenis = null;
                lenis.destroy();
              };
            }
          : undefined,
      });

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh).catch(() => {});
      requestAnimationFrame(() => {
        refresh();
        if (!disposed) root.dataset.ready = "true";
      });

      teardown = () => {
        mm.revert();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
      if (disposed) teardown();
    })().catch(() => {
      // GSAP failed to load: the page is fully usable without reveals.
      if (!disposed) root.dataset.ready = "true";
    });

    return () => {
      disposed = true;
      teardown?.();
      scroller.lenis = null;
    };
    // `tier` is a dependency on purpose: switching tiers rebuilds the runtime.
  }, [hydrated, tier, caps]);

  return null;
}
