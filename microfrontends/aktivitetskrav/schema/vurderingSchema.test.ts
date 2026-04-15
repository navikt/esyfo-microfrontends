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
      sistVurdert: "2026-04-15T13:33:40",
      fristDato: "2026-04-29",
    });
  });

  it("rejects date-only sistVurdert", () => {
    expect(() =>
      vurderingSchema.parse({
        status: "IKKE_AKTUELL",
        sistVurdert: "2026-04-15",
      }),
    ).toThrow("Invalid ISO datetime");
  });
});
