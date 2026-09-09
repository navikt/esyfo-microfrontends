import { logger } from "@navikt/pino-logger";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { brevSchema } from "./brevSchema";

const validDocumentComponent = {
  type: "HEADER",
  key: "IKKE_BEHOV",
  title: "Tittel",
  texts: ["Linje 1", "Linje 2"],
} as const;

const PRIVATE_VALUE = "person-12345678901@example.com";

const validBrev = {
  uuid: "brev-uuid",
  deltakerUuid: "deltaker-uuid",
  createdAt: "2024-01-15T10:00:00.000Z",
  brevType: "INNKALT",
  digitalt: true,
  lestDato: "2024-01-16T10:00:00.000Z",
  fritekst: "Fritekst",
  sted: "Nav-kontoret",
  tid: "2024-02-01T10:00:00",
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
    expect(logger.warn).toHaveBeenCalledWith(
      {
        event_type: "dialogmote_document_component_value_unknown",
        component_field: "type",
        received_value: "TOTALLY_NEW_TYPE",
      },
      "Ukjent verdi i dokumentkomponent fra dialogmøte-backend",
    );
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
    expect(logger.warn).toHaveBeenCalledWith(
      {
        event_type: "dialogmote_document_component_value_unknown",
        component_field: "key",
        received_value: "NEW_KEY",
      },
      "Ukjent verdi i dokumentkomponent fra dialogmøte-backend",
    );
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

  it("omits a malformed value from the warning", () => {
    const result = brevSchema.parse({
      ...validBrev,
      document: [
        {
          ...validDocumentComponent,
          type: PRIVATE_VALUE,
        },
      ],
    });

    expect(result.document[0]?.type).toBe("UNKNOWN");
    expect(logger.warn).toHaveBeenCalledWith(
      {
        event_type: "dialogmote_document_component_value_unknown",
        component_field: "type",
      },
      "Ukjent verdi i dokumentkomponent fra dialogmøte-backend",
    );
    expect(JSON.stringify(vi.mocked(logger.warn).mock.calls)).not.toContain(
      PRIVATE_VALUE,
    );
  });
});
