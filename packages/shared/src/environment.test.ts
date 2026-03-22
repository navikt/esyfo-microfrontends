import { beforeEach, describe, expect, it, vi } from "vitest";
import { isInternal } from "./environment.ts";

describe("environment", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("detects internal routes from a minimal APIContext shape", () => {
    const internalContext = {
      request: {
        url: "http://localhost/api/internal/isAlive",
      },
    } as Parameters<typeof isInternal>[0];

    expect(isInternal(internalContext)).toBe(true);
  });

  it("returns false for non-internal routes", () => {
    const externalContext = {
      request: {
        url: "http://localhost/api/status",
      },
    } as Parameters<typeof isInternal>[0];

    expect(isInternal(externalContext)).toBe(false);
  });

  it("is not local in the test environment", async () => {
    const { isLocal } = await import("./environment.ts");

    expect(isLocal).toBe(false);
  });

  it("is local when NODE_ENV is development", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "development");

    const { isLocal } = await import("./environment.ts");

    expect(isLocal).toBe(true);
  });
});
