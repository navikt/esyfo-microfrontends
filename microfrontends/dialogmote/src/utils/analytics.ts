import type { AmplitudeEvent } from "@navikt/nav-dekoratoren-moduler";
import { getAnalyticsInstance } from "@navikt/nav-dekoratoren-moduler";

type ExtendedAmpltitudeEvent = AmplitudeEvent<
  "navigere",
  { lenketekst: string }
>;

const analyticsLogger = getAnalyticsInstance<ExtendedAmpltitudeEvent>(
  "dialogmote-microfrontend",
);

export const logUmamiEvent = async (
  event: string,
  data?: Record<string, string>,
) => {
  await analyticsLogger(event, data);
};
