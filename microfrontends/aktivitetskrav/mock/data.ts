import { addDaysToDate } from "@esyfo/shared/dateUtils";
import type { AktivitetskravVurdering } from "schema/vurderingSchema";

const nyKandidatVurdering: AktivitetskravVurdering = {
  status: "NY",
};

const unntakVurdering: AktivitetskravVurdering = {
  status: "UNNTAK",
  sistVurdert: addDaysToDate(new Date(), -5),
  arsaker: ["MEDISINSKE_GRUNNER"],
};

const oppfyltVurdering: AktivitetskravVurdering = {
  status: "OPPFYLT",
  sistVurdert: addDaysToDate(new Date(), -5),
  arsaker: ["TILTAK"],
};

const ikkeAktuellVurdering: AktivitetskravVurdering = {
  status: "IKKE_AKTUELL",
  sistVurdert: addDaysToDate(new Date(), -5),
};

const avventVurdering: AktivitetskravVurdering = {
  status: "AVVENT",
  sistVurdert: addDaysToDate(new Date(), -5),
};

const forhaandsvarselVurdering: AktivitetskravVurdering = {
  status: "FORHANDSVARSEL",
  sistVurdert: addDaysToDate(new Date(), -5),
  journalpostId: "123",
  fristDato: addDaysToDate(new Date(), 14),
};

export const mockData = {
  nyKandidatVurdering,
  unntakVurdering,
  oppfyltVurdering,
  ikkeAktuellVurdering,
  forhaandsvarselVurdering,
  avventVurdering,
};
