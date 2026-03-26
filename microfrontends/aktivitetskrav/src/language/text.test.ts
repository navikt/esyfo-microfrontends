import { describe, expect, it } from "vitest";

import {
  BodyDefaultContent,
  getOppfyltBodyText,
  getUnntakBodyText,
} from "./text";

describe("getUnntakBodyText", () => {
  const testCases = [
    {
      description: "returns text for MEDISINSKE_GRUNNER",
      input: "MEDISINSKE_GRUNNER",
      matcher: (result: string) => expect(result).toContain("medisinske"),
    },
    {
      description: "returns text for TILRETTELEGGING_IKKE_MULIG",
      input: "TILRETTELEGGING_IKKE_MULIG",
      matcher: (result: string) => expect(result).toContain("tilrettelegging"),
    },
    {
      description: "returns default text for SJOMENN_UTENRIKS",
      input: "SJOMENN_UTENRIKS",
      matcher: (result: string) =>
        expect(result).toBe(BodyDefaultContent.unntak),
    },
    {
      description: "returns default text for undefined",
      input: undefined,
      matcher: (result: string) =>
        expect(result).toBe(BodyDefaultContent.unntak),
    },
  ] as const;

  it.each(testCases)("$description", ({ input, matcher }) => {
    matcher(getUnntakBodyText(input));
  });
});

describe("getOppfyltBodyText", () => {
  const testCases = [
    {
      description: "returns text for FRISKMELDT",
      input: "FRISKMELDT",
      matcher: (result: string) => expect(result).toContain("friskmeldt"),
    },
    {
      description: "returns text for TILTAK",
      input: "TILTAK",
      matcher: (result: string) => expect(result).toMatch(/tiltak/i),
    },
    {
      description: "returns default text for undefined",
      input: undefined,
      matcher: (result: string) =>
        expect(result).toBe(BodyDefaultContent.oppfylt),
    },
  ] as const;

  it.each(testCases)("$description", ({ input, matcher }) => {
    matcher(getOppfyltBodyText(input));
  });
});
