import {
  SYFOMOTEBEHOV_API_URL,
  SYFOMOTEBEHOV_CLIENT_ID,
} from "astro:env/server";
import { isLocal } from "@esyfo/shared/environment";
import { getAccessToken } from "@esyfo/shared/token";
import { logger } from "@navikt/pino-logger";
import {
  type MotebehovStatusDto,
  motebehovStatusSchema,
} from "@schema/motebehovSchema.ts";
import { z } from "zod";
import fixtures from "../../mock/fixtures";

const parseMotebehov = (data: unknown): MotebehovStatusDto => {
  const parsedMotebehov = motebehovStatusSchema.safeParse(data);

  if (parsedMotebehov.success) {
    return parsedMotebehov.data;
  }

  logger.error(
    {
      api: "motebehov",
      validationErrors: z.flattenError(parsedMotebehov.error),
    },
    "Invalid motebehov response",
  );

  throw new Error("Invalid motebehov response");
};

const fetchFromApi = async (accessToken: string): Promise<Response> => {
  try {
    return await fetch(SYFOMOTEBEHOV_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    logger.error(
      { api: "motebehov", error },
      "Network error fetching motebehov",
    );
    throw error;
  }
};

const assertOk = (response: Response): void => {
  if (!response.ok) {
    logger.error(
      {
        api: "motebehov",
        status: response.status,
        statusText: response.statusText,
      },
      "Failed to fetch motebehov",
    );
    throw new Error(`Http error with status: ${response.status}`);
  }
};

const realFetchMotebehov = async (
  token: string,
): Promise<MotebehovStatusDto> => {
  const accessToken = await getAccessToken(token, SYFOMOTEBEHOV_CLIENT_ID);
  const response = await fetchFromApi(accessToken);
  assertOk(response);
  const data = await response.json();
  return parseMotebehov(data);
};

const fakeFetchMotebehov = async (
  _token: string,
): Promise<MotebehovStatusDto> => {
  return parseMotebehov(fixtures.motebehovUtenSvar);
};

export const fetchMotebehov = isLocal ? fakeFetchMotebehov : realFetchMotebehov;
