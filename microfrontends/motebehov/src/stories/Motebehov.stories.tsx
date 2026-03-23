import { MainPanel } from "@esyfo/shared/components";
import type { Meta, StoryObj } from "@storybook/react";
import { BodyContent, HeadingContent, TagContent } from "../language/text";

const meta = {
  component: MainPanel,
  title: "Møtebehov/Panel",
} satisfies Meta<typeof MainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TrengerDuDialogmote: Story = {
  args: {
    headingText: HeadingContent.dialogmote,
    bodyText: BodyContent.trengerDuDialogmote,
    href: "#/motebehov/svar",
    alertStyle: "warning",
    panelId: "motebehov-panel",
    tag: { text: TagContent.ikkeSvart, variant: "warning-moderate" },
  },
};
