import {
  AKTIVITETSKRAV_BACKEND_HOST,
  AKTIVITETSKRAV_CLIENT_ID,
} from "astro:env/server";
import { BACKEND_FETCH_CATALOG } from "@esyfo/shared/backendFetchCatalog";
import { isLocal } from "@esyfo/shared/environment";
import { fetchFromBackend } from "@esyfo/shared/fetch";
import { vurderingSchema } from "@schema/vurderingSchema";
import type { AktivitetskravVurdering } from "@schema/vurderingSchema.ts";
import { mockData } from "mock/data";

const aktivitetskravApiUrl = new URL(
  "/api/v1/aktivitetsplikt",
  AKTIVITETSKRAV_BACKEND_HOST,
).toString();

const realFetchVurdering = async (
  token: string,
): Promise<AktivitetskravVurdering> => {
  return fetchFromBackend({
    token,
    clientId: AKTIVITETSKRAV_CLIENT_ID,
    apiUrl: aktivitetskravApiUrl,
    schema: vurderingSchema,
    backend: BACKEND_FETCH_CATALOG.aktivitetskravVurdering,
  });
};

const fakeFetchVurdering = async (
  _token: string,
): Promise<AktivitetskravVurdering> => {
  return vurderingSchema.parse(mockData.forhaandsvarselVurdering);
};

export const fetchVurdering = isLocal ? fakeFetchVurdering : realFetchVurdering;
