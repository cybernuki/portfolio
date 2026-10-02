"use client";

import { useRef } from "react";
import { Corners } from "@/features/theme/ui/ornaments";
import { guildStore, useGuild } from "@/features/party/ui/guildStore";
import { moveIndex } from "../domain/roving";

export interface QuestView {
  id: string;
  title: string;
  /** "Open source" or "Client work". */
  groupLabel: string;
  role: string | null;
  problem: string | null;
  did: string | null;
  result: string | null;
  description: string | null;
  stack: string[];
  link: string | null;
  linkLabel: string | null;
  stars: number;
}

export interface QuestLogCopy {
  tablist: string;
  problem: string;
  did: string;
  outcome: string;
  stack: string;
  link: string;
  soon: string;
  stars: string;
}

/** The quest log: a vertical tablist (arrow keys, Home, End) and one panel per project. Every panel is in the server HTML. */
export function QuestLog({ quests, copy }: { quests: QuestView[]; copy: QuestLogCopy }) {
  const { questId } = useGuild();
  const found = quests.findIndex((q) => q.id === questId);
  const index = found === -1 ? 0 : found;
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (i: number, focus: boolean) => {
    const q = quests[i];
    if (!q) return;
    guildStore.dispatch({ type: "quest", id: q.id });
    if (focus) tabs.current[i]?.focus();
  };

  return (
    <div className="quests">
      <div className="frame">
        <Corners />
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label={copy.tablist}
          className="qlist"
          onKeyDown={(e) => {
            const next = moveIndex(index, e.key, quests.length);
            if (next !== index) {
              e.preventDefault();
              select(next, true);
            }
          }}
        >
          {quests.map((q, i) => (
            <button
              key={q.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`quest-tab-${q.id}`}
              aria-selected={i === index}
              aria-controls={`quest-panel-${q.id}`}
              tabIndex={i === index ? 0 : -1}
              onClick={() => select(i, false)}
              data-testid="quest-tab"
            >
              <span className="gem" aria-hidden="true" />
              <span className="n">{q.title}</span>
              <span className="st">{q.groupLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {quests.map((q, i) => (
        <article
          key={q.id}
          id={`quest-panel-${q.id}`}
          role="tabpanel"
          aria-labelledby={`quest-tab-${q.id}`}
          hidden={i !== index}
          className="frame qdetail"
          data-testid="quest-panel"
          data-quest={q.id}
        >
          <Corners />
          <span className="hud-text">
            {q.groupLabel}
            {q.stars > 0 ? ` · ${q.stars} ${copy.stars}` : ""}
          </span>
          <h3 className="title">{q.title}</h3>
          {q.role ? <p className="role hud-text">{q.role}</p> : null}
          {q.problem ? (
            <dl>
              <div>
                <dt>{copy.problem}</dt>
                <dd>{q.problem}</dd>
              </div>
              <div>
                <dt>{copy.did}</dt>
                <dd>{q.did}</dd>
              </div>
              <div>
                <dt>{copy.outcome}</dt>
                <dd>{q.result}</dd>
              </div>
            </dl>
          ) : q.description ? (
            <p>{q.description}</p>
          ) : null}
          <ul className="tags" aria-label={copy.stack}>
            {q.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          {q.link ? (
            <a className="qlink" href={q.link} target="_blank" rel="noopener noreferrer">
              {q.linkLabel ?? copy.link}
            </a>
          ) : (
            <span className="hud-text">{copy.soon}</span>
          )}
        </article>
      ))}
    </div>
  );
}
