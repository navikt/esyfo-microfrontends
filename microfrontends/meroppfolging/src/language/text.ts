import { getShortDateFormat } from "@esyfo/shared/dateUtils";

export const HeadingContent = {
  senOppfolging: "Snart slutt på sykepengene",
  kartlegging: "Kartlegging av din situasjon",
} as const;

export const BodyContent = {
  senOppfolgingNoResponse: (maxDate: string | null | undefined) => {
    const maxDateText = maxDate
      ? `${maxDate} er din siste dag med sykepenger.`
      : "Det nærmer seg siste dag du kan motta sykepenger.";

    return `${maxDateText} Vi ber deg vurdere situasjonen din.`;
  },
  senOppfolgingTrengerOppfolging:
    "Du har svart at du ønsker oppfølging. Du får beskjed når vi har vurdert behovet ditt.",
  senOppfolgingTrengerIkkeOppfolging:
    "Du har svart at du ikke trenger oppfølging nå. Du må ta kontakt hvis situasjonen din endrer seg.",
  kartleggingNotResponded:
    "Vi ber deg svare på tre spørsmål om ditt sykefravær.",
  kartleggingSubmitted: "Se svarene du har sendt til Nav.",
} as const;

export const TagContent = {
  noResponse: "Du har ikke svart",
  responded: (date: string) => `Du svarte den ${getShortDateFormat(date)}`,
} as const;
