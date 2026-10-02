"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { useMotion } from "./MotionProvider";
import { scrollToSection } from "./scroll";

/** An in-page link that works without JavaScript (plain #hash) and upgrades to the site scroller. */
export function AnchorLink({
  to,
  onNavigate,
  onClick,
  ...rest
}: { to: string; onNavigate?: () => void } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const { tier } = useMotion();
  return (
    <a
      {...rest}
      href={`#${to}`}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        onNavigate?.();
        scrollToSection(to, tier === "full");
      }}
    />
  );
}
