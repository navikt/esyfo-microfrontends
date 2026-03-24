import { addDaysToDate } from "@esyfo/shared/dateUtils";
import type { MeroppfolgingStatusDto } from "schema/merOppfolgingStatusSchema";

const senNeedsHelp: MeroppfolgingStatusDto = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "TRENGER_OPPFOLGING",
    hasAccessToSenOppfolging: true,
    responseDateTime: new Date().toISOString(),
    maxDate: null,
  },
};

const senDoesntNeedHelp: MeroppfolgingStatusDto = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "TRENGER_IKKE_OPPFOLGING",
    hasAccessToSenOppfolging: true,
    responseDateTime: new Date().toISOString(),
    maxDate: null,
  },
};

const senNoResponse: MeroppfolgingStatusDto = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "NO_RESPONSE",
    hasAccessToSenOppfolging: true,
    responseDateTime: null,
    maxDate: "31. desember 2024",
  },
};

const senOutdated: MeroppfolgingStatusDto = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "TRENGER_IKKE_OPPFOLGING",
    hasAccessToSenOppfolging: true,
    responseDateTime: addDaysToDate(new Date(), -10).toISOString(),
    maxDate: null,
  },
};

const kartleggingResponded: MeroppfolgingStatusDto = {
  oppfolgingsType: "KARTLEGGING",
  kartleggingStatus: {
    responseStatus: "SUBMITTED",
    hasAccessToKartlegging: true,
    responseDateTime: new Date().toISOString(),
  },
};

const kartleggingNotResponded: MeroppfolgingStatusDto = {
  oppfolgingsType: "KARTLEGGING",
  kartleggingStatus: {
    responseStatus: "NO_RESPONSE",
    hasAccessToKartlegging: true,
    responseDateTime: null,
  },
};

const ingenOppfolging: MeroppfolgingStatusDto = {
  oppfolgingsType: "INGEN_OPPFOLGING",
  senOppfolgingStatus: null,
};

const mockData = {
  senNeedsHelp,
  senDoesntNeedHelp,
  senNoResponse,
  senOutdated,
  kartleggingResponded,
  kartleggingNotResponded,
  ingenOppfolging,
};

export default mockData;
