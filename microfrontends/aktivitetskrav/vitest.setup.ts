import { vi } from "vitest";

vi.mock("@navikt/pino-logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("astro:env/server", () => ({
  AKTIVITETSKRAV_BACKEND_HOST: "http://aktivitetskrav-backend",
  AKTIVITETSKRAV_CLIENT_ID: "local:teamsykefravr:aktivitetskrav-api",
}));
