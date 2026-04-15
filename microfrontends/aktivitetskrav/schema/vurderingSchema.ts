import { iso, literal, object, string, union, z } from "zod";

const localDateTime = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?$/,
    "Invalid ISO datetime",
  );
const apiDateTime = z.union([iso.datetime(), localDateTime]);
const apiDate = z.union([iso.date(), apiDateTime]);

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
    sistVurdert: apiDateTime,
  }),
  object({
    status: z.literal("OPPFYLT"),
    arsaker: z.array(oppfyltArsaker),
    sistVurdert: apiDateTime,
  }),
  object({
    status: z.literal("NY"),
  }),
  object({
    status: z.literal("NY_VURDERING"),
  }),
  object({
    status: z.literal("AVVENT"),
    sistVurdert: apiDateTime,
  }),
  object({
    status: z.literal("FORHANDSVARSEL"),
    journalpostId: string().optional(),
    sistVurdert: apiDateTime,
    fristDato: apiDate,
  }),
  object({
    status: z.literal("IKKE_OPPFYLT"),
    sistVurdert: apiDateTime,
  }),
  object({
    status: z.literal("IKKE_AKTUELL"),
    sistVurdert: apiDateTime,
  }),
]);

export type AktivitetskravVurdering = z.infer<typeof vurderingSchema>;
export type UnntakArsaker = z.infer<typeof unntakArsaker>;
export type OppfyltArsaker = z.infer<typeof oppfyltArsaker>;
