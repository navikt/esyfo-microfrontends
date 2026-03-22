import { vi } from "vitest";

vi.mock("@navikt/pino-logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("astro:env/server", () => ({
  MOTEBEHOV_URL: "http://localhost:3000/syk/dialogmoter/sykmeldt",
  SYFOMOTEBEHOV_API_URL: "http://localhost:3000/api/motebehov",
  SYFOMOTEBEHOV_CLIENT_ID: "local:team-esyfo:syfomotebehov",
}));
