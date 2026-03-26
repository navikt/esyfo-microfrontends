import {
  AKTIVITETSKRAV_API_URL,
  AKTIVITETSKRAV_CLIENT_ID,
} from "astro:env/server";
import { isLocal } from "@esyfo/shared/environment";
import { fetchFromBackend } from "@esyfo/shared/fetch";
import { vurderingSchema } from "@schema/vurderingSchema";
import type { AktivitetskravVurdering } from "@schema/vurderingSchema.ts";
import { mockData } from "../../mock/data";

const realFetchVurdering = async (
  token: string,
): Promise<AktivitetskravVurdering> => {
  return fetchFromBackend({
    token,
    clientId: AKTIVITETSKRAV_CLIENT_ID,
    apiUrl: AKTIVITETSKRAV_API_URL,
    apiName: "aktivitetskrav",
    schema: vurderingSchema,
  });
};

const fakeFetchVurdering = async (
  _token: string,
): Promise<AktivitetskravVurdering> => {
  return vurderingSchema.parse(mockData.forhaandsvarselVurdering);
};

export const fetchVurdering = isLocal ? fakeFetchVurdering : realFetchVurdering;
