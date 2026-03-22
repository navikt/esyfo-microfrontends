import type { MotebehovStatusDto } from "schema/motebehovSchema";

const motebehovUtenSvar: MotebehovStatusDto = {
  visMotebehov: true,
  skjemaType: "SVAR_BEHOV",
  motebehov: null,
};

const fixtures = {
  motebehovUtenSvar,
};

export default fixtures;
