import type { SectionCopy } from "@/features/i18n/domain/messages";
import { Divider } from "./ornaments";

/** Every chapter heading pairs the game label (h2) with a plain label that carries the facts. */
export function SectionHead({ id, copy, intro }: { id: string; copy: SectionCopy; intro?: string }) {
  return (
    <>
      <header className="chapter-head" data-reveal>
        <h2 id={`${id}-h`} className="title">
          <span>{copy.label}</span>
          <span className="h-sub">{copy.sub}</span>
        </h2>
        {intro ? <p>{intro}</p> : null}
      </header>
      <Divider label={copy.kicker} />
    </>
  );
}
