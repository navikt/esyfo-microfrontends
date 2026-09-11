import { describe, expect, it } from "vitest";
import { vurderingSchema } from "./vurderingSchema";

describe("vurderingSchema", () => {
  const statusesWithDate = [
    "UNNTAK",
    "OPPFYLT",
    "AVVENT",
    "FORHANDSVARSEL",
    "IKKE_OPPFYLT",
    "IKKE_AKTUELL",
    "AUTOMATISK_OPPFYLT",
    "INNSTILLING_OM_STANS",
    "LUKKET",
  ];

  it.each(statusesWithDate)(
    "accepts nullable or omitted sistVurdert for %s",
    (status) => {
      const response = { status, arsaker: [], fristDato: "2026-04-29" };
      expect(
        vurderingSchema.safeParse({ ...response, sistVurdert: null }).success,
      ).toBe(true);
      expect(vurderingSchema.safeParse(response).success).toBe(true);
    },
  );

  it.each(statusesWithDate)(
    "still rejects an invalid sistVurdert for %s",
    (status) => {
      for (const sistVurdert of ["not-a-date", 42]) {
        expect(
          vurderingSchema.safeParse({
            status,
            arsaker: [],
            fristDato: "2026-04-29",
            sistVurdert,
          }).success,
        ).toBe(false);
      }
    },
  );

  it("accepts a nullable journalpostId without relaxing the deadline", () => {
    const response = {
      status: "FORHANDSVARSEL",
      sistVurdert: null,
      journalpostId: null,
      fristDato: "2026-04-29",
    };
    expect(vurderingSchema.safeParse(response).success).toBe(true);
    expect(
      vurderingSchema.safeParse({ ...response, fristDato: null }).success,
    ).toBe(false);
  });

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

  it("accepts datetime without timezone suffix (Kotlin LocalDateTime)", () => {
    const result = vurderingSchema.parse({
      status: "IKKE_AKTUELL",
      sistVurdert: "2026-04-15T00:00:00",
    });

    expect(result).toMatchObject({
      status: "IKKE_AKTUELL",
      sistVurdert: "2026-04-15T00:00:00",
    });
  });
});
