"use client";

import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/features/motion/ui/MotionProvider";
import { previewPolicy } from "../domain/package";

interface Props {
  src: string;
  poster: string;
  label: string;
  playLabel: string;
  pauseLabel: string;
}

/** Muted looping preview. It starts only while in view (never via the autoplay attribute) and follows the motion tier. */
export function PackageLoop({ src, poster, label, playLabel, pauseLabel }: Props) {
  const { tier, hydrated } = useMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [userPlaying, setUserPlaying] = useState(false);
  const policy = previewPolicy(tier, inView);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [policy.render]);

  const wantPlay = hydrated && (policy.control ? userPlaying && inView : policy.play);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (wantPlay) void el.play().catch(() => undefined);
    else el.pause();
  }, [wantPlay]);

  if (hydrated && policy.render === "poster") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="package-media" src={poster} alt={label} width={1200} height={675} loading="lazy" decoding="async" data-testid="package-poster" />;
  }

  return (
    <div className="package-media-wrap">
      <video ref={ref} className="package-media" src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} data-testid="package-loop" />
      {hydrated && policy.control ? (
        <button type="button" className="package-play" aria-pressed={userPlaying} onClick={() => setUserPlaying((v) => !v)} data-testid="package-play">
          {userPlaying ? pauseLabel : playLabel}
        </button>
      ) : null}
    </div>
  );
}
