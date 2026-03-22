import { ISDIALOGMOTE_API_URL, ISDIALOGMOTE_CLIENT_ID } from "astro:env/server";
import { getAccessToken } from "@esyfo/shared/token";
import { logger } from "@navikt/pino-logger";
import { brevSchema } from "@schema/brevSchema";
import type { BrevDTO } from "@schema/brevSchema.ts";
import { z } from "zod";

const parseBrev = (data: unknown): BrevDTO[] => {
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

export const fetchBrev = async (userToken: string): Promise<BrevDTO[]> => {
  const accessToken = await getAccessToken(userToken, ISDIALOGMOTE_CLIENT_ID);

  const response = await fetch(ISDIALOGMOTE_API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

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

  const data = await response.json();
  return parseBrev(data);
};
