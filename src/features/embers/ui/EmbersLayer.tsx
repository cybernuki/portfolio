"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useMotion } from "@/features/motion/ui/MotionProvider";
import { emberBudget } from "../domain/budget";

const EmbersCanvas = dynamic(() => import("./EmbersCanvas"), { ssr: false });

class Boundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") ?? c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * The ONE ember layer of the site (R3F Points). Decorative: every fact lives in the HTML.
 * Without WebGL, in the static tier, or if the canvas fails, the hero keeps its CSS-only glow.
 */
export function EmbersLayer() {
  const { caps, tier, hydrated } = useMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [width, setWidth] = useState(1280);
  const [hidden, setHidden] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    // WebGL support and viewport width can only be read in the browser, after hydration.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!hydrated) return;
    setWebgl(hasWebGL());
    setWidth(window.innerWidth);
    /* eslint-enable react-hooks/set-state-in-effect */
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hydrated]);

  // Pause when the tab is hidden and when the hero is scrolled away.
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    const el = ref.current?.parentElement;
    let io: IntersectionObserver | null = null;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver(([entry]) => setOnScreen(Boolean(entry?.isIntersecting)));
      io.observe(el);
    }
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      io?.disconnect();
    };
  }, [webgl, caps.embers]);

  const budget = emberBudget({ tier, viewportWidth: width });
  const active = caps.embers !== "off" && webgl === true && budget.count > 0;

  useEffect(() => {
    document.documentElement.dataset.webgl = webgl === null ? "pending" : active ? "on" : "off";
  }, [webgl, active]);

  if (!active) return <div ref={ref} className="embers" aria-hidden="true" hidden />;

  return (
    <div ref={ref} className="embers" aria-hidden="true" data-testid="embers" data-count={budget.count} data-mode={caps.embers}>
      <Boundary onError={() => setWebgl(false)}>
        <EmbersCanvas count={budget.count} animate={budget.animate} paused={hidden || !onScreen} dpr={budget.dpr} />
      </Boundary>
    </div>
  );
}
