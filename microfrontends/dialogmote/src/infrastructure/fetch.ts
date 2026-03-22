import { ISDIALOGMOTE_API_URL, ISDIALOGMOTE_CLIENT_ID } from "astro:env/server";
import { isLocal } from "@esyfo/shared/environment";
import { getAccessToken } from "@esyfo/shared/token";
import { logger } from "@navikt/pino-logger";
import { brevSchema } from "@schema/brevSchema";
import type { BrevDto } from "@schema/brevSchema.ts";
import { z } from "zod";
import fixtures from "../../mock/fixtures";

const parseBrev = (data: unknown): BrevDto[] => {
  const parsedBrev = brevSchema.array().safeParse(data);

  if (parsedBrev.success) {
    return parsedBrev.data;
  }

  logger.error(
    {
      api: "dialogmote",
      validationErrors: z.flattenError(parsedBrev.error),
    },
    "Invalid dialogmote brev response",
  );

  throw new Error("Invalid dialogmote brev response");
};

const fetchFromApi = async (accessToken: string): Promise<Response> => {
  try {
    return await fetch(ISDIALOGMOTE_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    logger.error(
      { api: "dialogmote", error },
      "Network error fetching dialogmote brev",
    );
    throw error;
  }
};

const assertOk = (response: Response): void => {
  if (!response.ok) {
    logger.error(
      {
        api: "dialogmote",
        status: response.status,
        statusText: response.statusText,
      },
      "Failed to fetch dialogmote brev",
    );
    throw new Error(`Http error with status: ${response.status}`);
  }
};

const realFetchBrev = async (token: string): Promise<BrevDto[]> => {
  const accessToken = await getAccessToken(token, ISDIALOGMOTE_CLIENT_ID);
  const response = await fetchFromApi(accessToken);
  assertOk(response);
  const data = await response.json();
  return parseBrev(data);
};

const fakeFetchBrev = async (_token: string): Promise<BrevDto[]> => {
  return parseBrev([fixtures.innkallingsBrev]);
};

export const fetchBrev = isLocal ? fakeFetchBrev : realFetchBrev;
