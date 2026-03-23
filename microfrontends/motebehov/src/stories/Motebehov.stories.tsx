import { MainPanel } from "@esyfo/shared/components";
import type { Meta, StoryObj } from "@storybook/react";
import { resolvePanel } from "../domain/panelResolver";

const meta = {
  title: "Motebehov",
  component: MainPanel,
} satisfies Meta<typeof MainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TrengerDuDialogmote: Story = {
  args: resolvePanel(),
};
