import { logger } from "@navikt/pino-logger";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { brevSchema } from "./brevSchema";

const validDocumentComponent = {
  type: "HEADER",
  key: "IKKE_BEHOV",
  title: "Tittel",
  texts: ["Linje 1", "Linje 2"],
} as const;

const validBrev = {
  uuid: "brev-uuid",
  deltakerUuid: "deltaker-uuid",
  createdAt: "2024-01-15T10:00:00.000Z",
  brevType: "INNKALT",
  digitalt: true,
  lestDato: "2024-01-16T10:00:00.000Z",
  fritekst: "Fritekst",
  sted: "NAV-kontoret",
  tid: "2024-02-01 10:00",
  videoLink: "https://example.com/video",
  document: [validDocumentComponent],
  virksomhetsnummer: "123456789",
  svar: {
    svarTidspunkt: "2024-01-15T10:00:00.000Z",
    svarType: "NYTT_TID_STED",
    svarTekst: "Kan vi finne et nytt tidspunkt?",
  },
} as const;

describe("brevSchema preprocessors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("transforms unknown componentType to UNKNOWN and logs a warning", () => {
    const result = brevSchema.parse({
      ...validBrev,
      document: [
        {
          ...validDocumentComponent,
          type: "TOTALLY_NEW_TYPE",
        },
      ],
    });

    expect(result.document[0]?.type).toBe("UNKNOWN");
    expect(logger.warn).toHaveBeenCalled();
  });

  it("transforms unknown documentKey to UNKNOWN and logs a warning", () => {
    const result = brevSchema.parse({
      ...validBrev,
      document: [
        {
          ...validDocumentComponent,
          key: "NEW_KEY",
        },
      ],
    });

    expect(result.document[0]?.key).toBe("UNKNOWN");
    expect(logger.warn).toHaveBeenCalled();
  });

  it("accepts null documentKey without logging a warning", () => {
    const result = brevSchema.parse({
      ...validBrev,
      document: [
        {
          ...validDocumentComponent,
          key: null,
        },
      ],
    });

    expect(result.document[0]?.key).toBeNull();
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
