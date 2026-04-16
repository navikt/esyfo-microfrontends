import { describe, expect, it } from "vitest";
import { vurderingSchema } from "./vurderingSchema";

describe("vurderingSchema", () => {
  it("accepts backend local datetime and date-only fields", () => {
    const result = vurderingSchema.parse({
      status: "FORHANDSVARSEL",
      sistVurdert: "2026-04-15T13:33:40",
      fristDato: "2026-04-29",
      journalpostId: "123",
    });

    expect(result).toMatchObject({
      status: "FORHANDSVARSEL",
      sistVurdert: new Date("2026-04-15T13:33:40"),
      fristDato: new Date("2026-04-29"),
    });
  });

  it("accepts date-only sistVurdert", () => {
    const result = vurderingSchema.parse({
      status: "IKKE_AKTUELL",
      sistVurdert: "2026-04-15",
    });

    expect(result).toMatchObject({
      status: "IKKE_AKTUELL",
      sistVurdert: new Date("2026-04-15"),
    });
  });
});
