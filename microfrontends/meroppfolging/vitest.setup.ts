import { vi } from "vitest";

vi.mock("@navikt/pino-logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("astro:env/server", () => ({
  MEROPPFOLGING_API_URL: "http://localhost:3000/api/mikrofrontend/v1/status",
  MEROPPFOLGING_CLIENT_ID: "local:team-esyfo:meroppfolging-backend",
  SSPS_URL: "https://www.nav.no/syk/meroppfolging/snart-slutt-pa-sykepengene",
  KARTLEGGING_URL: "https://www.nav.no/syk/kartleggingssporsmal",
}));
