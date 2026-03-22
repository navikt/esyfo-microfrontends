import { logger } from "@navikt/pino-logger";
import {
  array,
  boolean,
  literal,
  object,
  preprocess,
  string,
  union,
  z,
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
  svarTidspunkt: string(),
  svarType: svarType,
  svarTekst: string().nullable(),
});

export const brevSchema = object({
  uuid: string(),
  deltakerUuid: string(),
  createdAt: string(),
  brevType: brevType,
  digitalt: boolean().nullish(),
  lestDato: string().nullable(),
  fritekst: string(),
  sted: string(),
  tid: string(),
  videoLink: string().nullable(),
  document: array(documentComponent),
  virksomhetsnummer: string(),
  svar: svar.nullable(),
});

function transformComponentType(type: unknown): string {
  const parsedType = documentComponentType.safeParse(type);

  if (parsedType.success) return parsedType.data;

  logger.warn(
    { type, validationErrors: z.flattenError(parsedType.error) },
    "Error parsing document transformComponentType",
  );
  return "UNKNOWN";
}

function transformDocumentKey(key: unknown): string | null {
  const parsedKey = documentComponentKey.nullable().safeParse(key);

  if (parsedKey.success) return parsedKey.data;
  logger.warn(
    { key, validationErrors: z.flattenError(parsedKey.error) },
    "Error parsing document transformDocumentKey",
  );
  return "UNKNOWN";
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
