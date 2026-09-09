import { requestOboToken } from "@navikt/oasis";
import { isLocal } from "./environment.ts";

export type AccessTokenResult = { ok: true; token: string } | { ok: false };

export const getAccessToken = async (
  token: string,
  clientId: string,
): Promise<AccessTokenResult> => {
  if (isLocal) {
    return { ok: true, token: "Fake token" };
  }

  try {
    const oboResult = await requestOboToken(token, clientId);

    if (!oboResult.ok) {
      return { ok: false };
    }

    return { ok: true, token: oboResult.token };
  } catch {
    return { ok: false };
  }
};
