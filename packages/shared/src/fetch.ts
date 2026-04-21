import { logger } from "@navikt/pino-logger";
import type { ZodType } from "zod";
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
    logger.error(
      { api: apiName, url: apiUrl, error },
      `Network error fetching ${apiName}`,
    );
    throw error;
  }

  if (!response.ok) {
    logger.error(
      {
        api: apiName,
        url: apiUrl,
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
      { api: apiName, url: apiUrl, error },
      `Invalid JSON response from ${apiName}`,
    );
    throw error;
  }

  const parsed = schema.safeParse(data);

  if (parsed.success) {
    return parsed.data;
  }

  // Zod issues can include messages and inferred values from the payload.
  // We only log path/code pairs here to avoid leaking PII from backend responses.
  logger.error(
    {
      api: apiName,
      url: apiUrl,
      validationIssues: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        code: issue.code,
      })),
    },
    `Invalid ${apiName} response`,
  );

  throw new Error(`Invalid ${apiName} response`);
};
