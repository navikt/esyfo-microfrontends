import {
  SYFOMOTEBEHOV_API_URL,
  SYFOMOTEBEHOV_CLIENT_ID,
} from "astro:env/server";
import { isLocal } from "@esyfo/shared/environment";
import { fetchFromBackend } from "@esyfo/shared/fetch";
import {
  type MotebehovStatusDto,
  motebehovStatusSchema,
} from "@schema/motebehovSchema.ts";
import { mockData } from "mock/data";

const realFetchMotebehov = async (
  token: string,
): Promise<MotebehovStatusDto> => {
  return fetchFromBackend({
    token,
    clientId: SYFOMOTEBEHOV_CLIENT_ID,
    apiUrl: SYFOMOTEBEHOV_API_URL,
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
