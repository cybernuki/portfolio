export type OptionRow = "motion" | "music" | "sfx";

/** Rows of the OPTIONS panel. Music and sfx exist only when audio is enabled. */
export function optionRows(audioEnabled: boolean): readonly OptionRow[] {
  return audioEnabled ? ["motion", "music", "sfx"] : ["motion"];
}

/** Whether a stored or requested audio preference may take effect. */
export function audioActive(audioEnabled: boolean, requested: boolean): boolean {
  return audioEnabled && requested;
}
