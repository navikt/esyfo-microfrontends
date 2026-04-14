import {
  MEROPPFOLGING_BACKEND_HOST,
  MEROPPFOLGING_CLIENT_ID,
} from "astro:env/server";
import { isLocal } from "@esyfo/shared/environment";
import { fetchFromBackend } from "@esyfo/shared/fetch";
import {
  type MeroppfolgingStatusDto,
  meroppfolgingStatusSchema,
} from "@schema/meroppfolgingStatusSchema";
import { mockData } from "mock/data";

const meroppfolgingApiUrl = new URL(
  "/api/mikrofrontend/v1/status",
  MEROPPFOLGING_BACKEND_HOST,
).toString();

const realFetchStatus = async (
  token: string,
): Promise<MeroppfolgingStatusDto> => {
  return fetchFromBackend({
    token,
    clientId: MEROPPFOLGING_CLIENT_ID,
    apiUrl: meroppfolgingApiUrl,
    apiName: "meroppfolging",
    schema: meroppfolgingStatusSchema,
  });
};

const fakeFetchStatus = async (
  _token: string,
): Promise<MeroppfolgingStatusDto> => {
  return meroppfolgingStatusSchema.parse(mockData.senOppfolging.noResponse);
};

export const fetchStatus = isLocal ? fakeFetchStatus : realFetchStatus;
