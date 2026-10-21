import { MainPanel } from "@esyfo/shared/components";
import type { Meta, StoryObj } from "@storybook/react";

import { resolveMotebehovPanel } from "../domain/motebehovPanelResolver";

const meta = {
  title: "Møtebehov",
  component: MainPanel,
} satisfies Meta<typeof MainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const href = "/syk/dialogmoter/sykmeldt";

export const TrengerDuDialogmote: Story = {
  name: "Trenger du dialogmøte?",
  args: resolveMotebehovPanel(href),
};
