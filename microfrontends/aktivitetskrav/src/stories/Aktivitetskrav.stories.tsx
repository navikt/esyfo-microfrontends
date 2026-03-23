import { MainPanel } from "@esyfo/shared/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: MainPanel,
  title: "Aktivitetskrav/Panel",
} satisfies Meta<typeof MainPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const UnderArbeid: Story = {
  args: {
    headingText: "Aktivitetskravet ditt vurderes",
    bodyText: "Vi vurderer om du oppfyller aktivitetskravet",
    href: "#",
    alertStyle: "info",
    panelId: "aktivitetskrav-panel",
  },
};

export const Unntak: Story = {
  args: {
    headingText: "NAV har vurdert aktivitetskravet ditt",
    bodyText: "Du har fått unntak fra aktivitetskravet",
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
    headingText: "NAV har vurdert aktivitetskravet ditt",
    bodyText: "Du oppfyller aktivitetskravet",
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
    headingText: "Aktivitetskravet ditt vurderes",
    bodyText: "Du har fått et forhåndsvarsel om aktivitetskravet",
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
    headingText: "Aktivitetskravet ditt vurderes",
    bodyText: "Du har fått et forhåndsvarsel om aktivitetskravet",
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
    headingText: "NAV har vurdert aktivitetskravet ditt",
    bodyText: "Aktivitetskravet er ikke lenger aktuelt for deg",
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
    headingText: "NAV har vurdert aktivitetskravet ditt",
    bodyText: "Du oppfyller ikke aktivitetskravet",
    href: "#",
    alertStyle: "error",
    panelId: "aktivitetskrav-panel",
    tag: {
      text: "Vurdert 1. mars 2025",
      variant: "error-moderate",
    },
  },
};
