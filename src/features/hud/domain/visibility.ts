export interface HudState {
  visible: boolean;
  lastY: number;
  menuOpen: boolean;
  focused: boolean;
}

export type HudEvent = { type: "scroll"; y: number } | { type: "focus" } | { type: "blur" } | { type: "menu"; open: boolean };

export const NEAR_TOP_PX = 80;
export const SCROLL_THRESHOLD_PX = 4;

export const initialHud: HudState = { visible: true, lastY: 0, menuOpen: false, focused: false };

export function reduceHud(state: HudState, event: HudEvent): HudState {
  switch (event.type) {
    case "focus":
      return { ...state, focused: true, visible: true };
    case "blur":
      return { ...state, focused: false };
    case "menu":
      return { ...state, menuOpen: event.open, visible: event.open ? true : state.visible };
    case "scroll": {
      const delta = event.y - state.lastY;
      let visible = state.visible;
      if (state.menuOpen || state.focused || event.y <= NEAR_TOP_PX) visible = true;
      else if (delta < -SCROLL_THRESHOLD_PX) visible = true;
      else if (delta > SCROLL_THRESHOLD_PX) visible = false;
      const moved = Math.abs(delta) > SCROLL_THRESHOLD_PX || event.y <= NEAR_TOP_PX;
      return { ...state, visible, lastY: moved ? event.y : state.lastY };
    }
  }
}
