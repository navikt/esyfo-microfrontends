import { context, TraceFlags, trace } from "@opentelemetry/api";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

const mockState = vi.hoisted(() => ({
  isLocal: false,
  requestOboToken: vi.fn(),
  logLines: [] as string[],
}));

vi.mock("@navikt/oasis", () => ({
  requestOboToken: mockState.requestOboToken,
}));

vi.mock("./environment.ts", () => ({
  get isLocal() {
    return mockState.isLocal;
  },
}));

vi.mock("@navikt/pino-logger", async () => {
  const { createLogger } = await vi.importActual<
    typeof import("@navikt/pino-logger")
  >("@navikt/pino-logger");

  return {
    logger: createLogger(
      { base: null, timestamp: false },
      {
        write: (line: string) => mockState.logLines.push(line),
      },
    ),
  };
});

import { BACKEND_FETCH_CATALOG } from "./backendFetchCatalog";
import { BackendFetchError, fetchFromBackend } from "./fetch";

describe("fetchFromBackend", () => {
  const schema = z.object({ id: z.string() });
  const fetchMock = vi.fn();
  const backend = BACKEND_FETCH_CATALOG.aktivitetskravVurdering;
  const incomingToken = "incoming-token-12345678901";
  const accessToken = "access-token-someone@example.com";
  const clientId = "prod-gcp:team-esyfo:privacy-canary-client";
  const apiUrl =
    "https://example.test/person/123e4567-e89b-12d3-a456-426614174000";
  const httpBody = "upstream body for 12345678901";
  const statusText = "status for someone@example.com";
  const privateCanaries = [
    incomingToken,
    accessToken,
    clientId,
    apiUrl,
    httpBody,
    statusText,
    "12345678901",
    "someone@example.com",
    "123e4567-e89b-12d3-a456-426614174000",
  ];

  const parsedLogLines = (): Record<string, unknown>[] =>
    mockState.logLines.map((line) => JSON.parse(line));

  const expectNoPrivateCanaries = (value: unknown): void => {
    const serialized =
      typeof value === "string" ? value : JSON.stringify(value);
    for (const canary of privateCanaries) {
      expect(serialized).not.toContain(canary);
    }
  };

  const expectSafeFailure = async (
    promise: Promise<unknown>,
  ): Promise<void> => {
    let thrown: unknown;
    try {
      await promise;
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(BackendFetchError);
    expect(thrown).toMatchObject({
      name: "BackendFetchError",
      message: backend.message,
    });
    expect((thrown as Error).cause).toBeUndefined();
    expectNoPrivateCanaries([
      (thrown as Error).name,
      (thrown as Error).message,
      (thrown as Error).stack,
      thrown,
    ]);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockState.isLocal = false;
    mockState.requestOboToken.mockReset();
    mockState.requestOboToken.mockResolvedValue({
      ok: true,
      token: accessToken,
    });
    mockState.logLines.length = 0;
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns parsed data on a successful response", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ id: "123" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await fetchFromBackend({
      token: incomingToken,
      clientId,
      apiUrl,
      schema,
      backend,
    });

    expect(result).toEqual({ id: "123" });
    expect(mockState.requestOboToken).toHaveBeenCalledWith(
      incomingToken,
      clientId,
    );
    expect(fetchMock).toHaveBeenCalledWith(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(parsedLogLines()).toEqual([]);
  });

  it("logs one safe failure when the token exchange request throws", async () => {
    mockState.requestOboToken.mockRejectedValue(
      new Error(`token request failed for ${incomingToken} and ${clientId}`),
    );

    await expectSafeFailure(
      fetchFromBackend({
        token: incomingToken,
        clientId,
        apiUrl,
        schema,
        backend,
      }),
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(parsedLogLines()).toEqual([
      expect.objectContaining({
        level: "error",
        event_type: "aktivitetskrav_vurdering_fetch_failed",
        error_code: "TOKEN_EXCHANGE_FAILED",
        operation: "hent_aktivitetskrav_vurdering",
        message: "Kunne ikke hente vurdering av aktivitetskravet",
      }),
    ]);
    expectNoPrivateCanaries(parsedLogLines());
  });

  it("logs the same safe failure when the token exchange returns not ok", async () => {
    mockState.requestOboToken.mockResolvedValue({
      ok: false,
      error: new Error(
        `token response for ${accessToken}, ${clientId} and ${apiUrl}`,
      ),
    });

    await expectSafeFailure(
      fetchFromBackend({
        token: incomingToken,
        clientId,
        apiUrl,
        schema,
        backend,
      }),
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(parsedLogLines()).toEqual([
      expect.objectContaining({
        level: "error",
        event_type: "aktivitetskrav_vurdering_fetch_failed",
        error_code: "TOKEN_EXCHANGE_FAILED",
        operation: "hent_aktivitetskrav_vurdering",
        message: "Kunne ikke hente vurdering av aktivitetskravet",
      }),
    ]);
    expectNoPrivateCanaries(parsedLogLines());
  });

  it("throws on HTTP errors", async () => {
    fetchMock.mockResolvedValue(
      new Response(httpBody, {
        status: 500,
        statusText,
      }),
    );

    await expectSafeFailure(
      fetchFromBackend({
        token: incomingToken,
        clientId,
        apiUrl,
        schema,
        backend,
      }),
    );

    expect(parsedLogLines()).toEqual([
      expect.objectContaining({
        level: "error",
        event_type: "aktivitetskrav_vurdering_fetch_failed",
        error_code: "UPSTREAM_HTTP_ERROR",
        operation: "hent_aktivitetskrav_vurdering",
        upstream_status: 500,
        message: "Kunne ikke hente vurdering av aktivitetskravet",
      }),
    ]);
    expect(typeof parsedLogLines()[0].upstream_status).toBe("number");
    expectNoPrivateCanaries(parsedLogLines());
  });

  it("serializes the active trace id through the production logger", async () => {
    const traceId = "0123456789abcdef0123456789abcdef";
    const activeContext = trace.setSpan(
      context.active(),
      trace.wrapSpanContext({
        traceId,
        spanId: "0123456789abcdef",
        traceFlags: TraceFlags.SAMPLED,
      }),
    );
    vi.spyOn(context, "active").mockReturnValue(activeContext);
    fetchMock.mockResolvedValue(new Response(httpBody, { status: 502 }));

    await expectSafeFailure(
      fetchFromBackend({
        token: incomingToken,
        clientId,
        apiUrl,
        schema,
        backend,
      }),
    );

    const serialized = parsedLogLines().at(0);
    expect(serialized?.trace_id).toBe(traceId);
    expect(serialized?.trace_id).toMatch(/^[0-9a-f]{32}$/);
    expectNoPrivateCanaries(serialized);
  });

  it("omits upstream_status when fetch does not expose a valid HTTP status", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 0 } as Response);

    await expectSafeFailure(
      fetchFromBackend({
        token: incomingToken,
        clientId,
        apiUrl,
        schema,
        backend,
      }),
    );

    expect(parsedLogLines()).toHaveLength(1);
    expect(parsedLogLines()[0]).not.toHaveProperty("upstream_status");
    expectNoPrivateCanaries(parsedLogLines());
  });

  it("replaces network errors with a safe backend fetch error", async () => {
    const networkError = new TypeError(
      `network failed for ${incomingToken} at ${apiUrl}`,
    );
    fetchMock.mockRejectedValue(networkError);

    await expectSafeFailure(
      fetchFromBackend({
        token: incomingToken,
        clientId,
        apiUrl,
        schema,
        backend,
      }),
    );

    expect(parsedLogLines()).toEqual([
      expect.objectContaining({
        level: "error",
        event_type: "aktivitetskrav_vurdering_fetch_failed",
        error_code: "UPSTREAM_NETWORK_ERROR",
        operation: "hent_aktivitetskrav_vurdering",
        exception_type: "TypeError",
        message: "Kunne ikke hente vurdering av aktivitetskravet",
      }),
    ]);
    expectNoPrivateCanaries(parsedLogLines());
  });

  it("replaces invalid JSON errors with a safe backend fetch error", async () => {
    const jsonError = new SyntaxError(`invalid json for ${accessToken}`);
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(jsonError),
    } as unknown as Response);

    await expectSafeFailure(
      fetchFromBackend({
        token: incomingToken,
        clientId,
        apiUrl,
        schema,
        backend,
      }),
    );

    expect(parsedLogLines()).toEqual([
      expect.objectContaining({
        level: "error",
        event_type: "aktivitetskrav_vurdering_fetch_failed",
        error_code: "UPSTREAM_INVALID_JSON",
        operation: "hent_aktivitetskrav_vurdering",
        exception_type: "SyntaxError",
        message: "Kunne ikke hente vurdering av aktivitetskravet",
      }),
    ]);
    expectNoPrivateCanaries(parsedLogLines());
  });

  it("throws when the response fails Zod validation", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          wrongKey: httpBody,
          uuid: "123e4567-e89b-12d3-a456-426614174000",
          email: "someone@example.com",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    await expectSafeFailure(
      fetchFromBackend({
        token: incomingToken,
        clientId,
        apiUrl,
        schema,
        backend,
      }),
    );

    expect(parsedLogLines()).toEqual([
      expect.objectContaining({
        level: "error",
        event_type: "aktivitetskrav_vurdering_fetch_failed",
        error_code: "UPSTREAM_SCHEMA_MISMATCH",
        operation: "hent_aktivitetskrav_vurdering",
        validation_target: "upstream_response",
        validationErrors: [{ code: "invalid_type", path: "id" }],
        validation_issue_count: 1,
        message: "Kunne ikke hente vurdering av aktivitetskravet",
      }),
    ]);

    const serializedLog = JSON.stringify(parsedLogLines());
    expect(serializedLog).not.toContain("wrongKey");
    expect(serializedLog).not.toContain("url");
    expectNoPrivateCanaries(serializedLog);
  });

  it("masks dynamic keys in validation paths", async () => {
    fetchMock.mockResolvedValue(
      Response.json({ "someone@example.com": "not-a-number" }),
    );

    await expectSafeFailure(
      fetchFromBackend({
        token: incomingToken,
        clientId,
        apiUrl,
        schema: z.record(z.string(), z.number()),
        backend,
      }),
    );

    expect(parsedLogLines()[0]).toMatchObject({
      error_code: "UPSTREAM_SCHEMA_MISMATCH",
      validationErrors: [{ code: "invalid_type", path: "*" }],
    });
    expectNoPrivateCanaries(parsedLogLines());
  });
});
