import { describe, expect, it } from "vitest";

import {
  BodyDefaultContent,
  getOppfyltBodyText,
  getUnntakBodyText,
} from "./text";

describe("getUnntakBodyText", () => {
  const casesWithKeyword = [
    { input: "MEDISINSKE_GRUNNER", keyword: "medisinske" },
    { input: "TILRETTELEGGING_IKKE_MULIG", keyword: "tilrettelegging" },
  ] as const;

  it.each(casesWithKeyword)("returns text containing '$keyword' for $input", ({
    input,
    keyword,
  }) => {
    expect(getUnntakBodyText(input)).toContain(keyword);
  });

  const casesWithDefault = [
    { description: "SJOMENN_UTENRIKS", input: "SJOMENN_UTENRIKS" as const },
    { description: "undefined", input: undefined },
  ];

  it.each(casesWithDefault)("returns default text for $description", ({
    input,
  }) => {
    expect(getUnntakBodyText(input)).toBe(BodyDefaultContent.unntak);
  });
});

describe("getOppfyltBodyText", () => {
  const casesWithKeyword = [
    { input: "FRISKMELDT", keyword: "friskmeldt" },
    { input: "TILTAK", keyword: "tiltak" },
  ] as const;

  it.each(casesWithKeyword)("returns text containing '$keyword' for $input", ({
    input,
    keyword,
  }) => {
    expect(getOppfyltBodyText(input)).toMatch(new RegExp(keyword, "i"));
  });

  it("returns default text for undefined", () => {
    expect(getOppfyltBodyText(undefined)).toBe(BodyDefaultContent.oppfylt);
  });
});
