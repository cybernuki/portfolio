"use client";

import { useSyncExternalStore } from "react";
import { initialSelection, reduceSelection, type SelectionAction, type SelectionState, type ValidIds } from "../domain/selection";

/** Tiny external store: the chosen service and the open quest are shared by far-apart sections. */
let state: SelectionState = initialSelection;
let valid: ValidIds = { services: [], quests: [] };
const listeners = new Set<() => void>();

export const guildStore = {
  get: () => state,
  /** Registers the real ids once per page so stray input can never be selected. */
  configure(ids: ValidIds) {
    valid = ids;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  dispatch(action: SelectionAction) {
    const next = reduceSelection(state, action, valid);
    if (next === state) return;
    state = next;
    listeners.forEach((l) => l());
  },
};

export function useGuild(): SelectionState {
  return useSyncExternalStore(guildStore.subscribe, guildStore.get, () => initialSelection);
}
