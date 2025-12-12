import type { MotebehovStatusDTO } from "../../schema/motebehovSchema.ts";

export const getShowMotebehovPanel = (motebehov: MotebehovStatusDTO): boolean => {
    return motebehov &&
        motebehov.visMotebehov === true &&
        motebehov.skjemaType === "SVAR_BEHOV" &&
        motebehov.motebehov === null;
};