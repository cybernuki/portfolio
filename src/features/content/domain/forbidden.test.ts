import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { findForbidden, tokenize } from "./forbidden";

const h = (s: string) => createHash("sha256").update(s).digest("hex");
// Harmless stand-ins: the real list is hashed and the real names never appear in the repo.
const LIST = [h("blue fox"), h("sample"), h("red tall fox")];

describe("findForbidden", () => {
  it("tokenizes lowercase words and ignores punctuation", () => {
    expect(tokenize("Blue-Fox, (SAMPLE)!")).toEqual(["blue", "fox", "sample"]);
  });
  it("catches single words case-insensitively", () => {
    expect(findForbidden("a Sample text", LIST)).toHaveLength(1);
  });
  it("catches two-word and three-word names across punctuation and case", () => {
    expect(findForbidden("the BLUE-fox.", LIST)).toHaveLength(1);
    expect(findForbidden("a red, tall   fox here", LIST)).toHaveLength(1);
  });
  it("does not match substrings or non-adjacent words", () => {
    expect(findForbidden("resampled blue and fox", LIST)).toEqual([]);
  });
  it("is clean on empty input", () => {
    expect(findForbidden("", LIST)).toEqual([]);
  });
});
