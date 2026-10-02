"use client";

import { FEATURES } from "@/config/features";
import { TIERS } from "@/features/motion/domain/tier";
import { useMotion } from "@/features/motion/ui/MotionProvider";
import { optionRows } from "../domain/options";

/** OPTIONS: MOTION full/calm/off plus music and sfx switches. The M key cycles the motion tier. */
export function OptionsPanel({ open }: { open: boolean }) {
  const { t, tier, setTier, music, sfx, setMusic, setSfx } = useMotion();
  const rows = optionRows(FEATURES.audio);
  return (
    <section id="hud-options" className="hud-panel options" hidden={!open} aria-label={t.options.title} data-testid="options">
      <h2 className="hud-text">{t.options.title}</h2>
      <div className="opt-row">
        <span className="opt-name" id="opt-motion">
          {t.options.motion}
        </span>
        <div role="group" aria-labelledby="opt-motion" className="seg">
          {TIERS.map((v) => (
            <button key={v} type="button" aria-pressed={tier === v} onClick={() => setTier(v)} data-testid={`tier-${v}`}>
              {t.options.tiers[v]}
            </button>
          ))}
        </div>
      </div>
      {rows.includes("music") ? (
      <div className="opt-row">
        <span className="opt-name" id="opt-music">
          {t.options.music}
        </span>
        <button type="button" role="switch" aria-checked={music} aria-labelledby="opt-music" className="switch" onClick={() => setMusic(!music)} data-testid="music-switch">
          {music ? t.options.on : t.options.off}
        </button>
      </div>
      ) : null}
      {rows.includes("sfx") ? (
      <div className="opt-row">
        <span className="opt-name" id="opt-sfx">
          {t.options.sfx}
        </span>
        <button type="button" role="switch" aria-checked={sfx} aria-labelledby="opt-sfx" className="switch" onClick={() => setSfx(!sfx)} data-testid="sfx-switch">
          {sfx ? t.options.on : t.options.off}
        </button>
      </div>
      ) : null}
      <p className="hud-text opt-hint">M</p>
    </section>
  );
}
