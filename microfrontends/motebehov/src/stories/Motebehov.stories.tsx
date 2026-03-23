import { MainPanel } from "@esyfo/shared/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: MainPanel,
  title: "Møtebehov/Panel",
} satisfies Meta<typeof MainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TrengerDuDialogmote: Story = {
  args: {
    headingText: "Dialogmøte",
    bodyText: "Trenger du et dialogmøte med arbeidsgiveren din og NAV?",
    href: "#/motebehov/svar",
    alertStyle: "warning",
    panelId: "motebehov-panel",
    tag: { text: "Ikke svart", variant: "warning-moderate" },
  },
};
