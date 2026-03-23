import { vi } from "vitest";

vi.mock("@navikt/pino-logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));
