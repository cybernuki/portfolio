import type { SigilKey } from "@/features/services/domain/classes";

/** One shared SVG symbol: the gold corner used by every frame. Own artwork, no external assets. */
export function CornerDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="corner" viewBox="0 0 18 18">
          <path d="M1 17 V5 Q1 1 5 1 H17" fill="none" stroke="#e9d19c" strokeWidth="1.2" />
          <path d="M4 12 V6.5 Q4 4 6.5 4 H12" fill="none" stroke="#b78f6d" strokeWidth=".8" />
          <rect x="0" y="0" width="3" height="3" transform="rotate(45 1.5 1.5)" fill="#e9d19c" />
        </symbol>
      </defs>
    </svg>
  );
}

/** The four SVG corners of a frame. The hairline border itself is CSS border-image. */
export function Corners() {
  return (
    <>
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <span key={pos} className={`c ${pos}`} aria-hidden="true">
          <svg focusable="false">
            <use href="#corner" />
          </svg>
        </span>
      ))}
    </>
  );
}

/** Hairline with a diamond. With a label it becomes a chapter plate that sits under the heading. */
export function Divider({ label, centered = false }: { label?: string; centered?: boolean }) {
  if (!label) {
    return (
      <div className="divider" aria-hidden="true">
        <i />
      </div>
    );
  }
  return (
    <div className={centered ? "divider" : "divider start"}>
      <i aria-hidden="true" />
      <p className="meta plate">{label}</p>
      {centered ? <i aria-hidden="true" /> : null}
    </div>
  );
}

const SIGILS: Record<SigilKey, React.ReactNode> = {
  conduit: (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.3 11 15.7 7M8.3 13l7.4 4" />
    </>
  ),
  artificer: (
    <>
      <path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  herald: (
    <>
      <path d="M4 6h16v10H9l-5 4z" />
      <path d="M8 10h8M8 13h5" />
    </>
  ),
  smith: <path d="M12 2c3 4 5 7 5 11a5 5 0 0 1-10 0c0-2 1-4 2-5 0 2 1 3 2 3 0-3 0-6 1-9z" />,
};

export function Sigil({ kind }: { kind: SigilKey }) {
  return (
    <div className="sigil" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {SIGILS[kind]}
      </svg>
    </div>
  );
}
