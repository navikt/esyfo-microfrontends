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
    vi.restoreAllMocks();
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
});
