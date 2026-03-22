import type { MotebehovStatusDto } from "@schema/motebehovSchema.ts";

export const getShowMotebehovPanel = (
  motebehov: MotebehovStatusDto,
): boolean => {
  return (
    motebehov.visMotebehov === true &&
    motebehov.skjemaType === "SVAR_BEHOV" &&
    motebehov.motebehov === null
  );
};
