import type { BrevDTO } from "../../schema/brevSchema.ts";

const sortBrevArray = (brev: BrevDTO[]): BrevDTO[] => {
  if (brev && brev.length > 0) {
    return brev
      .filter((brev) => brev.brevType !== "REFERAT_ENDRET")
      .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
  }

  return [];
};

export const getLatestBrev = (brev: BrevDTO[]): BrevDTO | null => {
  const brevArraySorted = sortBrevArray(brev);

  if (brevArraySorted.length === 0) {
    return null;
  }

  return brevArraySorted[0];
};

export const getShowDialogmotePanel = (latestBrev: BrevDTO | null): boolean => {
  if (latestBrev === null) {
    return false;
  }

  return latestBrev.brevType === "INNKALT" || latestBrev.brevType === "NYTT_TID_STED";
};
