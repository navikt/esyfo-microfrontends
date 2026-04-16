import { addDaysToDate, toLocalDateTime } from "@esyfo/shared/dateUtils";
import type * as meroppfolgingStatusSchema from "@schema/meroppfolgingStatusSchema";

const senOppfolging = {
  needsHelp: {
    oppfolgingsType: "SEN_OPPFOLGING",
    senOppfolgingStatus: {
      responseStatus: "TRENGER_OPPFOLGING",
      hasAccessToSenOppfolging: true,
      responseDateTime: toLocalDateTime(new Date()),
      maxDate: null,
    },
  },
  doesntNeedHelp: {
    oppfolgingsType: "SEN_OPPFOLGING",
    senOppfolgingStatus: {
      responseStatus: "TRENGER_IKKE_OPPFOLGING",
      hasAccessToSenOppfolging: true,
      responseDateTime: toLocalDateTime(new Date()),
      maxDate: null,
    },
  },
  noResponse: {
    oppfolgingsType: "SEN_OPPFOLGING",
    senOppfolgingStatus: {
      responseStatus: "NO_RESPONSE",
      hasAccessToSenOppfolging: true,
      responseDateTime: null,
      maxDate: "2024-12-31",
    },
  },
  outdated: {
    oppfolgingsType: "SEN_OPPFOLGING",
    senOppfolgingStatus: {
      responseStatus: "TRENGER_IKKE_OPPFOLGING",
      hasAccessToSenOppfolging: true,
      responseDateTime: toLocalDateTime(addDaysToDate(new Date(), -10)),
      maxDate: null,
    },
  },
} satisfies Record<string, meroppfolgingStatusSchema.MeroppfolgingStatusDto>;

const kartlegging = {
  responded: {
    oppfolgingsType: "KARTLEGGING",
    kartleggingStatus: {
      responseStatus: "SUBMITTED",
      hasAccessToKartlegging: true,
      responseDateTime: toLocalDateTime(new Date()),
    },
  },
  notResponded: {
    oppfolgingsType: "KARTLEGGING",
    kartleggingStatus: {
      responseStatus: "NO_RESPONSE",
      hasAccessToKartlegging: true,
      responseDateTime: null,
    },
  },
} satisfies Record<string, meroppfolgingStatusSchema.MeroppfolgingStatusDto>;

const ingenOppfolging = {
  default: {
    oppfolgingsType: "INGEN_OPPFOLGING",
    senOppfolgingStatus: null,
  },
} satisfies Record<string, meroppfolgingStatusSchema.MeroppfolgingStatusDto>;

export const mockData = {
  senOppfolging,
  kartlegging,
  ingenOppfolging,
};
