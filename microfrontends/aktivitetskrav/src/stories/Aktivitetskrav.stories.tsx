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
  name: "Ny",
  args: resolveStoryArgs(createNyVurdering(), href, now),
};

export const NyVurdering: Story = {
  name: "Ny vurdering",
  args: resolveStoryArgs(createNyVurderingStatus(), href, now),
};

export const Avvent: Story = {
  name: "Avvent",
  args: resolveStoryArgs(createAvvent(), href, now),
};

export const Unntak: Story = {
  name: "Unntak",
  args: resolveStoryArgs(createUnntak(), href, now),
};

export const Oppfylt: Story = {
  name: "Oppfylt",
  args: resolveStoryArgs(createOppfylt(), href, now),
};

export const ForhandsvarselForFrist: Story = {
  name: "Forhåndsvarsel — før frist",
  args: resolveStoryArgs(
    createForhandsvarsel({ fristDato: "2024-07-01T00:00:00.000Z" }),
    href,
    now,
  ),
};

export const ForhandsvarselUtenJournalpost: Story = {
  name: "Forhåndsvarsel — uten journalpost",
  args: resolveStoryArgs(
    createForhandsvarsel({ journalpostId: undefined }),
    href,
    now,
  ),
};

export const ForhandsvarselEtterFrist: Story = {
  name: "Forhåndsvarsel — etter frist",
  args: resolveStoryArgs(
    createForhandsvarsel({ fristDato: "2024-05-01T00:00:00.000Z" }),
    href,
    now,
  ),
};

export const IkkeAktuell: Story = {
  name: "Ikke aktuell",
  args: resolveStoryArgs(createIkkeAktuell(), href, now),
};
