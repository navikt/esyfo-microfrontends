import { z } from "zod";

const localDateTime = z.string().datetime({ local: true });
const localDate = z.string().date();

const senoppfolgingStatusSchema = z.object({
  responseStatus: z.union([
    z.literal("NO_RESPONSE"),
    z.literal("TRENGER_OPPFOLGING"),
    z.literal("TRENGER_IKKE_OPPFOLGING"),
  ]),
  responseDateTime: localDateTime.nullish(),
  hasAccessToSenOppfolging: z.boolean(),
  maxDate: localDate.nullish(),
});

const kartleggingStatusSchema = z.object({
  responseStatus: z.union([z.literal("NO_RESPONSE"), z.literal("SUBMITTED")]),
  responseDateTime: localDateTime.nullish(),
  hasAccessToKartlegging: z.boolean(),
});

export const meroppfolgingStatusSchema = z.discriminatedUnion(
  "oppfolgingsType",
  [
    z.object({
      oppfolgingsType: z.literal("SEN_OPPFOLGING"),
      senOppfolgingStatus: senoppfolgingStatusSchema,
    }),
    z.object({
      oppfolgingsType: z.literal("KARTLEGGING"),
      kartleggingStatus: kartleggingStatusSchema,
    }),
    z.object({
      oppfolgingsType: z.literal("INGEN_OPPFOLGING"),
      senOppfolgingStatus: z.null(),
    }),
  ],
);

export type MeroppfolgingStatusDto = z.infer<typeof meroppfolgingStatusSchema>;
export type SenoppfolgingStatusDto = z.infer<typeof senoppfolgingStatusSchema>;
export type KartleggingStatusDto = z.infer<typeof kartleggingStatusSchema>;
