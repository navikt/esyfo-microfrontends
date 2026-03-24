import { addDaysToDate } from "@esyfo/shared/dateUtils";
import type { MerOppfolgingStatusDTO } from "schema/merOppfolgingStatusSchema";

const senNeedsHelp: MerOppfolgingStatusDTO = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "TRENGER_OPPFOLGING",
    hasAccessToSenOppfolging: true,
    responseDateTime: new Date().toISOString(),
    maxDate: null,
  },
};

const senDoesntNeedHelp: MerOppfolgingStatusDTO = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "TRENGER_IKKE_OPPFOLGING",
    hasAccessToSenOppfolging: true,
    responseDateTime: new Date().toISOString(),
    maxDate: null,
  },
};

const senNoResponse: MerOppfolgingStatusDTO = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "NO_RESPONSE",
    hasAccessToSenOppfolging: true,
    responseDateTime: null,
    maxDate: "31. desember 2024",
  },
};

const senOutdated: MerOppfolgingStatusDTO = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "TRENGER_IKKE_OPPFOLGING",
    hasAccessToSenOppfolging: true,
    responseDateTime: addDaysToDate(new Date(), -10).toISOString(),
    maxDate: null,
  },
};

const kartleggingResponded: MerOppfolgingStatusDTO = {
  oppfolgingsType: "KARTLEGGING",
  kartleggingStatus: {
    responseStatus: "SUBMITTED",
    hasAccessToKartlegging: true,
    responseDateTime: new Date().toISOString(),
  },
};

const kartleggingNotResponded: MerOppfolgingStatusDTO = {
  oppfolgingsType: "KARTLEGGING",
  kartleggingStatus: {
    responseStatus: "NO_RESPONSE",
    hasAccessToKartlegging: true,
    responseDateTime: null,
  },
};

const ingenOppfolging: MerOppfolgingStatusDTO = {
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
