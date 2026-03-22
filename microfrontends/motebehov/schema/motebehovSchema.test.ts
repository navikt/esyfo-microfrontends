import { describe, expect, it } from "vitest";

import { motebehovStatusSchema } from "./motebehovSchema";

describe("motebehovStatusSchema", () => {
  it("parses valid payload with motebehov set to null", () => {
    const result = motebehovStatusSchema.safeParse({
      visMotebehov: true,
      skjemaType: "MELD_BEHOV",
      motebehov: null,
    });

    expect(result.success).toBe(true);
  });

  it("parses valid payload with motebehov object", () => {
    const result = motebehovStatusSchema.safeParse({
      visMotebehov: false,
      skjemaType: "SVAR_BEHOV",
      motebehov: {
        id: "motebehov-id",
      },
    });

    expect(result.success).toBe(true);
  });

  it("fails for invalid skjemaType", () => {
    const result = motebehovStatusSchema.safeParse({
      visMotebehov: true,
      skjemaType: "INVALID",
      motebehov: null,
    });

    expect(result.success).toBe(false);
  });

  it("fails when visMotebehov is a string", () => {
    const result = motebehovStatusSchema.safeParse({
      visMotebehov: "true",
      skjemaType: "MELD_BEHOV",
      motebehov: null,
    });

    expect(result.success).toBe(false);
  });

  it("fails when required fields are missing", () => {
    const result = motebehovStatusSchema.safeParse({});

    expect(result.success).toBe(false);
  });
});
