import { MainPanel } from "@esyfo/shared/components";
import type { Meta, StoryObj } from "@storybook/react";
import { resolvePanel } from "../domain/panelResolver";
import {
  createAvvent,
  createForhandsvarsel,
  createIkkeAktuell,
  createNyVurdering,
  createNyVurderingStatus,
  createOppfylt,
  createUnntak,
} from "../domain/test-utils/vurdering";

const meta = {
  title: "Aktivitetskrav",
  component: MainPanel,
} satisfies Meta<typeof MainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;
const href = "/syk/aktivitetskrav";
const now = new Date("2024-06-01T12:00:00.000Z");
const resolveStoryArgs = (...args: Parameters<typeof resolvePanel>) => {
  const panel = resolvePanel(...args);

  if (!panel) {
    throw new Error("Expected panel props for story");
  }

  return panel;
};

export const Ny: Story = {
  args: resolveStoryArgs(createNyVurdering(), href, now),
};

export const NyVurdering: Story = {
  args: resolveStoryArgs(createNyVurderingStatus(), href, now),
};

export const Avvent: Story = {
  args: resolveStoryArgs(createAvvent(), href, now),
};

export const Unntak: Story = {
  args: resolveStoryArgs(createUnntak(), href, now),
};

export const Oppfylt: Story = {
  args: resolveStoryArgs(createOppfylt(), href, now),
};

export const ForhandsvarselForFrist: Story = {
  args: resolveStoryArgs(
    createForhandsvarsel({ fristDato: "2024-07-01T00:00:00.000Z" }),
    href,
    now,
  ),
};

export const ForhandsvarselUtenJournalpost: Story = {
  args: resolveStoryArgs(
    createForhandsvarsel({ journalpostId: undefined }),
    href,
    now,
  ),
};

export const ForhandsvarselEtterFrist: Story = {
  args: resolveStoryArgs(
    createForhandsvarsel({ fristDato: "2024-05-01T00:00:00.000Z" }),
    href,
    now,
  ),
};

export const IkkeAktuell: Story = {
  args: resolveStoryArgs(createIkkeAktuell(), href, now),
};
