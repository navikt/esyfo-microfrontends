import type {
  KartleggingStatusDto,
  MeroppfolgingStatusDto,
  SenoppfolgingStatusDto,
} from "@schema/meroppfolgingStatusSchema";

type SenOppfolgingOverrides = Partial<SenoppfolgingStatusDto>;
type KartleggingOverrides = Partial<KartleggingStatusDto>;

type SenOppfolgingDto = Extract<
  MeroppfolgingStatusDto,
  { oppfolgingsType: "SEN_OPPFOLGING" }
>;
type KartleggingDto = Extract<
  MeroppfolgingStatusDto,
  { oppfolgingsType: "KARTLEGGING" }
>;
type IngenOppfolgingDto = Extract<
  MeroppfolgingStatusDto,
  { oppfolgingsType: "INGEN_OPPFOLGING" }
>;

export const createSenOppfolgingNoResponse = (
  overrides?: SenOppfolgingOverrides,
): SenOppfolgingDto => ({
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "NO_RESPONSE",
    responseDateTime: null,
    hasAccessToSenOppfolging: true,
    maxDate: new Date("2024-12-31"),
    ...overrides,
  },
});

export const createSenOppfolgingTrengerOppfolging = (
  overrides?: SenOppfolgingOverrides,
): SenOppfolgingDto => ({
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "TRENGER_OPPFOLGING",
    responseDateTime: new Date("2024-06-14T10:00:00.000Z"),
    hasAccessToSenOppfolging: true,
    maxDate: null,
    ...overrides,
  },
});

export const createSenOppfolgingTrengerIkkeOppfolging = (
  overrides?: SenOppfolgingOverrides,
): SenOppfolgingDto => ({
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "TRENGER_IKKE_OPPFOLGING",
    responseDateTime: new Date("2024-06-14T10:00:00.000Z"),
    hasAccessToSenOppfolging: true,
    maxDate: null,
    ...overrides,
  },
});

export const createKartleggingNoResponse = (
  overrides?: KartleggingOverrides,
): KartleggingDto => ({
  oppfolgingsType: "KARTLEGGING",
  kartleggingStatus: {
    responseStatus: "NO_RESPONSE",
    responseDateTime: null,
    hasAccessToKartlegging: true,
    ...overrides,
  },
});

export const createKartleggingSubmitted = (
  overrides?: KartleggingOverrides,
): KartleggingDto => ({
  oppfolgingsType: "KARTLEGGING",
  kartleggingStatus: {
    responseStatus: "SUBMITTED",
    responseDateTime: new Date("2024-06-14T10:00:00.000Z"),
    hasAccessToKartlegging: true,
    ...overrides,
  },
});

export const createIngenOppfolging = (): IngenOppfolgingDto => ({
  oppfolgingsType: "INGEN_OPPFOLGING",
  senOppfolgingStatus: null,
});
