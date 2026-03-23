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
    headingText: "Informasjon",
    bodyText: "Dette er en informasjonsmelding",
  },
};

export const SuccessAlert: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "success",
    headingText: "Fullført",
    bodyText: "Denne oppgaven er fullført",
  },
};

export const WarningAlert: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "warning",
    headingText: "Obs!",
    bodyText: "Denne oppgaven krever din oppmerksomhet",
  },
};

export const ErrorAlert: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "error",
    headingText: "Feil",
    bodyText: "Noe gikk galt",
  },
};

export const WithInfoTag: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "info",
    headingText: "Informasjon",
    bodyText: "Dette er en informasjonsmelding",
    tag: {
      text: "Info-tag",
      variant: "info-moderate",
    },
  },
};

export const WithSuccessTag: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "success",
    headingText: "Fullført",
    bodyText: "Denne oppgaven er fullført",
    tag: {
      text: "Suksess-tag",
      variant: "success-moderate",
    },
  },
};

export const WithWarningTag: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "warning",
    headingText: "Obs!",
    bodyText: "Denne oppgaven krever din oppmerksomhet",
    tag: {
      text: "Advarsel-tag",
      variant: "warning-moderate",
    },
  },
};

export const WithErrorTag: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "error",
    headingText: "Feil",
    bodyText: "Noe gikk galt",
    tag: {
      text: "Feil-tag",
      variant: "error-moderate",
    },
  },
};

export const WithNeutralTag: Story = {
  args: {
    ...defaultArgs,
    alertStyle: "warning",
    headingText: "Obs!",
    bodyText: "Denne oppgaven krever din oppmerksomhet",
    tag: {
      text: "Nøytral-tag",
      variant: "neutral-moderate",
    },
  },
};
