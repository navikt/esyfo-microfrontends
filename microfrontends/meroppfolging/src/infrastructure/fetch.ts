import {
  MEROPPFOLGING_API_URL,
  MEROPPFOLGING_CLIENT_ID,
} from "astro:env/server";
import { isLocal } from "@esyfo/shared/environment";
import { fetchFromBackend } from "@esyfo/shared/fetch";
import type { MerOppfolgingStatusDTO } from "@schema/merOppfolgingStatusSchema";
import { merOppfolgingStatusSchema } from "@schema/merOppfolgingStatusSchema";
import mockData from "../../mock/data";

const realFetchStatus = async (
  token: string,
): Promise<MerOppfolgingStatusDTO> => {
  return fetchFromBackend({
    token,
    clientId: MEROPPFOLGING_CLIENT_ID,
    apiUrl: MEROPPFOLGING_API_URL,
    apiName: "meroppfolging",
    schema: merOppfolgingStatusSchema,
  });
};

const fakeFetchStatus = async (
  _token: string,
): Promise<MerOppfolgingStatusDTO> => {
  return merOppfolgingStatusSchema.parse(mockData.senNoResponse);
};

export const fetchStatus = isLocal ? fakeFetchStatus : realFetchStatus;
