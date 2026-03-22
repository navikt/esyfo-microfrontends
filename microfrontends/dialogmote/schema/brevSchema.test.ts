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

describe("brevSchema", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("parses a valid brev with all fields", () => {
    const result = brevSchema.safeParse(validBrev);

    expect(result.success).toBe(true);
  });

  it("parses a valid brev with svar", () => {
    const result = brevSchema.safeParse({
      ...validBrev,
      svar: {
        svarTidspunkt: "2024-01-15T10:00:00.000Z",
        svarType: "KOMMER",
        svarTekst: "Jeg kommer",
      },
    });

    expect(result.success).toBe(true);
  });

  it("parses a valid brev with svar set to null", () => {
    const result = brevSchema.safeParse({
      ...validBrev,
      svar: null,
    });

    expect(result.success).toBe(true);
  });

  it("fails for invalid brevType", () => {
    const result = brevSchema.safeParse({
      ...validBrev,
      brevType: "INVALID",
    });

    expect(result.success).toBe(false);
  });

  it("transforms unknown componentType to UNKNOWN and logs a warning", () => {
    const result = brevSchema.safeParse({
      ...validBrev,
      document: [
        {
          ...validDocumentComponent,
          type: "TOTALLY_NEW_TYPE",
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.data.document[0]?.type).toBe("UNKNOWN");
    expect(logger.warn).toHaveBeenCalled();
  });

  it("transforms unknown documentKey to UNKNOWN", () => {
    const result = brevSchema.safeParse({
      ...validBrev,
      document: [
        {
          ...validDocumentComponent,
          key: "NEW_KEY",
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.data.document[0]?.key).toBe("UNKNOWN");
    expect(logger.warn).toHaveBeenCalled();
  });

  it("accepts null documentKey", () => {
    const result = brevSchema.safeParse({
      ...validBrev,
      document: [
        {
          ...validDocumentComponent,
          key: null,
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.data.document[0]?.key).toBeNull();
  });

  it("fails when required fields are missing", () => {
    const result = brevSchema.safeParse({});

    expect(result.success).toBe(false);
  });
});
