import { MainPanel } from "@esyfo/shared/components";
import type { MeroppfolgingStatusDto } from "@schema/meroppfolgingStatusSchema";
import type { Meta, StoryObj } from "@storybook/react";
import { resolvePanel } from "../domain/panelResolver";

const meta = {
  title: "Meroppfolging",
  component: MainPanel,
} satisfies Meta<typeof MainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;
const sspsUrl = "/syk/meroppfolging";
const kartleggingUrl = "/syk/meroppfolging/kartlegging";
const now = new Date("2024-06-15T12:00:00.000Z");
const resolveStoryArgs = (...args: Parameters<typeof resolvePanel>) => {
  const panel = resolvePanel(...args);

  if (!panel) {
    throw new Error("Expected panel props for story");
  }

  return panel;
};

const senOppfolgingIkkeSvart: MeroppfolgingStatusDto = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "NO_RESPONSE",
    hasAccessToSenOppfolging: true,
    responseDateTime: null,
    maxDate: "31. desember 2024",
  },
};

const senOppfolgingTrengerOppfolging: MeroppfolgingStatusDto = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "TRENGER_OPPFOLGING",
    hasAccessToSenOppfolging: true,
    responseDateTime: "2024-06-15T10:00:00.000Z",
    maxDate: null,
  },
};

const senOppfolgingTrengerIkkeOppfolging: MeroppfolgingStatusDto = {
  oppfolgingsType: "SEN_OPPFOLGING",
  senOppfolgingStatus: {
    responseStatus: "TRENGER_IKKE_OPPFOLGING",
    hasAccessToSenOppfolging: true,
    responseDateTime: "2024-06-15T09:00:00.000Z",
    maxDate: null,
  },
};

const kartleggingIkkeSvart: MeroppfolgingStatusDto = {
  oppfolgingsType: "KARTLEGGING",
  kartleggingStatus: {
    responseStatus: "NO_RESPONSE",
    hasAccessToKartlegging: true,
    responseDateTime: null,
  },
};

const kartleggingSvart: MeroppfolgingStatusDto = {
  oppfolgingsType: "KARTLEGGING",
  kartleggingStatus: {
    responseStatus: "SUBMITTED",
    hasAccessToKartlegging: true,
    responseDateTime: "2024-06-15T11:00:00.000Z",
  },
};

export const SenOppfolgingIkkeSvart: Story = {
  name: "Sen oppfølging — ikke svart",
  args: resolveStoryArgs(senOppfolgingIkkeSvart, sspsUrl, kartleggingUrl, now),
};

export const SenOppfolgingTrengerOppfolging: Story = {
  name: "Sen oppfølging — trenger oppfølging",
  args: resolveStoryArgs(
    senOppfolgingTrengerOppfolging,
    sspsUrl,
    kartleggingUrl,
    now,
  ),
};

export const SenOppfolgingTrengerIkkeOppfolging: Story = {
  name: "Sen oppfølging — trenger ikke oppfølging",
  args: resolveStoryArgs(
    senOppfolgingTrengerIkkeOppfolging,
    sspsUrl,
    kartleggingUrl,
    now,
  ),
};

export const KartleggingIkkeSvart: Story = {
  name: "Kartlegging — ikke svart",
  args: resolveStoryArgs(kartleggingIkkeSvart, sspsUrl, kartleggingUrl, now),
};

export const KartleggingSvart: Story = {
  name: "Kartlegging — svart",
  args: resolveStoryArgs(kartleggingSvart, sspsUrl, kartleggingUrl, now),
};
