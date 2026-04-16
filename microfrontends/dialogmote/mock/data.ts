import { addDaysToDate } from "@esyfo/shared/dateUtils";
import type { BrevDocumentComponentDto, BrevDto } from "schema/brevSchema";
import type { MotebehovStatusDto } from "schema/motebehovSchema";

const createDocumentComponent = (
  props?: Partial<BrevDocumentComponentDto>,
): BrevDocumentComponentDto => {
  return {
    type: "PARAGRAPH",
    title: "TEST_HEADER",
    texts: ["Test_text_1", "Test_text_2"],
    key: "ARBEIDSRETTET_REHABILITERING",
    ...props,
  };
};

const createInnkallingsBrev = (props?: Partial<BrevDto>): BrevDto => {
  const defaultDate = addDaysToDate(new Date(), -7).toISOString();

  return {
    uuid: "brev_uuid",
    deltakerUuid: "deltaker_uuid",
    createdAt: props?.createdAt || defaultDate,
    brevType: "INNKALT",
    digitalt: true,
    fritekst: "Her kommer det en fritekst",
    sted: "sted-felt",
    tid: props?.createdAt || defaultDate,
    videoLink: "videolenke-felt",
    document: [createDocumentComponent(), createDocumentComponent()],
    virksomhetsnummer: "virksomhetsnummer-felt",
    lestDato: null,
    svar: null,
    ...props,
  };
};

const createEndringsBrev = (props?: Partial<BrevDto>): BrevDto => {
  return {
    ...createInnkallingsBrev({ brevType: "NYTT_TID_STED" }),
    ...props,
  };
};

const createAvlysningsBrev = (props?: Partial<BrevDto>): BrevDto => {
  return {
    ...createInnkallingsBrev({ brevType: "AVLYST" }),
    ...props,
  };
};

const createReferatBrev = (props?: Partial<BrevDto>): BrevDto => {
  const defaultDate = addDaysToDate(new Date(), -67).toISOString();
  const defaultDate2 = addDaysToDate(new Date(), -77).toISOString();

  return {
    ...createInnkallingsBrev(),
    brevType: "REFERAT",
    createdAt: props?.createdAt || defaultDate,
    tid: props?.createdAt || defaultDate2,
    ...props,
  };
};

const createReferatEndretBrev = (props?: Partial<BrevDto>): BrevDto => {
  const defaultDate = addDaysToDate(new Date(), -87).toISOString();
  const defaultDate2 = addDaysToDate(new Date(), -97).toISOString();

  return {
    ...createInnkallingsBrev(),
    brevType: "REFERAT_ENDRET",
    createdAt: props?.createdAt || defaultDate,
    tid: props?.createdAt || defaultDate2,
    ...props,
  };
};

const innkallingsBrev = createInnkallingsBrev({
  createdAt: addDaysToDate(new Date(), -3).toISOString(),
});

const motebehovVisible: MotebehovStatusDto = {
  visMotebehov: true,
  skjemaType: "SVAR_BEHOV",
  motebehov: null,
};

export const mockData = {
  innkallingsBrev,
  motebehovVisible,
};

export {
  createAvlysningsBrev,
  createEndringsBrev,
  createInnkallingsBrev,
  createReferatBrev,
  createReferatEndretBrev,
};
