import { iso, literal, object, string, z } from "zod";

const unntakArsaker = z.union([
  literal("MEDISINSKE_GRUNNER"),
  literal("TILRETTELEGGING_IKKE_MULIG"),
  literal("SJOMENN_UTENRIKS"),
]);

const oppfyltArsaker = z.union([
  literal("FRISKMELDT"),
  literal("GRADERT"),
  literal("TILTAK"),
]);

export const vurderingSchema = z.discriminatedUnion("status", [
  object({
    status: z.literal("UNNTAK"),
    arsaker: z.array(unntakArsaker),
    sistVurdert: iso.datetime({ local: true }).nullish(),
  }),
  object({
    status: z.literal("OPPFYLT"),
    arsaker: z.array(oppfyltArsaker),
    sistVurdert: iso.datetime({ local: true }).nullish(),
  }),
  object({
    status: z.literal("NY"),
  }),
  object({
    status: z.literal("NY_VURDERING"),
  }),
  object({
    status: z.literal("AVVENT"),
    sistVurdert: iso.datetime({ local: true }).nullish(),
  }),
  object({
    status: z.literal("FORHANDSVARSEL"),
    journalpostId: string().nullish(),
    sistVurdert: iso.datetime({ local: true }).nullish(),
    fristDato: iso.date(),
  }),
  object({
    status: z.literal("IKKE_OPPFYLT"),
    sistVurdert: iso.datetime({ local: true }).nullish(),
  }),
  object({
    status: z.literal("IKKE_AKTUELL"),
    sistVurdert: iso.datetime({ local: true }).nullish(),
  }),
  object({
    status: z.literal("AUTOMATISK_OPPFYLT"),
    sistVurdert: iso.datetime({ local: true }).nullish(),
  }),
  object({
    status: z.literal("INNSTILLING_OM_STANS"),
    sistVurdert: iso.datetime({ local: true }).nullish(),
  }),
  object({
    status: z.literal("LUKKET"),
    sistVurdert: iso.datetime({ local: true }).nullish(),
  }),
]);

export type AktivitetskravVurdering = z.infer<typeof vurderingSchema>;
export type UnntakArsaker = z.infer<typeof unntakArsaker>;
export type OppfyltArsaker = z.infer<typeof oppfyltArsaker>;
