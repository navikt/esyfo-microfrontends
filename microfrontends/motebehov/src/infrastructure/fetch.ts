import {
  SYFOMOTEBEHOV_BACKEND_HOST,
  SYFOMOTEBEHOV_CLIENT_ID,
} from "astro:env/server";
import { BACKEND_FETCH_CATALOG } from "@esyfo/shared/backendFetchCatalog";
import { isLocal } from "@esyfo/shared/environment";
import { fetchFromBackend } from "@esyfo/shared/fetch";
import {
  type MotebehovStatusDto,
  motebehovStatusSchema,
} from "@schema/motebehovSchema";
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
    schema: motebehovStatusSchema,
    backend: BACKEND_FETCH_CATALOG.motebehovStatus,
  });
};

const fakeFetchMotebehov = async (
  _token: string,
): Promise<MotebehovStatusDto> => {
  return motebehovStatusSchema.parse(mockData.motebehovVisible);
};

export const fetchMotebehov = isLocal ? fakeFetchMotebehov : realFetchMotebehov;
