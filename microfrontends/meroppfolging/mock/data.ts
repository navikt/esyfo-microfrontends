import { addDaysToDate } from "@esyfo/shared/dateUtils";
import type * as meroppfolgingStatusSchema from "@schema/meroppfolgingStatusSchema";

const senNeedsHelp: meroppfolgingStatusSchema.MeroppfolgingStatusDto = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "TRENGER_OPPFOLGING",
    hasAccessToSenOppfolging: true,
    responseDateTime: new Date().toISOString(),
    maxDate: null,
  },
};

const senDoesntNeedHelp: meroppfolgingStatusSchema.MeroppfolgingStatusDto = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "TRENGER_IKKE_OPPFOLGING",
    hasAccessToSenOppfolging: true,
    responseDateTime: new Date().toISOString(),
    maxDate: null,
  },
};

const senNoResponse: meroppfolgingStatusSchema.MeroppfolgingStatusDto = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "NO_RESPONSE",
    hasAccessToSenOppfolging: true,
    responseDateTime: null,
    maxDate: "31. desember 2024",
  },
};

const senOutdated: meroppfolgingStatusSchema.MeroppfolgingStatusDto = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "TRENGER_IKKE_OPPFOLGING",
    hasAccessToSenOppfolging: true,
    responseDateTime: addDaysToDate(new Date(), -10).toISOString(),
    maxDate: null,
  },
};

const kartleggingResponded: meroppfolgingStatusSchema.MeroppfolgingStatusDto = {
  oppfolgingsType: "KARTLEGGING",
  kartleggingStatus: {
    responseStatus: "SUBMITTED",
    hasAccessToKartlegging: true,
    responseDateTime: new Date().toISOString(),
  },
};

const kartleggingNotResponded: meroppfolgingStatusSchema.MeroppfolgingStatusDto =
  {
    oppfolgingsType: "KARTLEGGING",
    kartleggingStatus: {
      responseStatus: "NO_RESPONSE",
      hasAccessToKartlegging: true,
      responseDateTime: null,
    },
  };

const ingenOppfolging: meroppfolgingStatusSchema.MeroppfolgingStatusDto = {
  oppfolgingsType: "INGEN_OPPFOLGING",
  senOppfolgingStatus: null,
};

export const mockData = {
  senNeedsHelp,
  senDoesntNeedHelp,
  senNoResponse,
  senOutdated,
  kartleggingResponded,
  kartleggingNotResponded,
  ingenOppfolging,
};
