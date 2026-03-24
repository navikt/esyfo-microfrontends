import { z } from "zod";

const senOppfolgingStatusSchema = z.object({
  responseStatus: z.union([
    z.literal("NO_RESPONSE"),
    z.literal("TRENGER_OPPFOLGING"),
    z.literal("TRENGER_IKKE_OPPFOLGING"),
  ]),
  responseDateTime: z.string().nullish(),
  hasAccessToSenOppfolging: z.boolean(),
  maxDate: z.string().nullish(),
});

const kartleggingStatusSchema = z.object({
  responseStatus: z.union([z.literal("NO_RESPONSE"), z.literal("SUBMITTED")]),
  responseDateTime: z.string().nullish(),
  hasAccessToKartlegging: z.boolean(),
});

export const merOppfolgingStatusSchema = z.discriminatedUnion(
  "oppfolgingsType",
  [
    z.object({
      oppfolgingsType: z.literal("SEN_OPPFOLGING"),
      senOppfolgingStatus: senOppfolgingStatusSchema,
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

export type MerOppfolgingStatusDTO = z.infer<typeof merOppfolgingStatusSchema>;
export type SenOppfolgingStatusDTO = z.infer<typeof senOppfolgingStatusSchema>;
export type KartleggingStatusDTO = z.infer<typeof kartleggingStatusSchema>;
