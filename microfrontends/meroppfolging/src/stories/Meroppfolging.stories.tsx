import { MainPanel } from "@esyfo/shared/components";
import type { Meta, StoryObj } from "@storybook/react";
import { resolvePanel } from "../domain/panelResolver";
import {
  createKartleggingNoResponse,
  createKartleggingSubmitted,
  createSenOppfolgingNoResponse,
  createSenOppfolgingTrengerIkkeOppfolging,
  createSenOppfolgingTrengerOppfolging,
} from "../domain/test-utils/meroppfolgingStatus";

const meta = {
  title: "Meroppfolging",
  component: MainPanel,
} satisfies Meta<typeof MainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;
const sspsUrl = "/syk/meroppfolging";
const kartleggingUrl = "/syk/meroppfolging/kartlegging";
const evaluatedAt = new Date("2024-06-15T12:00:00.000Z");
const resolveStoryArgs = (...args: Parameters<typeof resolvePanel>) => {
  const panel = resolvePanel(...args);

  if (!panel) {
    throw new Error("Expected panel props for story");
  }

  return panel;
};

export const SenOppfolgingIkkeSvart: Story = {
  name: "Sen oppfølging — ikke svart",
  args: resolveStoryArgs(
    createSenOppfolgingNoResponse(),
    sspsUrl,
    kartleggingUrl,
    evaluatedAt,
  ),
};

export const SenOppfolgingTrengerOppfolging: Story = {
  name: "Sen oppfølging — trenger oppfølging",
  args: resolveStoryArgs(
    createSenOppfolgingTrengerOppfolging(),
    sspsUrl,
    kartleggingUrl,
    evaluatedAt,
  ),
};

export const SenOppfolgingTrengerIkkeOppfolging: Story = {
  name: "Sen oppfølging — trenger ikke oppfølging",
  args: resolveStoryArgs(
    createSenOppfolgingTrengerIkkeOppfolging(),
    sspsUrl,
    kartleggingUrl,
    evaluatedAt,
  ),
};

export const KartleggingIkkeSvart: Story = {
  name: "Kartlegging — ikke svart",
  args: resolveStoryArgs(
    createKartleggingNoResponse(),
    sspsUrl,
    kartleggingUrl,
    evaluatedAt,
  ),
};

export const KartleggingSvart: Story = {
  name: "Kartlegging — svart",
  args: resolveStoryArgs(
    createKartleggingSubmitted(),
    sspsUrl,
    kartleggingUrl,
    evaluatedAt,
  ),
};
