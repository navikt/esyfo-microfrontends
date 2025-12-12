import { getAccessToken } from "@src/utils/token.ts";
import type { BrevDTO } from "../../schema/brevSchema.ts";
import type { MotebehovStatusDTO } from "../../schema/motebehovSchema.ts";
import { ISDIALOGMOTE_API_URL, ISDIALOGMOTE_CLIENT_ID } from "astro:env/server";
import { SYFOMOTEBEHOV_API_URL, SYFOMOTEBEHOV_CLIENT_ID } from "astro:env/server";

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
    throw new Error(`Http error with status: ${response.status}`);
  }

  return await response.json();
};

export const fetchMotebehov = async (userToken: string): Promise<MotebehovStatusDTO> => {
  const accessToken = await getAccessToken(userToken, SYFOMOTEBEHOV_CLIENT_ID);

  const response = await fetch(SYFOMOTEBEHOV_API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Http error with status: ${response.status}`);
  }

  return await response.json();
};
