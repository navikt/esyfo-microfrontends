import type { MotebehovStatusDto } from "schema/motebehovSchema";

const motebehovVisible: MotebehovStatusDto = {
  visMotebehov: true,
  skjemaType: "SVAR_BEHOV",
  motebehov: null,
};

export const mockData = {
  motebehovVisible,
};
