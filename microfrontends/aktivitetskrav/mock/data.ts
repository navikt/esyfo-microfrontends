import { addDaysToDate } from "@esyfo/shared/dateUtils";
import type { AktivitetskravVurdering } from "schema/vurderingSchema";

const nyKandidatVurdering: AktivitetskravVurdering = {
  status: "NY",
};

const unntakVurdering: AktivitetskravVurdering = {
  status: "UNNTAK",
  sistVurdert: addDaysToDate(new Date(), -5).toISOString(),
  arsaker: ["MEDISINSKE_GRUNNER"],
};

const oppfyltVurdering: AktivitetskravVurdering = {
  status: "OPPFYLT",
  sistVurdert: addDaysToDate(new Date(), -5).toISOString(),
  arsaker: ["TILTAK"],
};

const ikkeAktuellVurdering: AktivitetskravVurdering = {
  status: "IKKE_AKTUELL",
  sistVurdert: addDaysToDate(new Date(), -5).toISOString(),
};

const avventVurdering: AktivitetskravVurdering = {
  status: "AVVENT",
  sistVurdert: addDaysToDate(new Date(), -5).toISOString(),
};

const forhaandsvarselVurdering: AktivitetskravVurdering = {
  status: "FORHANDSVARSEL",
  sistVurdert: addDaysToDate(new Date(), -5).toISOString(),
  journalpostId: "123",
  fristDato: addDaysToDate(new Date(), 14).toISOString().split("T")[0],
};

export const mockData = {
  nyKandidatVurdering,
  unntakVurdering,
  oppfyltVurdering,
  ikkeAktuellVurdering,
  forhaandsvarselVurdering,
  avventVurdering,
};
