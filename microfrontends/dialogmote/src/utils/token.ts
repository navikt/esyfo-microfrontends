import { requestOboToken } from "@navikt/oasis";
import { logger } from "@src/utils/logger.ts";
import { isLocal } from "./environment";

export const getAccessToken = async (token: string, clientID: string): Promise<string> => {
  if (isLocal) {
    return "Fake token";
  }

  const oboResult = await requestOboToken(token, clientID);

  if (!oboResult.ok) {
    logger.error(`Error getting access token: ${oboResult.error}`);
    throw new Error("Request oboToken for dialogmote failed");
  }

  return oboResult.token;
};
