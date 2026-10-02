export interface SelectionState {
  /** Service picked with "Start this quest"; shown in the contact section. */
  serviceId: string | null;
  /** Quest open in the quest log. */
  questId: string | null;
}

export type SelectionAction = { type: "service"; id: string } | { type: "quest"; id: string } | { type: "clear" };

export interface ValidIds {
  services: readonly string[];
  quests: readonly string[];
}

export const initialSelection: SelectionState = { serviceId: null, questId: null };

/** Unknown ids are ignored (same reference returned) so stray input can never reach the UI. */
export function reduceSelection(state: SelectionState, action: SelectionAction, valid: ValidIds): SelectionState {
  switch (action.type) {
    case "service":
      if (!valid.services.includes(action.id) || state.serviceId === action.id) return state;
      return { ...state, serviceId: action.id };
    case "quest":
      if (!valid.quests.includes(action.id) || state.questId === action.id) return state;
      return { ...state, questId: action.id };
    case "clear":
      return state.serviceId === null ? state : { ...state, serviceId: null };
  }
}
