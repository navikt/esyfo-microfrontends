import {
  SYFOMOTEBEHOV_BACKEND_HOST,
  SYFOMOTEBEHOV_CLIENT_ID,
} from "astro:env/server";
import { isLocal } from "@esyfo/shared/environment";
import { fetchFromBackend } from "@esyfo/shared/fetch";
import {
  type MotebehovStatusDto,
  motebehovStatusSchema,
} from "@schema/motebehovSchema.ts";
import { mockData } from "mock/data";

const motebehovApiUrl = new URL(
  "/syfomotebehov/api/v4/arbeidstaker/motebehov",
  SYFOMOTEBEHOV_BACKEND_HOST,
).toString();

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
  return motebehovStatusSchema.parse(mockData.motebehovUtenSvar);
};

export const fetchMotebehov = isLocal ? fakeFetchMotebehov : realFetchMotebehov;
