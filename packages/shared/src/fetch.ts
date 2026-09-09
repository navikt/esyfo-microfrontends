import { logger } from "@navikt/pino-logger";
import type { ZodError, ZodType } from "zod";
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

type SafeExceptionType =
  | "SyntaxError"
  | "TypeError"
  | "RangeError"
  | "Error"
  | "NonErrorThrown";

const safeExceptionType = (error: unknown): SafeExceptionType => {
  if (error instanceof SyntaxError) return "SyntaxError";
  if (error instanceof TypeError) return "TypeError";
  if (error instanceof RangeError) return "RangeError";
  if (error instanceof Error) return "Error";
  return "NonErrorThrown";
};

const safeValidationPath = (path: PropertyKey[]): string =>
  path
    .map((segment) => {
      if (typeof segment === "number") return `[${segment}]`;
      if (
        typeof segment === "string" &&
        /^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(segment)
      ) {
        return segment;
      }
      return "*";
    })
    .join(".") || "$";

const safeValidationErrors = (error: ZodError) =>
  error.issues.slice(0, 20).map((issue) => ({
    code: issue.code,
    path: safeValidationPath(issue.path),
  }));

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
  } catch (error) {
    logger.error(
      {
        event_type: backend.eventType,
        error_code: FETCH_ERROR_CODE.network,
        operation: backend.operation,
        exception_type: safeExceptionType(error),
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
  } catch (error) {
    logger.error(
      {
        event_type: backend.eventType,
        error_code: FETCH_ERROR_CODE.invalidJson,
        operation: backend.operation,
        exception_type: safeExceptionType(error),
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
      validation_target: "upstream_response",
      validationErrors: safeValidationErrors(parsed.error),
      validation_issue_count: parsed.error.issues.length,
    },
    backend.message,
  );

  throw new BackendFetchError(backend.message);
};
