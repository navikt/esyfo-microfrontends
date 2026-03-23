import type { MotebehovStatusDto } from "@schema/motebehovSchema.ts";

export const shouldShowMotebehovPanel = (
  motebehov: MotebehovStatusDto,
): boolean =>
  motebehov.visMotebehov === true &&
  motebehov.skjemaType === "SVAR_BEHOV" &&
  motebehov.motebehov === null;
