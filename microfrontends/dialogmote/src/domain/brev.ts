import type { BrevDto } from "@schema/brevSchema.ts";

export const getLatestBrev = (brevList: BrevDto[]): BrevDto | null =>
  brevList
    .filter((b) => b.brevType !== "REFERAT_ENDRET")
    .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())
    .at(0) ?? null;

export const shouldShowDialogmotePanel = (
  latestBrev: BrevDto | null,
): latestBrev is BrevDto =>
  latestBrev?.brevType === "INNKALT" ||
  latestBrev?.brevType === "NYTT_TID_STED";
