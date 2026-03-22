import { vi } from "vitest";

vi.mock("@navikt/pino-logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("astro:env/server", () => ({
  DIALOGMOTE_URL: "http://localhost:3000/syk/dialogmoter/sykmeldt",
  ISDIALOGMOTE_API_URL: "http://localhost:3000/api/dialogmote",
  ISDIALOGMOTE_CLIENT_ID: "local:teamsykefravr:isdialogmote",
}));
