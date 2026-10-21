import {
  ISDIALOGMOTE_BACKEND_HOST,
  ISDIALOGMOTE_CLIENT_ID,
} from "astro:env/server";
import { BACKEND_FETCH_CATALOG } from "@esyfo/shared/backendFetchCatalog";
import { isLocal } from "@esyfo/shared/environment";
import { fetchFromBackend } from "@esyfo/shared/fetch";
import { brevSchema } from "@schema/brevSchema";
import type { BrevDto } from "@schema/brevSchema.ts";
import { mockData } from "mock/data";

const dialogmoteApiUrl = new URL(
  "/api/v2/arbeidstaker/brev",
  ISDIALOGMOTE_BACKEND_HOST,
).toString();

const realFetchBrev = async (token: string): Promise<BrevDto[]> => {
  return fetchFromBackend({
    token,
    clientId: ISDIALOGMOTE_CLIENT_ID,
    apiUrl: dialogmoteApiUrl,
    schema: brevSchema.array(),
    backend: BACKEND_FETCH_CATALOG.dialogmoteBrev,
  });
};

const fakeFetchBrev = async (_token: string): Promise<BrevDto[]> => {
  return brevSchema.array().parse([mockData.innkallingsBrev]);
};

export const fetchBrev = isLocal ? fakeFetchBrev : realFetchBrev;
