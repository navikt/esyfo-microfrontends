import type { Meta, StoryObj } from "@storybook/react";
import { MainPanel } from "./MainPanel";

const meta = {
  component: MainPanel,
  title: "Shared/MainPanel",
} satisfies Meta<typeof MainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  href: "#",
};

export const InfoAlert: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "info",
    headingText: "Aktivitetskravet ditt vurderes",
    bodyText: "NAV vurderer aktivitetskravet ditt",
  },
};

export const SuccessAlert: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "success",
    headingText: "NAV har vurdert",
    bodyText: "Aktivitetskravet ditt er oppfylt",
  },
};

export const WarningAlert: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "warning",
    headingText: "Dialogmøte",
    bodyText: "Tirsdag 15. april 2025 kl. 14:00",
  },
};

export const ErrorAlert: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "error",
    headingText: "NAV har vurdert",
    bodyText: "Aktivitetskravet ditt er ikke oppfylt",
  },
};

export const WithInfoTag: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "info",
    headingText: "Aktivitetskravet ditt vurderes",
    bodyText: "NAV vurderer aktivitetskravet ditt",
    tag: {
      text: "Vurdert 1. mars 2025",
      variant: "info-moderate",
    },
  },
};

export const WithSuccessTag: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "success",
    headingText: "NAV har vurdert",
    bodyText: "Aktivitetskravet ditt er oppfylt",
    tag: {
      text: "Vurdert 1. mars 2025",
      variant: "success-moderate",
    },
  },
};

export const WithWarningTag: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "warning",
    headingText: "Dialogmøte",
    bodyText: "Tirsdag 15. april 2025 kl. 14:00",
    tag: {
      text: "Svarfrist 15. april 2025",
      variant: "warning-moderate",
    },
  },
};

export const WithErrorTag: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "warning",
    headingText: "Dialogmøte",
    bodyText: "Tirsdag 15. april 2025 kl. 14:00",
    tag: {
      text: "Frist utgått",
      variant: "error-moderate",
    },
  },
};

export const WithNeutralTag: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "warning",
    headingText: "Dialogmøte",
    bodyText: "Tirsdag 15. april 2025 kl. 14:00",
    tag: {
      text: "Ønsker å avlyse",
      variant: "neutral-moderate",
    },
  },
};
