import { literal, object, string, union, z } from "zod";

const unntakArsaker = z.union([
  literal("MEDISINSKE_GRUNNER"),
  literal("TILRETTELEGGING_IKKE_MULIG"),
  literal("SJOMENN_UTENRIKS"),
]);

const oppfyltArsaker = z.union([literal("FRISKMELDT"), literal("GRADERT"), literal("TILTAK")]);

export const aktivitetskravVurderingSchema = union([
  object({
    status: z.literal("UNNTAK"),
    arsaker: z.array(unntakArsaker),
    sistVurdert: string().datetime(),
  }),
  object({
    status: z.literal("OPPFYLT"),
    arsaker: z.array(oppfyltArsaker),
    sistVurdert: string().datetime(),
  }),
  object({
    status: z.literal("NY"),
  }),
  object({
    status: z.literal("NY_VURDERING"),
  }),
  object({
    status: z.literal("AVVENT"),
    sistVurdert: string().datetime(),
  }),
  object({
    status: z.literal("FORHANDSVARSEL"),
    journalpostId: string().optional(),
    sistVurdert: string().datetime(),
    fristDato: string().datetime(),
  }),
  object({
    status: z.literal("IKKE_OPPFYLT"),
    sistVurdert: string().datetime(),
  }),
  object({
    status: z.literal("IKKE_AKTUELL"),
    sistVurdert: string().datetime(),
  }),
]);

export type AktivitetskravVurdering = z.infer<typeof aktivitetskravVurderingSchema>;
export type UnntakArsaker = z.infer<typeof unntakArsaker>;
export type OppfyltArsaker = z.infer<typeof oppfyltArsaker>;
