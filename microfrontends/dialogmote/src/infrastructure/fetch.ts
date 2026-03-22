import { ISDIALOGMOTE_API_URL, ISDIALOGMOTE_CLIENT_ID } from "astro:env/server";
import { isLocal } from "@esyfo/shared/environment";
import { fetchFromBackend } from "@esyfo/shared/fetch";
import { brevSchema } from "@schema/brevSchema";
import type { BrevDto } from "@schema/brevSchema.ts";
import fixtures from "../../mock/fixtures";

const realFetchBrev = async (token: string): Promise<BrevDto[]> => {
  return fetchFromBackend({
    token,
    clientId: ISDIALOGMOTE_CLIENT_ID,
    apiUrl: ISDIALOGMOTE_API_URL,
    apiName: "dialogmote",
    schema: brevSchema.array(),
  });
};

const fakeFetchBrev = async (_token: string): Promise<BrevDto[]> => {
  return brevSchema.array().parse([fixtures.innkallingsBrev]);
};

export const fetchBrev = isLocal ? fakeFetchBrev : realFetchBrev;
