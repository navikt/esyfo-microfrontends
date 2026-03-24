import type { MainPanelProps } from "@esyfo/shared/components";
import type {
  KartleggingStatusDTO,
  MerOppfolgingStatusDTO,
  SenOppfolgingStatusDTO,
} from "@schema/merOppfolgingStatusSchema";
import { BodyContent, HeadingContent, TagContent } from "@src/language/text";

const withPanelId = (
  panel: Omit<MainPanelProps, "panelId">,
): MainPanelProps => ({
  ...panel,
  panelId: "meroppfolging-panel",
});

const resolveSenOppfolgingNoResponse = (
  senOppfolgingStatus: SenOppfolgingStatusDTO,
  href: string,
): MainPanelProps =>
  withPanelId({
    headingText: HeadingContent.senOppfolging,
    bodyText: BodyContent.senOppfolgingNoResponse(senOppfolgingStatus.maxDate),
    href,
    alertStyle: "info",
    tag: {
      variant: "warning-moderate",
      text: TagContent.noResponse,
    },
  });

const isRecentResponse = (responseDateTime: string, now: Date): boolean => {
  const responseDate = new Date(responseDateTime);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return responseDate > oneWeekAgo;
};

const getSenOppfolgingResponseBody = (
  responseStatus: "TRENGER_OPPFOLGING" | "TRENGER_IKKE_OPPFOLGING",
): string => {
  switch (responseStatus) {
    case "TRENGER_OPPFOLGING":
      return BodyContent.senOppfolgingTrengerOppfolging;
    case "TRENGER_IKKE_OPPFOLGING":
      return BodyContent.senOppfolgingTrengerIkkeOppfolging;
  }
};

const resolveSenOppfolgingResponded = (
  senOppfolgingStatus: SenOppfolgingStatusDTO,
  href: string,
  now: Date,
): MainPanelProps | undefined => {
  if (!senOppfolgingStatus.responseDateTime) {
    return undefined;
  }

  if (!isRecentResponse(senOppfolgingStatus.responseDateTime, now)) {
    return undefined;
  }

  return withPanelId({
    headingText: HeadingContent.senOppfolging,
    bodyText: getSenOppfolgingResponseBody(senOppfolgingStatus.responseStatus),
    href,
    alertStyle: "info",
    tag: {
      variant: "success-moderate",
      text: TagContent.responded(senOppfolgingStatus.responseDateTime),
    },
  });
};

const resolveKartleggingNoResponse = (href: string): MainPanelProps =>
  withPanelId({
    headingText: HeadingContent.kartlegging,
    bodyText: BodyContent.kartleggingNotResponded,
    href,
    alertStyle: "info",
    tag: {
      variant: "warning-moderate",
      text: TagContent.noResponse,
    },
  });

const resolveKartleggingSubmitted = (
  kartleggingStatus: KartleggingStatusDTO,
  href: string,
): MainPanelProps =>
  withPanelId({
    headingText: HeadingContent.kartlegging,
    bodyText: BodyContent.kartleggingSubmitted,
    href,
    alertStyle: "info",
    tag: {
      variant: "success-moderate",
      text: TagContent.responded(kartleggingStatus.responseDateTime ?? ""),
    },
  });

const resolveSenOppfolging = (
  senOppfolgingStatus: SenOppfolgingStatusDTO,
  href: string,
  now: Date,
): MainPanelProps | undefined => {
  switch (senOppfolgingStatus.responseStatus) {
    case "NO_RESPONSE":
      return resolveSenOppfolgingNoResponse(senOppfolgingStatus, href);
    case "TRENGER_OPPFOLGING":
    case "TRENGER_IKKE_OPPFOLGING":
      return resolveSenOppfolgingResponded(senOppfolgingStatus, href, now);
  }
};

const resolveKartlegging = (
  kartleggingStatus: KartleggingStatusDTO,
  href: string,
): MainPanelProps => {
  switch (kartleggingStatus.responseStatus) {
    case "NO_RESPONSE":
      return resolveKartleggingNoResponse(href);
    case "SUBMITTED":
      return resolveKartleggingSubmitted(kartleggingStatus, href);
  }
};

export const resolvePanel = (
  status: MerOppfolgingStatusDTO,
  sspsUrl: string,
  kartleggingUrl: string,
  now: Date,
): MainPanelProps | undefined => {
  switch (status.oppfolgingsType) {
    case "INGEN_OPPFOLGING":
      return undefined;
    case "SEN_OPPFOLGING":
      return resolveSenOppfolging(status.senOppfolgingStatus, sspsUrl, now);
    case "KARTLEGGING":
      return resolveKartlegging(status.kartleggingStatus, kartleggingUrl);
  }
};
