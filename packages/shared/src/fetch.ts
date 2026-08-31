import { logger } from "@navikt/pino-logger";
import type { ZodType } from "zod";
import type { BackendFetchDefinitionFromCatalog } from "./backendFetchCatalog";
import { getAccessToken } from "./token";

interface FetchConfig<T> {
  token: string;
  clientId: string;
  apiUrl: string;
  schema: ZodType<T>;
  backend: BackendFetchDefinitionFromCatalog;
}

const FETCH_ERROR_CODE = {
  tokenExchange: "TOKEN_EXCHANGE_FAILED",
  network: "UPSTREAM_NETWORK_ERROR",
  http: "UPSTREAM_HTTP_ERROR",
  invalidJson: "UPSTREAM_INVALID_JSON",
  schemaMismatch: "UPSTREAM_SCHEMA_MISMATCH",
} as const;

export class BackendFetchError extends Error {
  override readonly name = "BackendFetchError";
}

const validUpstreamStatus = (status: number): number | undefined =>
  Number.isInteger(status) && status >= 100 && status <= 599
    ? status
    : undefined;

export const fetchFromBackend = async <T>({
  token,
  clientId,
  apiUrl,
  schema,
  backend,
}: FetchConfig<T>): Promise<T> => {
  const accessTokenResult = await getAccessToken(token, clientId);

  if (!accessTokenResult.ok) {
    logger.error(
      {
        event_type: backend.eventType,
        error_code: FETCH_ERROR_CODE.tokenExchange,
        operation: backend.operation,
      },
      backend.message,
    );
    throw new BackendFetchError(backend.message);
  }

  const accessToken = accessTokenResult.token;

  let response: Response;
  try {
    response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch {
    logger.error(
      {
        event_type: backend.eventType,
        error_code: FETCH_ERROR_CODE.network,
        operation: backend.operation,
      },
      backend.message,
    );
    throw new BackendFetchError(backend.message);
  }

  if (!response.ok) {
    const upstreamStatus = validUpstreamStatus(response.status);
    logger.error(
      {
        event_type: backend.eventType,
        error_code: FETCH_ERROR_CODE.http,
        operation: backend.operation,
        ...(upstreamStatus === undefined
          ? {}
          : { upstream_status: upstreamStatus }),
      },
      backend.message,
    );
    throw new BackendFetchError(backend.message);
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    logger.error(
      {
        event_type: backend.eventType,
        error_code: FETCH_ERROR_CODE.invalidJson,
        operation: backend.operation,
      },
      backend.message,
    );
    throw new BackendFetchError(backend.message);
  }

  const parsed = schema.safeParse(data);

  if (parsed.success) {
    return parsed.data;
  }

  logger.error(
    {
      event_type: backend.eventType,
      error_code: FETCH_ERROR_CODE.schemaMismatch,
      operation: backend.operation,
    },
    backend.message,
  );

  throw new BackendFetchError(backend.message);
};
