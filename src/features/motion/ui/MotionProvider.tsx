"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { FEATURES } from "@/config/features";
import { audioActive } from "@/features/hud/domain/options";
import { capabilities, nextTier, resolveTier, type MotionTier, type TierCapabilities } from "../domain/tier";
import { KEYS, readStorage, writeStorage } from "./storage";
import { playChime, startMusic, stopMusic } from "./audio";
import type { Messages } from "@/features/i18n/domain/messages";
import type { Locale } from "@/features/i18n/domain/locale";

interface MotionContextValue {
  locale: Locale;
  t: Messages;
  tier: MotionTier;
  caps: TierCapabilities;
  setTier: (tier: MotionTier) => void;
  cycleTier: () => void;
  music: boolean;
  sfx: boolean;
  setMusic: (on: boolean) => void;
  setSfx: (on: boolean) => void;
  muted: boolean;
  toggleMute: () => void;
  announce: (message: string) => void;
  hydrated: boolean;
}

const MotionContext = createContext<MotionContextValue | null>(null);

export function useMotion(): MotionContextValue {
  const v = useContext(MotionContext);
  if (!v) throw new Error("useMotion must be used inside MotionProvider");
  return v;
}

export function MotionProvider({ locale, messages, children }: { locale: Locale; messages: Messages; children: ReactNode }) {
  const [tier, setTierState] = useState<MotionTier>("full");
  const [music, setMusicState] = useState(false);
  const [sfx, setSfxState] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [message, setMessage] = useState("");
  const firstGesture = useRef(false);
  const sfxRef = useRef(false);

  // Resolve persisted/system preferences after hydration (server markup is always the "full" shape).
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Persisted/system preferences are browser-only, so they resolve after hydration.
    /* eslint-disable react-hooks/set-state-in-effect */
    setTierState(resolveTier({ stored: readStorage("local", KEYS.tier), prefersReducedMotion: reduced }));
    const m = audioActive(FEATURES.audio, readStorage("local", KEYS.music) === "1");
    const s = audioActive(FEATURES.audio, readStorage("local", KEYS.sfx) === "1");
    setMusicState(m);
    setSfxState(s);
    sfxRef.current = s;
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    document.documentElement.dataset.tier = tier;
  }, [tier]);

  useEffect(() => {
    if (music) startMusic();
    else stopMusic();
    return () => stopMusic();
  }, [music]);

  useEffect(() => {
    sfxRef.current = sfx;
  }, [sfx]);

  // One sound on the first user gesture, only when the visitor has opted in.
  useEffect(() => {
    const onGesture = () => {
      if (firstGesture.current) return;
      firstGesture.current = true;
      if (FEATURES.audio && sfxRef.current) playChime();
    };
    window.addEventListener("pointerdown", onGesture, { once: true, passive: true });
    window.addEventListener("keydown", onGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, []);

  const announce = useCallback((m: string) => {
    setMessage("");
    window.setTimeout(() => setMessage(m), 30);
  }, []);

  const setTier = useCallback(
    (next: MotionTier) => {
      setTierState(next);
      writeStorage("local", KEYS.tier, next);
      announce(`${messages.options.motionAnnounce}: ${messages.options.tiers[next]}`);
    },
    [announce, messages],
  );

  const cycleTier = useCallback(() => setTier(nextTier(tier)), [setTier, tier]);

  const setMusic = useCallback((on: boolean) => {
    if (!FEATURES.audio) return;
    setMusicState(on);
    writeStorage("local", KEYS.music, on ? "1" : "0");
  }, []);
  const setSfx = useCallback((on: boolean) => {
    if (!FEATURES.audio) return;
    setSfxState(on);
    writeStorage("local", KEYS.sfx, on ? "1" : "0");
    if (on && !firstGesture.current) {
      firstGesture.current = true;
      playChime();
    }
  }, []);

  const muted = !music && !sfx;
  const toggleMute = useCallback(() => {
    if (muted) {
      setSfx(true);
      setMusic(true);
    } else {
      setSfx(false);
      setMusic(false);
    }
  }, [muted, setMusic, setSfx]);

  // M cycles the motion tier.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      if (e.key === "m" || e.key === "M") cycleTier();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycleTier]);

  const value = useMemo<MotionContextValue>(
    () => ({ locale, t: messages, tier, caps: capabilities(tier), setTier, cycleTier, music, sfx, setMusic, setSfx, muted, toggleMute, announce, hydrated }),
    [locale, messages, tier, setTier, cycleTier, music, sfx, setMusic, setSfx, muted, toggleMute, announce, hydrated],
  );

  return (
    <MotionContext.Provider value={value}>
      {children}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" data-testid="live-region">
        {message}
      </div>
    </MotionContext.Provider>
  );
}
