import type { MotebehovStatusDto } from "@schema/motebehovSchema";
import { describe, expect, it } from "vitest";

import { shouldShowMotebehovPanel } from "./motebehov";

const createMotebehovStatus = (
  overrides?: Partial<MotebehovStatusDto>,
): MotebehovStatusDto => ({
  visMotebehov: true,
  skjemaType: "SVAR_BEHOV",
  motebehov: null,
  ...overrides,
});

describe("shouldShowMotebehovPanel", () => {
  it("returns true when all visibility conditions are met", () => {
    expect(shouldShowMotebehovPanel(createMotebehovStatus())).toBe(true);
  });

  it("returns false when visMotebehov is false", () => {
    expect(
      shouldShowMotebehovPanel(
        createMotebehovStatus({
          visMotebehov: false,
        }),
      ),
    ).toBe(false);
  });

  it("returns false when skjemaType is MELD_BEHOV", () => {
    expect(
      shouldShowMotebehovPanel(
        createMotebehovStatus({
          skjemaType: "MELD_BEHOV",
        }),
      ),
    ).toBe(false);
  });

  it("returns false when motebehov already exists", () => {
    expect(
      shouldShowMotebehovPanel(
        createMotebehovStatus({
          motebehov: {
            id: "123",
          },
        }),
      ),
    ).toBe(false);
  });

  it("returns false when multiple visibility conditions are not met", () => {
    expect(
      shouldShowMotebehovPanel(
        createMotebehovStatus({
          visMotebehov: false,
          skjemaType: "MELD_BEHOV",
          motebehov: {
            id: "123",
          },
        }),
      ),
    ).toBe(false);
  });
});
