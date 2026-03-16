import { requestOboToken } from "@navikt/oasis";
import { isLocal } from "./environment";
import { logger } from "@src/utils/logger.ts";

export const getAccessToken = async (token: string, clientId: string): Promise<string> => {
  if (isLocal) {
    return "Fake token";
  }

  const oboResult = await requestOboToken(token, clientId);

  if (!oboResult.ok) {
    logger.error("Error getting access token: " + oboResult.error);
    throw new Error("Request oboToken for aktivitetskrav failed");
  }

  return oboResult.token;
};
