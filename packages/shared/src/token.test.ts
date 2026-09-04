import { beforeEach, describe, expect, it, vi } from "vitest";

const mockState = vi.hoisted(() => ({
  isLocal: false,
  requestOboToken: vi.fn(),
}));

vi.mock("@navikt/oasis", () => ({
  requestOboToken: mockState.requestOboToken,
}));

vi.mock("./environment.ts", () => ({
  get isLocal() {
    return mockState.isLocal;
  },
}));

import { getAccessToken } from "./token";

describe("getAccessToken", () => {
  beforeEach(() => {
    mockState.isLocal = false;
    mockState.requestOboToken.mockReset();
    vi.restoreAllMocks();
  });

  it("returns a fake token in local mode without requesting an OBO token", async () => {
    mockState.isLocal = true;

    const result = await getAccessToken("incoming-token", "client-id");

    expect(result).toEqual({ ok: true, token: "Fake token" });
    expect(mockState.requestOboToken).not.toHaveBeenCalled();
  });

  it("returns the OBO token on success", async () => {
    mockState.requestOboToken.mockResolvedValue({
      ok: true,
      token: "obo-token",
    });

    const result = await getAccessToken("incoming-token", "client-id");

    expect(result).toEqual({ ok: true, token: "obo-token" });
    expect(mockState.requestOboToken).toHaveBeenCalledWith(
      "incoming-token",
      "client-id",
    );
  });

  it("returns a typed failure when the OBO exchange returns a failure result", async () => {
    mockState.requestOboToken.mockResolvedValue({
      ok: false,
      error: new Error("exchange failed"),
    });

    await expect(
      getAccessToken("incoming-token", "client-id"),
    ).resolves.toEqual({
      ok: false,
    });
  });

  it("returns the same typed failure for request exceptions", async () => {
    const networkError = new Error("network down");
    mockState.requestOboToken.mockRejectedValue(networkError);

    await expect(
      getAccessToken("incoming-token", "client-id"),
    ).resolves.toEqual({
      ok: false,
    });
  });
});
