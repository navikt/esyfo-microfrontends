import {
  ISDIALOGMOTE_BACKEND_HOST,
  ISDIALOGMOTE_CLIENT_ID,
  SYFOMOTEBEHOV_BACKEND_HOST,
  SYFOMOTEBEHOV_CLIENT_ID,
} from "astro:env/server";
import { isLocal } from "@esyfo/shared/environment";
import { fetchFromBackend } from "@esyfo/shared/fetch";
import { brevSchema } from "@schema/brevSchema";
import type { BrevDto } from "@schema/brevSchema.ts";
import {
  type MotebehovStatusDto,
  motebehovStatusSchema,
} from "@schema/motebehovSchema.ts";
import { mockData } from "mock/data";

const dialogmoteApiUrl = new URL(
  "/api/v2/arbeidstaker/brev",
  ISDIALOGMOTE_BACKEND_HOST,
).toString();
const motebehovApiUrl = new URL(
  "/syfomotebehov/api/v4/arbeidstaker/motebehov",
  SYFOMOTEBEHOV_BACKEND_HOST,
).toString();

const realFetchBrev = async (token: string): Promise<BrevDto[]> => {
  return fetchFromBackend({
    token,
    clientId: ISDIALOGMOTE_CLIENT_ID,
    apiUrl: dialogmoteApiUrl,
    apiName: "dialogmote",
    schema: brevSchema.array(),
  });
};

const fakeFetchBrev = async (_token: string): Promise<BrevDto[]> => {
  return brevSchema.array().parse([mockData.innkallingsBrev]);
};

const realFetchMotebehov = async (
  token: string,
): Promise<MotebehovStatusDto> => {
  return fetchFromBackend({
    token,
    clientId: SYFOMOTEBEHOV_CLIENT_ID,
    apiUrl: motebehovApiUrl,
    apiName: "motebehov",
    schema: motebehovStatusSchema,
  });
};

const fakeFetchMotebehov = async (
  _token: string,
): Promise<MotebehovStatusDto> => {
  return motebehovStatusSchema.parse(mockData.motebehovVisible);
};

export const fetchBrev = isLocal ? fakeFetchBrev : realFetchBrev;
export const fetchMotebehov = isLocal ? fakeFetchMotebehov : realFetchMotebehov;
