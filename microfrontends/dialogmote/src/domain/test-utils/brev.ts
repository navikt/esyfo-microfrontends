import type { BrevDto } from "@schema/brevSchema";

export const createBrev = (overrides?: Partial<BrevDto>): BrevDto => ({
  uuid: "test-uuid",
  deltakerUuid: "deltaker-uuid",
  createdAt: "2024-01-15T10:00:00.000Z",
  brevType: "INNKALT",
  digitalt: true,
  lestDato: null,
  fritekst: "Fritekst",
  sted: "NAV Oslo",
  tid: "2024-02-01T10:00:00.000Z",
  videoLink: null,
  document: [],
  virksomhetsnummer: "123456789",
  svar: null,
  ...overrides,
});
