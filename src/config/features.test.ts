import { describe, expect, it } from "vitest";
import { FEATURES } from "./features";

describe("FEATURES", () => {
  it("keeps audio off unless NEXT_PUBLIC_ENABLE_AUDIO=true", () => {
    expect(FEATURES.audio).toBe(process.env.NEXT_PUBLIC_ENABLE_AUDIO === "true");
    expect(FEATURES.audio).toBe(false);
  });
});
