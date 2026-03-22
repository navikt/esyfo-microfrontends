import type { BrevDto } from "@schema/brevSchema.ts";

const sortBrevArray = (brev: BrevDto[]): BrevDto[] => {
  if (brev && brev.length > 0) {
    return brev
      .filter((brev) => brev.brevType !== "REFERAT_ENDRET")
      .sort(
        (a, b) =>
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
      );
  }

  return [];
};

export const getLatestBrev = (brev: BrevDto[]): BrevDto | null => {
  const brevArraySorted = sortBrevArray(brev);

  if (brevArraySorted.length === 0) {
    return null;
  }

  return brevArraySorted[0];
};

export const getShowDialogmotePanel = (latestBrev: BrevDto | null): boolean => {
  if (latestBrev === null) {
    return false;
  }

  return (
    latestBrev.brevType === "INNKALT" || latestBrev.brevType === "NYTT_TID_STED"
  );
};
