import { MainPanel } from "@esyfo/shared/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: MainPanel,
  title: "Dialogmøte/Panel",
} satisfies Meta<typeof MainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InnkallingIkkeSvart: Story = {
  args: {
    headingText: "Dialogmøte",
    bodyText: "Tirsdag 15. april 2025 kl. 14:00",
    href: "#/moteinnkalling",
    alertStyle: "warning",
    panelId: "dialogmote-panel",
    tag: {
      text: "Ikke svart",
      variant: "warning-moderate",
    },
  },
};

export const InnkallingTakketJa: Story = {
  args: {
    headingText: "Dialogmøte",
    bodyText: "Tirsdag 15. april 2025 kl. 14:00",
    href: "#/moteinnkalling",
    alertStyle: "warning",
    panelId: "dialogmote-panel",
    tag: {
      text: "Takket ja",
      variant: "success-moderate",
    },
  },
};

export const InnkallingOnskerAvlyse: Story = {
  args: {
    headingText: "Dialogmøte",
    bodyText: "Tirsdag 15. april 2025 kl. 14:00",
    href: "#/moteinnkalling",
    alertStyle: "warning",
    panelId: "dialogmote-panel",
    tag: {
      text: "Ønsker å avlyse",
      variant: "neutral-moderate",
    },
  },
};

export const InnkallingOnskerEndre: Story = {
  args: {
    headingText: "Dialogmøte",
    bodyText: "Tirsdag 15. april 2025 kl. 14:00",
    href: "#/moteinnkalling",
    alertStyle: "warning",
    panelId: "dialogmote-panel",
    tag: {
      text: "Ønsker å endre",
      variant: "neutral-moderate",
    },
  },
};

export const NyttTidStedIkkeSvart: Story = {
  args: {
    headingText: "Dialogmøte",
    bodyText: "Møtet er flyttet",
    href: "#/moteinnkalling",
    alertStyle: "warning",
    panelId: "dialogmote-panel",
    tag: {
      text: "Se endringer",
      variant: "warning-moderate",
    },
  },
};

export const NyttTidStedTakketJa: Story = {
  args: {
    headingText: "Dialogmøte",
    bodyText: "Møtet er flyttet",
    href: "#/moteinnkalling",
    alertStyle: "warning",
    panelId: "dialogmote-panel",
    tag: {
      text: "Takket ja",
      variant: "success-moderate",
    },
  },
};
