import { logger } from "@navikt/pino-logger";
import {
  array,
  boolean,
  iso,
  literal,
  object,
  preprocess,
  string,
  union,
  type z,
} from "zod";

const documentComponentType = union([
  literal("HEADER"),
  literal("HEADER_H1"),
  literal("HEADER_H2"),
  literal("PARAGRAPH"),
  literal("LINK"),
]);

const documentComponentTypeWithUnknown = union([
  documentComponentType,
  literal("UNKNOWN"),
]);

const svarType = union([
  literal("KOMMER"),
  literal("NYTT_TID_STED"),
  literal("KOMMER_IKKE"),
]);

const brevType = union([
  literal("INNKALT"),
  literal("AVLYST"),
  literal("NYTT_TID_STED"),
  literal("REFERAT"),
  literal("REFERAT_ENDRET"),
]);

const documentComponentKey = union([
  literal("IKKE_BEHOV"),
  literal("FRISKMELDING_ARBEIDSFORMIDLING"),
  literal("AVKLARING_ARBEIDSEVNE"),
  literal("OPPFOLGINGSTILTAK"),
  literal("ARBEIDSRETTET_REHABILITERING"),
  literal("OPPLAERING_UTDANNING"),
  literal("UNNTAK_ARBEIDSGIVERPERIODE"),
  literal("REISETILSKUDD"),
  literal("HJELPEMIDLER_TILRETTELEGGING"),
  literal("EKSPERTBISTAND"),
  literal("MIDLERTIDIG_LONNSTILSKUDD"),
  literal("OKONOMISK_STOTTE"),
  literal("INGEN_RETTIGHETER"),
]);

const documentComponentKeyWithUnknown = union([
  documentComponentKey,
  literal("UNKNOWN"),
]);

const documentComponent = object({
  type: preprocess(transformComponentType, documentComponentTypeWithUnknown),
  key: preprocess(
    transformDocumentKey,
    documentComponentKeyWithUnknown.nullable(),
  ),
  title: string().nullable(),
  texts: array(string()),
});

const svar = object({
  svarTidspunkt: iso.datetime({ local: true }),
  svarType: svarType,
  svarTekst: string().nullable(),
});

export const brevSchema = object({
  uuid: string(),
  deltakerUuid: string(),
  createdAt: iso.datetime({ local: true }),
  brevType: brevType,
  digitalt: boolean(),
  lestDato: iso.datetime({ local: true }).nullable(),
  fritekst: string(),
  sted: string(),
  tid: iso.datetime({ local: true }),
  videoLink: string().nullable(),
  document: array(documentComponent),
  virksomhetsnummer: string(),
  svar: svar.nullable(),
});

function transformComponentType(type: unknown): string {
  const parsedType = documentComponentType.safeParse(type);

  if (parsedType.success) return parsedType.data;

  logUnknownDocumentComponentValue("type", type);
  return "UNKNOWN";
}

function transformDocumentKey(key: unknown): string | null {
  const parsedKey = documentComponentKey.nullable().safeParse(key);

  if (parsedKey.success) return parsedKey.data;
  logUnknownDocumentComponentValue("key", key);
  return "UNKNOWN";
}

const safeEnumToken = (value: unknown): string | undefined =>
  typeof value === "string" && /^[A-Z][A-Z0-9_]{0,63}$/.test(value)
    ? value
    : undefined;

function logUnknownDocumentComponentValue(
  componentField: "type" | "key",
  value: unknown,
): void {
  const receivedValue = safeEnumToken(value);
  logger.warn(
    {
      event_type: "dialogmote_document_component_value_unknown",
      component_field: componentField,
      ...(receivedValue === undefined ? {} : { received_value: receivedValue }),
    },
    "Ukjent verdi i dokumentkomponent fra dialogmøte-backend",
  );
}

export type BrevDto = z.infer<typeof brevSchema>;
export type BrevTypeDto = z.infer<typeof brevType>;
export type BrevDocumentComponentDto = z.infer<typeof documentComponent>;
export type BrevDocumentComponentTypeDto = z.infer<
  typeof documentComponentTypeWithUnknown
>;
export type BrevDocumentComponentKeyDto = z.infer<
  typeof documentComponentKeyWithUnknown
>;
export type SvarTypeDto = z.infer<typeof svarType>;
export type SvarResponsDto = z.infer<typeof svar>;
