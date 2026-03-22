import {
  SYFOMOTEBEHOV_API_URL,
  SYFOMOTEBEHOV_CLIENT_ID,
} from "astro:env/server";
import { getAccessToken } from "@esyfo/shared/token";
import { logger } from "@navikt/pino-logger";
import {
  type MotebehovStatusDto,
  motebehovStatusSchema,
} from "@schema/motebehovSchema.ts";
import { z } from "zod";

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

export const fetchMotebehov = async (
  userToken: string,
): Promise<MotebehovStatusDto> => {
  const accessToken = await getAccessToken(userToken, SYFOMOTEBEHOV_CLIENT_ID);

  const response = await fetch(SYFOMOTEBEHOV_API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

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

  const data = await response.json();
  return parseMotebehov(data);
};
