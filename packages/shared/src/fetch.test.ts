import { logger } from "@navikt/pino-logger";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

const mockState = vi.hoisted(() => ({
  getAccessToken: vi.fn(),
}));

vi.mock("./token", () => ({
  getAccessToken: mockState.getAccessToken,
}));

import { fetchFromBackend } from "./fetch";

describe("fetchFromBackend", () => {
  const schema = z.object({ id: z.string() });
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockState.getAccessToken.mockReset();
    mockState.getAccessToken.mockResolvedValue("test-token");
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
      token: "incoming-token",
      clientId: "client-id",
      apiUrl: "https://example.com/api",
      apiName: "test API",
      schema,
    });

    expect(result).toEqual({ id: "123" });
    expect(mockState.getAccessToken).toHaveBeenCalledWith(
      "incoming-token",
      "client-id",
    );
    expect(fetchMock).toHaveBeenCalledWith("https://example.com/api", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
    });
  });

  it("throws on HTTP errors", async () => {
    fetchMock.mockResolvedValue(
      new Response("Server error", {
        status: 500,
        statusText: "Internal Server Error",
      }),
    );

    await expect(
      fetchFromBackend({
        token: "incoming-token",
        clientId: "client-id",
        apiUrl: "https://example.com/api",
        apiName: "test API",
        schema,
      }),
    ).rejects.toThrow("Http error with status: 500");
  });

  it("rethrows network errors from fetch", async () => {
    const networkError = new Error("network failed");
    fetchMock.mockRejectedValue(networkError);

    await expect(
      fetchFromBackend({
        token: "incoming-token",
        clientId: "client-id",
        apiUrl: "https://example.com/api",
        apiName: "test API",
        schema,
      }),
    ).rejects.toBe(networkError);
  });

  it("rethrows invalid JSON parsing errors", async () => {
    const jsonError = new Error("invalid json");
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(jsonError),
    } as unknown as Response);

    await expect(
      fetchFromBackend({
        token: "incoming-token",
        clientId: "client-id",
        apiUrl: "https://example.com/api",
        apiName: "test API",
        schema,
      }),
    ).rejects.toBe(jsonError);
  });

  it("throws when the response fails Zod validation", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ wrongKey: "123" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(
      fetchFromBackend({
        token: "incoming-token",
        clientId: "client-id",
        apiUrl: "https://example.com/api",
        apiName: "test API",
        schema,
      }),
    ).rejects.toThrow("Invalid test API response");
  });

  it("logs only validation issue path and code for Zod validation failures", async () => {
    const piiSchema = z.object({
      fnr: z.string().length(11),
      nested: z.object({
        fornavn: z.string(),
      }),
    });

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          fnr: "123",
          nested: {},
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    await expect(
      fetchFromBackend({
        token: "incoming-token",
        clientId: "client-id",
        apiUrl: "https://example.com/api",
        apiName: "test API",
        schema: piiSchema,
      }),
    ).rejects.toThrow("Invalid test API response");

    expect(logger.error).toHaveBeenCalledWith(
      {
        api: "test API",
        url: "https://example.com/api",
        validationIssues: [
          { path: "fnr", code: "too_small" },
          { path: "nested.fornavn", code: "invalid_type" },
        ],
      },
      "Invalid test API response",
    );
    expect(logger.error).not.toHaveBeenCalledWith(
      expect.objectContaining({
        validationIssues: expect.arrayContaining([
          expect.objectContaining({
            message: expect.anything(),
          }),
        ]),
      }),
      expect.any(String),
    );
    expect(logger.error).not.toHaveBeenCalledWith(
      expect.objectContaining({
        validationIssues: expect.arrayContaining([
          expect.objectContaining({
            received: expect.anything(),
          }),
        ]),
      }),
      expect.any(String),
    );
    expect(logger.error).not.toHaveBeenCalledWith(
      expect.objectContaining({
        validationIssues: expect.arrayContaining([
          expect.objectContaining({
            expected: expect.anything(),
          }),
        ]),
      }),
      expect.any(String),
    );

    const [payload] = vi.mocked(logger.error).mock.calls.at(-1) ?? [];
    expect(JSON.stringify(payload)).not.toContain("123");
    expect(JSON.stringify(payload)).not.toContain("Too small");
  });
});
