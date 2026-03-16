import type { SvarTypeDTO } from "../../schema/brevSchema.ts";

type SvarTypeAnalytics =
  | "KOMMER"
  | "ONSKER_AVLYSE"
  | "ONSKER_ENDRING"
  | "IKKE_SVART";

export const attendingToSvartypeAnalytics = (
  attending: SvarTypeDTO | null,
): SvarTypeAnalytics => {
  switch (attending) {
    case "KOMMER":
      return "KOMMER";
    case "KOMMER_IKKE":
      return "ONSKER_AVLYSE";
    case "NYTT_TID_STED":
      return "ONSKER_ENDRING";
    default:
      return "IKKE_SVART";
  }
};
