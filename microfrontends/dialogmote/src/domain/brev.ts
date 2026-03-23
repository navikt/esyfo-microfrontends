import type { BrevDto } from "@schema/brevSchema.ts";

export const getLatestBrev = (brevList: BrevDto[]): BrevDto | null =>
  brevList
    .filter((b) => b.brevType !== "REFERAT_ENDRET")
    .sort(
      (a, b) =>
        new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
    )
    .at(0) ?? null;

export const getShowDialogmotePanel = (latestBrev: BrevDto | null): boolean => {
  if (latestBrev === null) {
    return false;
  }

  return (
    latestBrev.brevType === "INNKALT" || latestBrev.brevType === "NYTT_TID_STED"
  );
};
