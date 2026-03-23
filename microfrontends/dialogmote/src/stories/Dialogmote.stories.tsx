import { MainPanel } from "@esyfo/shared/components";
import type { Meta, StoryObj } from "@storybook/react";
import { BodyContent, HeadingContent, TagContent } from "../language/text";

const meta = {
  component: MainPanel,
  title: "Dialogmøte/Panel",
} satisfies Meta<typeof MainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InnkallingIkkeSvart: Story = {
  args: {
    headingText: HeadingContent.dialogmote,
    bodyText: "Du har fått innkalling til dialogmøte",
    href: "#/moteinnkalling",
    alertStyle: "warning",
    panelId: "dialogmote-panel",
    tag: {
      text: TagContent.ikkeSvart,
      variant: "warning-moderate",
    },
  },
};

export const InnkallingTakketJa: Story = {
  args: {
    headingText: HeadingContent.dialogmote,
    bodyText: "Du har fått innkalling til dialogmøte",
    href: "#/moteinnkalling",
    alertStyle: "warning",
    panelId: "dialogmote-panel",
    tag: {
      text: TagContent.takketJa,
      variant: "success-moderate",
    },
  },
};

export const InnkallingOnskerAvlyse: Story = {
  args: {
    headingText: HeadingContent.dialogmote,
    bodyText: "Du har fått innkalling til dialogmøte",
    href: "#/moteinnkalling",
    alertStyle: "warning",
    panelId: "dialogmote-panel",
    tag: {
      text: TagContent.onskerAvlyse,
      variant: "neutral-moderate",
    },
  },
};

export const InnkallingOnskerEndre: Story = {
  args: {
    headingText: HeadingContent.dialogmote,
    bodyText: "Du har fått innkalling til dialogmøte",
    href: "#/moteinnkalling",
    alertStyle: "warning",
    panelId: "dialogmote-panel",
    tag: {
      text: TagContent.onskerEndre,
      variant: "neutral-moderate",
    },
  },
};

export const NyttTidStedIkkeSvart: Story = {
  args: {
    headingText: HeadingContent.dialogmote,
    bodyText: BodyContent.motetFlyttet,
    href: "#/moteinnkalling",
    alertStyle: "warning",
    panelId: "dialogmote-panel",
    tag: {
      text: TagContent.seEndringer,
      variant: "warning-moderate",
    },
  },
};

export const NyttTidStedTakketJa: Story = {
  args: {
    headingText: HeadingContent.dialogmote,
    bodyText: BodyContent.motetFlyttet,
    href: "#/moteinnkalling",
    alertStyle: "warning",
    panelId: "dialogmote-panel",
    tag: {
      text: TagContent.takketJa,
      variant: "success-moderate",
    },
  },
};
