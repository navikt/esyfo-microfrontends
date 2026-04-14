import {
  ISDIALOGMOTE_BACKEND_HOST,
  ISDIALOGMOTE_CLIENT_ID,
} from "astro:env/server";
import { isLocal } from "@esyfo/shared/environment";
import { fetchFromBackend } from "@esyfo/shared/fetch";
import { brevSchema } from "@schema/brevSchema";
import type { BrevDto } from "@schema/brevSchema.ts";
import { mockData } from "mock/data";

const dialogmoteBrevPath = "/api/v2/arbeidstaker/brev";
const dialogmoteApiUrl = new URL(
  dialogmoteBrevPath,
  ISDIALOGMOTE_BACKEND_HOST,
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

export const fetchBrev = isLocal ? fakeFetchBrev : realFetchBrev;
