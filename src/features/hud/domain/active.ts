/** Section whose range contains the middle of the viewport; clamps to the last section. */
export function activeSection(scrollY: number, viewport: number, tops: readonly number[]): number {
  const mid = scrollY + viewport / 2;
  let found = 0;
  for (let i = 0; i < tops.length; i++) {
    if (mid >= (tops[i] ?? 0)) found = i;
  }
  return found;
}
