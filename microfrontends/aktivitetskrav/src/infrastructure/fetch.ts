import {
  AKTIVITETSKRAV_API_URL,
  AKTIVITETSKRAV_CLIENT_ID,
} from "astro:env/server";
import { getAccessToken } from "@esyfo/shared/token";
import { logger } from "@navikt/pino-logger";
import { aktivitetskravVurderingSchema } from "@schema/vurderingSchema";
import type { AktivitetskravVurdering } from "@schema/vurderingSchema.ts";
import { z } from "zod";

const parseAktivitetskravVurdering = (
  data: unknown,
): AktivitetskravVurdering => {
  const parsedAktivitetskravVurdering =
    aktivitetskravVurderingSchema.safeParse(data);

  if (parsedAktivitetskravVurdering.success) {
    return parsedAktivitetskravVurdering.data;
  }

  logger.error(
    {
      api: "aktivitetskrav",
      validationErrors: z.flattenError(parsedAktivitetskravVurdering.error),
    },
    "Invalid aktivitetskrav vurdering response",
  );

  throw new Error("Invalid aktivitetskrav vurdering response");
};

export const fetchAktivitetskravVurdering = async (
  token: string,
): Promise<AktivitetskravVurdering> => {
  const accessToken = await getAccessToken(token, AKTIVITETSKRAV_CLIENT_ID);

  const response = await fetch(AKTIVITETSKRAV_API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

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

  const data = await response.json();
  return parseAktivitetskravVurdering(data);
};
