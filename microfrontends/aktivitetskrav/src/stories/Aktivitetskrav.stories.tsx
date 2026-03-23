import { MainPanel } from "@esyfo/shared/components";
import type { Meta, StoryObj } from "@storybook/react";
import { resolvePanel } from "../domain/panelResolver";
import {
  createForhandsvarsel,
  createIkkeAktuell,
  createIkkeOppfylt,
  createNyVurdering,
  createOppfylt,
  createUnntak,
} from "../domain/test-utils/vurdering";

const meta = {
  title: "Aktivitetskrav",
  component: MainPanel,
} satisfies Meta<typeof MainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;
const href = "/syk/aktivitetskrav";

export const UnderArbeid: Story = {
  args: resolvePanel(createNyVurdering(), href),
};

export const Unntak: Story = {
  args: resolvePanel(createUnntak(), href),
};

export const Oppfylt: Story = {
  args: resolvePanel(createOppfylt(), href),
};

export const ForhandsvarselForFrist: Story = {
  args: resolvePanel(
    createForhandsvarsel({
      fristDato: "2024-07-01T00:00:00.000Z",
    }),
    href,
    new Date("2024-06-01T12:00:00.000Z"),
  ),
};

export const ForhandsvarselEtterFrist: Story = {
  args: resolvePanel(
    createForhandsvarsel({
      fristDato: "2024-05-01T00:00:00.000Z",
    }),
    href,
    new Date("2024-06-01T12:00:00.000Z"),
  ),
};

export const IkkeAktuell: Story = {
  args: resolvePanel(createIkkeAktuell(), href),
};

export const IkkeOppfylt: Story = {
  args: resolvePanel(createIkkeOppfylt(), href),
};
