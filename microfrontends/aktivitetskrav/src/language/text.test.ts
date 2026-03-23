import { describe, expect, it } from "vitest";

import {
  BodyDefaultContent,
  getOppfyltBodyText,
  getUnntakBodyText,
} from "./text";

describe("getUnntakBodyText", () => {
  it("returns text for MEDISINSKE_GRUNNER", () => {
    expect(getUnntakBodyText("MEDISINSKE_GRUNNER")).toContain("medisinske");
  });

  it("returns text for TILRETTELEGGING_IKKE_MULIG", () => {
    expect(getUnntakBodyText("TILRETTELEGGING_IKKE_MULIG")).toContain(
      "tilrettelegging",
    );
  });

  it("returns default text for SJOMENN_UTENRIKS", () => {
    expect(getUnntakBodyText("SJOMENN_UTENRIKS")).toBe(
      BodyDefaultContent.unntak,
    );
  });

  it("returns default text for undefined", () => {
    expect(getUnntakBodyText(undefined)).toBe(BodyDefaultContent.unntak);
  });
});

describe("getOppfyltBodyText", () => {
  it("returns text for FRISKMELDT", () => {
    expect(getOppfyltBodyText("FRISKMELDT")).toContain("friskmeldt");
  });

  it("returns text for TILTAK", () => {
    expect(getOppfyltBodyText("TILTAK")).toMatch(/tiltak/i);
  });

  it("returns default text for undefined", () => {
    expect(getOppfyltBodyText(undefined)).toBe(BodyDefaultContent.oppfylt);
  });
});
