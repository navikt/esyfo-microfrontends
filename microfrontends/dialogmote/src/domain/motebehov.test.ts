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
  it("shows møtebehov when all conditions are met", () => {
    expect(shouldShowMotebehovPanel(createMotebehovStatus())).toBe(true);
  });

  it("hides møtebehov when visibility flag is off", () => {
    expect(
      shouldShowMotebehovPanel(
        createMotebehovStatus({
          visMotebehov: false,
        }),
      ),
    ).toBe(false);
  });

  it("hides møtebehov when skjemaType is meld behov", () => {
    expect(
      shouldShowMotebehovPanel(
        createMotebehovStatus({
          skjemaType: "MELD_BEHOV",
        }),
      ),
    ).toBe(false);
  });

  it("hides møtebehov when user has already responded", () => {
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

  it("hides møtebehov when multiple conditions are not met", () => {
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
