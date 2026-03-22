import { describe, expect, it } from "vitest";

import { vurderingSchema } from "./vurderingSchema";

const isoDateTime = "2024-01-15T10:00:00.000Z";

describe("vurderingSchema", () => {
  it("parses all 8 valid statuses", () => {
    const validPayloads = [
      {
        status: "UNNTAK",
        arsaker: ["MEDISINSKE_GRUNNER"],
        sistVurdert: isoDateTime,
      },
      { status: "OPPFYLT", arsaker: ["FRISKMELDT"], sistVurdert: isoDateTime },
      { status: "NY" },
      { status: "NY_VURDERING" },
      { status: "AVVENT", sistVurdert: isoDateTime },
      {
        status: "FORHANDSVARSEL",
        sistVurdert: isoDateTime,
        fristDato: isoDateTime,
      },
      { status: "IKKE_OPPFYLT", sistVurdert: isoDateTime },
      { status: "IKKE_AKTUELL", sistVurdert: isoDateTime },
    ] as const;

    for (const payload of validPayloads) {
      const result = vurderingSchema.safeParse(payload);

      expect(result.success).toBe(true);
    }
  });

  it("fails for invalid status", () => {
    const result = vurderingSchema.safeParse({
      status: "INVALID",
    });

    expect(result.success).toBe(false);
  });

  it("fails when UNNTAK has an invalid arsak", () => {
    const result = vurderingSchema.safeParse({
      status: "UNNTAK",
      arsaker: ["INVALID"],
      sistVurdert: isoDateTime,
    });

    expect(result.success).toBe(false);
  });

  it("fails when OPPFYLT has an invalid arsak", () => {
    const result = vurderingSchema.safeParse({
      status: "OPPFYLT",
      arsaker: ["INVALID"],
      sistVurdert: isoDateTime,
    });

    expect(result.success).toBe(false);
  });

  it("parses FORHANDSVARSEL without journalpostId", () => {
    const result = vurderingSchema.safeParse({
      status: "FORHANDSVARSEL",
      sistVurdert: isoDateTime,
      fristDato: isoDateTime,
    });

    expect(result.success).toBe(true);
  });

  it("fails for FORHANDSVARSEL without fristDato", () => {
    const result = vurderingSchema.safeParse({
      status: "FORHANDSVARSEL",
      sistVurdert: isoDateTime,
    });

    expect(result.success).toBe(false);
  });

  it("parses NY with extra fields and strips them", () => {
    const result = vurderingSchema.safeParse({
      status: "NY",
      ekstraFelt: "skal strippes",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ status: "NY" });
  });

  it("fails for AVVENT without sistVurdert", () => {
    const result = vurderingSchema.safeParse({
      status: "AVVENT",
    });

    expect(result.success).toBe(false);
  });
});
