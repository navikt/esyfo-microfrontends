import type { BrevDTO } from "../../schema/brevSchema.ts";

const sortBrevArray = (brev: BrevDTO[]): BrevDTO[] => {
    if (brev && brev.length > 0) {
        return brev
            .filter((brev) => brev.brevType !== "REFERAT_ENDRET")
            .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
    }

    return [];
}

export const getLatestBrev = (brev: BrevDTO[]): BrevDTO => {
    // TODO: test with empty array []
    const brevArraySorted = sortBrevArray(brev);

    return brevArraySorted[0];
}

export const getShowDialogmotePanel = (latestBrev: BrevDTO): boolean => {
    return (latestBrev.brevType === "INNKALT" || latestBrev.brevType === "NYTT_TID_STED");
}