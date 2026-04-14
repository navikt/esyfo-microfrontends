import { vi } from "vitest";

vi.mock("@navikt/pino-logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("astro:env/server", () => ({
  SYFOMOTEBEHOV_BACKEND_HOST: "http://localhost:3000",
  SYFOMOTEBEHOV_CLIENT_ID: "local:team-esyfo:syfomotebehov",
}));
