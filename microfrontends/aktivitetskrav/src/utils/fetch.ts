import { AKTIVITETSKRAV_API_URL, AKTIVITETSKRAV_CLIENT_ID } from "astro:env/server";
import { getAccessToken } from "@src/utils/token.ts";
import type { AktivitetskravVurdering } from "@schema/aktivitetskravVurderingSchema.ts";

export const fetchAktivitetskravVurdering = async (token: string): Promise<AktivitetskravVurdering> => {
  const accessToken = await getAccessToken(token, AKTIVITETSKRAV_CLIENT_ID);

  const response = await fetch(AKTIVITETSKRAV_API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Http error with status: ${response.status}`);
  }

  return await response.json();
};
