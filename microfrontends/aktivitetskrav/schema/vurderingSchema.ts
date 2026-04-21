import { iso, literal, object, string, union, z } from "zod";

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

export const vurderingSchema = union([
  object({
    status: z.literal("UNNTAK"),
    arsaker: z.array(unntakArsaker),
    sistVurdert: iso.datetime({ local: true }),
  }),
  object({
    status: z.literal("OPPFYLT"),
    arsaker: z.array(oppfyltArsaker),
    sistVurdert: iso.datetime({ local: true }),
  }),
  object({
    status: z.literal("NY"),
  }),
  object({
    status: z.literal("NY_VURDERING"),
  }),
  object({
    status: z.literal("AVVENT"),
    sistVurdert: iso.datetime({ local: true }),
  }),
  object({
    status: z.literal("FORHANDSVARSEL"),
    journalpostId: string().optional(),
    sistVurdert: iso.datetime({ local: true }),
    fristDato: iso.date(),
  }),
  object({
    status: z.literal("IKKE_OPPFYLT"),
    sistVurdert: iso.datetime({ local: true }),
  }),
  object({
    status: z.literal("IKKE_AKTUELL"),
    sistVurdert: iso.datetime({ local: true }),
  }),
  object({
    status: z.literal("AUTOMATISK_OPPFYLT"),
    sistVurdert: iso.datetime({ local: true }).optional(),
  }),
  object({
    status: z.literal("INNSTILLING_OM_STANS"),
    sistVurdert: iso.datetime({ local: true }).optional(),
  }),
  object({
    status: z.literal("LUKKET"),
    sistVurdert: iso.datetime({ local: true }).optional(),
  }),
]);

export type AktivitetskravVurdering = z.infer<typeof vurderingSchema>;
export type UnntakArsaker = z.infer<typeof unntakArsaker>;
export type OppfyltArsaker = z.infer<typeof oppfyltArsaker>;
