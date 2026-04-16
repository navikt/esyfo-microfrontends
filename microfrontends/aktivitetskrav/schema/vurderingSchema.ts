import { literal, object, string, union, z } from "zod";

const localDateTime = z.string().datetime({ local: true });
const localDate = z.string().date();

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
    sistVurdert: localDateTime,
  }),
  object({
    status: z.literal("OPPFYLT"),
    arsaker: z.array(oppfyltArsaker),
    sistVurdert: localDateTime,
  }),
  object({
    status: z.literal("NY"),
  }),
  object({
    status: z.literal("NY_VURDERING"),
  }),
  object({
    status: z.literal("AVVENT"),
    sistVurdert: localDateTime,
  }),
  object({
    status: z.literal("FORHANDSVARSEL"),
    journalpostId: string().optional(),
    sistVurdert: localDateTime,
    fristDato: localDate,
  }),
  object({
    status: z.literal("IKKE_OPPFYLT"),
    sistVurdert: localDateTime,
  }),
  object({
    status: z.literal("IKKE_AKTUELL"),
    sistVurdert: localDateTime,
  }),
]);

export type AktivitetskravVurdering = z.infer<typeof vurderingSchema>;
export type UnntakArsaker = z.infer<typeof unntakArsaker>;
export type OppfyltArsaker = z.infer<typeof oppfyltArsaker>;
