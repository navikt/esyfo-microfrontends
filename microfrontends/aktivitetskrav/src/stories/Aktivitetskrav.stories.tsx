import { MainPanel } from "@esyfo/shared/components";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BodyContent,
  BodyDefaultContent,
  HeadingContent,
} from "../language/text";

const meta = {
  component: MainPanel,
  title: "Aktivitetskrav/Panel",
} satisfies Meta<typeof MainPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const UnderArbeid: Story = {
  args: {
    headingText: HeadingContent.vurderer,
    bodyText: BodyContent.underArbeid,
    href: "#",
    alertStyle: "info",
    panelId: "aktivitetskrav-panel",
  },
};

export const Unntak: Story = {
  args: {
    headingText: HeadingContent.harVurdert,
    bodyText: BodyDefaultContent.unntak,
    href: "#",
    alertStyle: "success",
    panelId: "aktivitetskrav-panel",
    tag: {
      text: "Vurdert 1. mars 2025",
      variant: "success-moderate",
    },
  },
};

export const Oppfylt: Story = {
  args: {
    headingText: HeadingContent.harVurdert,
    bodyText: BodyDefaultContent.oppfylt,
    href: "#",
    alertStyle: "success",
    panelId: "aktivitetskrav-panel",
    tag: {
      text: "Vurdert 1. mars 2025",
      variant: "success-moderate",
    },
  },
};

export const ForhandsvarselFørFrist: Story = {
  args: {
    headingText: HeadingContent.vurderer,
    bodyText: BodyContent.forhandsvarsel,
    href: "#",
    alertStyle: "warning",
    panelId: "aktivitetskrav-panel",
    tag: {
      text: "Svarfrist 15. april 2025",
      variant: "warning-moderate",
    },
  },
};

export const ForhandsvarselEtterFrist: Story = {
  args: {
    headingText: HeadingContent.vurderer,
    bodyText: BodyContent.forhandsvarsel,
    href: "#",
    alertStyle: "warning",
    panelId: "aktivitetskrav-panel",
    tag: {
      text: "Svarfrist 15. mars 2025",
      variant: "error-moderate",
    },
  },
};

export const IkkeAktuell: Story = {
  args: {
    headingText: HeadingContent.harVurdert,
    bodyText: BodyContent.ikkeAktuell,
    href: "#",
    alertStyle: "info",
    panelId: "aktivitetskrav-panel",
    tag: {
      text: "Vurdert 1. mars 2025",
      variant: "info-moderate",
    },
  },
};

export const IkkeOppfylt: Story = {
  args: {
    headingText: HeadingContent.harVurdert,
    bodyText: BodyContent.ikkeOppfylt,
    href: "#",
    alertStyle: "error",
    panelId: "aktivitetskrav-panel",
    tag: {
      text: "Vurdert 1. mars 2025",
      variant: "error-moderate",
    },
  },
};
