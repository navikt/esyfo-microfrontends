import type { MotebehovDTO } from "@schema/motebehovSchema";

export const motebehovMedSvar: MotebehovDTO = {
  visMotebehov: true,
  skjemaType: "SVAR_BEHOV",
  motebehov: {
    id: "12345",
    opprettetDato: "2023-05-10T10:54:09.204Z",
    aktorId: "1234",
    opprettetAv: "Navn",
    arbeidstakerFnr: "999888777",
    virksomhetsnummer: "907670201",
    motebehovSvar: {
      harMotebehov: true,
      forklaring: "Ønsker møte",
    },
    tildeltEnhet: null,
    behandletTidspunkt: null,
    behandletVeilederIdent: null,
    skjemaType: "SVAR_BEHOV",
  },
};
