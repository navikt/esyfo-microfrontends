import type { MainPanelProps } from "@esyfo/shared/components";
import type {
  KartleggingStatusDto,
  MeroppfolgingStatusDto,
  SenoppfolgingStatusDto,
} from "@schema/meroppfolgingStatusSchema";
import { isRespondedWithinOneWeek } from "@src/domain/dateRules";
import { BodyContent, HeadingContent, TagContent } from "@src/language/text";

const withPanelId = (
  panel: Omit<MainPanelProps, "panelId">,
): MainPanelProps => ({
  ...panel,
  panelId: "meroppfolging-panel",
});

const resolveSenOppfolgingNoResponse = (
  senOppfolgingStatus: SenoppfolgingStatusDto,
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
  senOppfolgingStatus: SenoppfolgingStatusDto,
  responseStatus: "TRENGER_OPPFOLGING" | "TRENGER_IKKE_OPPFOLGING",
  href: string,
  now: Date,
): MainPanelProps | undefined => {
  if (!isRespondedWithinOneWeek(senOppfolgingStatus.responseDateTime, now)) {
    return undefined;
  }

  return withPanelId({
    headingText: HeadingContent.senOppfolging,
    bodyText: getSenOppfolgingResponseBody(responseStatus),
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
  kartleggingStatus: KartleggingStatusDto,
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
  senOppfolgingStatus: SenoppfolgingStatusDto,
  href: string,
  now: Date,
): MainPanelProps | undefined => {
  switch (senOppfolgingStatus.responseStatus) {
    case "NO_RESPONSE":
      return resolveSenOppfolgingNoResponse(senOppfolgingStatus, href);
    case "TRENGER_OPPFOLGING":
    case "TRENGER_IKKE_OPPFOLGING":
      return resolveSenOppfolgingResponded(
        senOppfolgingStatus,
        senOppfolgingStatus.responseStatus,
        href,
        now,
      );
  }
};

const resolveKartlegging = (
  kartleggingStatus: KartleggingStatusDto,
  href: string,
): MainPanelProps | undefined => {
  switch (kartleggingStatus.responseStatus) {
    case "NO_RESPONSE":
      return resolveKartleggingNoResponse(href);
    case "SUBMITTED":
      if (!kartleggingStatus.responseDateTime) {
        return resolveKartleggingNoResponse(href);
      }
      return resolveKartleggingSubmitted(kartleggingStatus, href);
  }
};

export const resolvePanel = (
  status: MeroppfolgingStatusDto,
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
