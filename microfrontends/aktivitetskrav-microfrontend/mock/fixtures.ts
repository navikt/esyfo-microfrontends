import type { AktivitetskravVurdering } from "schema/aktivitetskravVurderingSchame";
import { addDaysToDate, subtractDaysFromDate } from "src/utils/dateUtils";

const nyKandidatVurdering: AktivitetskravVurdering = {
  status: "NY",
};

const unntakVurdering: AktivitetskravVurdering = {
  status: "UNNTAK",
  sistVurdert: subtractDaysFromDate(new Date(), 5).toISOString(),
  arsaker: ["MEDISINSKE_GRUNNER"],
};

const oppfyltVurdering: AktivitetskravVurdering = {
  status: "OPPFYLT",
  sistVurdert: subtractDaysFromDate(new Date(), 5).toISOString(),
  arsaker: ["TILTAK"],
};

const ikkeAktuellVurdering: AktivitetskravVurdering = {
  status: "IKKE_AKTUELL",
  sistVurdert: subtractDaysFromDate(new Date(), 5).toISOString(),
};

const avventVurdering: AktivitetskravVurdering = {
  status: "AVVENT",
  sistVurdert: subtractDaysFromDate(new Date(), 5).toISOString(),
};

const forhaandsvarselVurdering: AktivitetskravVurdering = {
  status: "FORHANDSVARSEL",
  sistVurdert: subtractDaysFromDate(new Date(), 5).toISOString(),
  journalpostId: "123",
  fristDato: addDaysToDate(new Date(), 14).toISOString(),
};

const fixtures = {
  nyKandidatVurdering,
  unntakVurdering,
  oppfyltVurdering,
  ikkeAktuellVurdering,
  forhaandsvarselVurdering,
  avventVurdering,
};

export default fixtures;
