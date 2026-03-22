import type { MotebehovStatusDto } from "@schema/motebehovSchema";
import { describe, expect, it } from "vitest";

import { getShowMotebehovPanel } from "./motebehov";

const createMotebehovStatus = (
  overrides?: Partial<MotebehovStatusDto>,
): MotebehovStatusDto => ({
  visMotebehov: true,
  skjemaType: "SVAR_BEHOV",
  motebehov: null,
  ...overrides,
});

describe("getShowMotebehovPanel", () => {
  it("returns true when all visibility conditions are met", () => {
    expect(getShowMotebehovPanel(createMotebehovStatus())).toBe(true);
  });

  it("returns false when visMotebehov is false", () => {
    expect(
      getShowMotebehovPanel(
        createMotebehovStatus({
          visMotebehov: false,
        }),
      ),
    ).toBe(false);
  });

  it("returns false when skjemaType is MELD_BEHOV", () => {
    expect(
      getShowMotebehovPanel(
        createMotebehovStatus({
          skjemaType: "MELD_BEHOV",
        }),
      ),
    ).toBe(false);
  });

  it("returns false when motebehov already exists", () => {
    expect(
      getShowMotebehovPanel(
        createMotebehovStatus({
          motebehov: {
            id: "123",
          },
        }),
      ),
    ).toBe(false);
  });

  it("returns false when all three blocking conditions are false", () => {
    expect(
      getShowMotebehovPanel(
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
