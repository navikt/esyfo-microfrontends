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

  const oboResult = await requestOboToken(token, clientId);

  if (!oboResult.ok) {
    logger.error(`Error getting access token: ${oboResult.error}`);
    throw new Error("Failed to get OBO token");
  }

  return oboResult.token;
};
