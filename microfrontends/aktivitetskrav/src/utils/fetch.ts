import { AKTIVITETSKRAV_API_URL, AKTIVITETSKRAV_CLIENT_ID } from "astro:env/server";
import { getAccessToken } from "dialogmote-microfrontend/src/utils/token.ts";
import type { AktivitetskravVurdering } from "@schema/aktivitetskravVurderingSchame.ts";

export const fetchAktivitetskravVurdering = async (userToken: string): Promise<AktivitetskravVurdering> => {
  const accessToken = await getAccessToken(userToken, AKTIVITETSKRAV_CLIENT_ID);

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