import { vi } from "vitest";

vi.mock("@navikt/pino-logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("astro:env/server", () => ({
  AKTIVITETSKRAV_API_URL: "http://aktivitetskrav-api/api/aktivitetsplikt",
  AKTIVITETSKRAV_CLIENT_ID: "local:teamsykefravr:aktivitetskrav-api",
}));
