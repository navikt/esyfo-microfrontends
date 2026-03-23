import type { MotebehovStatusDto } from "schema/motebehovSchema";

const motebehovUtenSvar: MotebehovStatusDto = {
  visMotebehov: true,
  skjemaType: "SVAR_BEHOV",
  motebehov: null,
};

const mockData = {
  motebehovUtenSvar,
};

export default mockData;
