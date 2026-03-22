import { logger } from "@navikt/pino-logger";
import { type ZodType, z } from "zod";
import { getAccessToken } from "./token";

interface FetchConfig<T> {
  token: string;
  clientId: string;
  apiUrl: string;
  apiName: string;
  schema: ZodType<T>;
}

export const fetchFromBackend = async <T>({
  token,
  clientId,
  apiUrl,
  apiName,
  schema,
}: FetchConfig<T>): Promise<T> => {
  const accessToken = await getAccessToken(token, clientId);

  let response: Response;
  try {
    response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    logger.error({ api: apiName, error }, `Network error fetching ${apiName}`);
    throw error;
  }

  if (!response.ok) {
    logger.error(
      {
        api: apiName,
        status: response.status,
        statusText: response.statusText,
      },
      `Failed to fetch ${apiName}`,
    );
    throw new Error(`Http error with status: ${response.status}`);
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch (error) {
    logger.error(
      { api: apiName, error },
      `Invalid JSON response from ${apiName}`,
    );
    throw error;
  }

  const parsed = schema.safeParse(data);

  if (parsed.success) {
    return parsed.data;
  }

  logger.error(
    { api: apiName, validationErrors: z.flattenError(parsed.error) },
    `Invalid ${apiName} response`,
  );

  throw new Error(`Invalid ${apiName} response`);
};
