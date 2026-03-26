import type { MotebehovStatusDto } from "schema/motebehovSchema";

const motebehovUtenSvar: MotebehovStatusDto = {
  visMotebehov: true,
  skjemaType: "SVAR_BEHOV",
  motebehov: null,
};

export const mockData = {
  motebehovUtenSvar,
};
