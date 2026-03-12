import { requestOboToken } from "@navikt/oasis";
import { isLocal } from "./environment";

export const getAccessToken = async (token: string, clientId: string): Promise<string> => {
  const oboResult = await requestOboToken(token, clientId);

  if (isLocal) {
    return "Fake token";
  }

  if (!oboResult.ok) {
    console.error("Error getting access token: " + oboResult.error);
    throw new Error("Request oboToken for example-api failed ");
  }

  return oboResult.token;
};
