import {
  AKTIVITETSKRAV_API_URL,
  AKTIVITETSKRAV_CLIENT_ID,
} from "astro:env/server";
import { isLocal } from "@esyfo/shared/environment";
import { getAccessToken } from "@esyfo/shared/token";
import { logger } from "@navikt/pino-logger";
import { vurderingSchema } from "@schema/vurderingSchema";
import type { AktivitetskravVurdering } from "@schema/vurderingSchema.ts";
import { z } from "zod";
import fixtures from "../../mock/fixtures";

const parseVurdering = (data: unknown): AktivitetskravVurdering => {
  const parsed = vurderingSchema.safeParse(data);

  if (parsed.success) {
    return parsed.data;
  }

  logger.error(
    {
      api: "aktivitetskrav",
      validationErrors: z.flattenError(parsed.error),
    },
    "Invalid aktivitetskrav vurdering response",
  );

  throw new Error("Invalid aktivitetskrav vurdering response");
};

const fetchFromApi = async (accessToken: string): Promise<Response> => {
  try {
    return await fetch(AKTIVITETSKRAV_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    logger.error(
      { api: "aktivitetskrav", error },
      "Network error fetching aktivitetskrav vurdering",
    );
    throw error;
  }
};

const assertOk = (response: Response): void => {
  if (!response.ok) {
    logger.error(
      {
        api: "aktivitetskrav",
        status: response.status,
        statusText: response.statusText,
      },
      "Failed to fetch aktivitetskrav vurdering",
    );
    throw new Error(`Http error with status: ${response.status}`);
  }
};

const realFetchVurdering = async (
  token: string,
): Promise<AktivitetskravVurdering> => {
  const accessToken = await getAccessToken(token, AKTIVITETSKRAV_CLIENT_ID);
  const response = await fetchFromApi(accessToken);
  assertOk(response);
  const data = await response.json();
  return parseVurdering(data);
};

const fakeFetchVurdering = async (
  _token: string,
): Promise<AktivitetskravVurdering> => {
  return parseVurdering(fixtures.forhaandsvarselVurdering);
};

export const fetchVurdering = isLocal ? fakeFetchVurdering : realFetchVurdering;
