"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useMotion } from "@/features/motion/ui/MotionProvider";

interface Props {
  src: string;
  poster: string;
  label: string;
  title: string;
  closeLabel: string;
  fallback: string;
  /** Class of the trigger: a text-style button in the class card, a secondary button in the featured section. */
  triggerClass?: string;
}

/**
 * A short overview video in a native modal dialog (focus trap, Esc and inert background come from the platform).
 * The <video> element only exists while the dialog is open, and never autoplays, so nothing is fetched up front.
 * In the static motion tier it is a plain link to the file instead.
 */
export function OverviewVideo({ src, poster, label, title, closeLabel, fallback, triggerClass = "textbtn" }: Props) {
  const { tier } = useMotion();
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  if (tier === "static") {
    return (
      <a className={triggerClass} href={src} target="_blank" rel="noopener" data-testid="overview-link">
        {label}
      </a>
    );
  }

  return (
    <>
      <button type="button" className={triggerClass} data-testid="overview-trigger" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {label}
      </button>
      <dialog
        ref={ref}
        className="overview"
        aria-labelledby={titleId}
        data-testid="overview-dialog"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <button type="button" className="overview-close" onClick={() => ref.current?.close()}>
          {closeLabel}
        </button>
        <p id={titleId} className="overview-title">
          {title}
        </p>
        {open ? (
          <video controls playsInline preload="none" poster={poster} src={src} data-testid="overview-video">
            {fallback}
          </video>
        ) : null}
      </dialog>
    </>
  );
}
