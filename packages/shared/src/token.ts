import { requestOboToken } from "@navikt/oasis";
import { logger } from "@navikt/pino-logger";
import { isLocal } from "./environment.ts";

export const getAccessToken = async (
  token: string,
  clientId: string,
): Promise<string> => {
  if (isLocal) {
    return "Fake token";
  }

  let oboResult: Awaited<ReturnType<typeof requestOboToken>>;
  try {
    oboResult = await requestOboToken(token, clientId);
  } catch (error) {
    logger.error({ error }, "Token exchange request failed");
    throw error;
  }

  if (!oboResult.ok) {
    logger.error({ error: oboResult.error }, "Token exchange returned error");
    throw new Error("Failed to get OBO token");
  }

  return oboResult.token;
};
