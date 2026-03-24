import {
  MEROPPFOLGING_API_URL,
  MEROPPFOLGING_CLIENT_ID,
} from "astro:env/server";
import { isLocal } from "@esyfo/shared/environment";
import { fetchFromBackend } from "@esyfo/shared/fetch";
import type { MeroppfolgingStatusDto } from "@schema/merOppfolgingStatusSchema";
import { meroppfolgingStatusSchema } from "@schema/merOppfolgingStatusSchema";
import mockData from "../../mock/data";

const realFetchStatus = async (
  token: string,
): Promise<MeroppfolgingStatusDto> => {
  return fetchFromBackend({
    token,
    clientId: MEROPPFOLGING_CLIENT_ID,
    apiUrl: MEROPPFOLGING_API_URL,
    apiName: "meroppfolging",
    schema: meroppfolgingStatusSchema,
  });
};

const fakeFetchStatus = async (
  _token: string,
): Promise<MeroppfolgingStatusDto> => {
  return meroppfolgingStatusSchema.parse(mockData.senNoResponse);
};

export const fetchStatus = isLocal ? fakeFetchStatus : realFetchStatus;
