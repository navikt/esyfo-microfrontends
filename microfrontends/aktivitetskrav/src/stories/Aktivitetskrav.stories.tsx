import { MainPanel } from "@esyfo/shared/components";
import type { Meta, StoryObj } from "@storybook/react";
import { resolvePanel } from "../domain/panelResolver";
import {
  createAvvent,
  createForhandsvarsel,
  createIkkeAktuell,
  createIkkeOppfylt,
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

export const Ny: Story = {
  args: resolvePanel(createNyVurdering(), href, now),
};

export const NyVurdering: Story = {
  args: resolvePanel(createNyVurderingStatus(), href, now),
};

export const Avvent: Story = {
  args: resolvePanel(createAvvent(), href, now),
};

export const Unntak: Story = {
  args: resolvePanel(createUnntak(), href, now),
};

export const Oppfylt: Story = {
  args: resolvePanel(createOppfylt(), href, now),
};

export const ForhandsvarselForFrist: Story = {
  args: resolvePanel(
    createForhandsvarsel({ fristDato: "2024-07-01T00:00:00.000Z" }),
    href,
    now,
  ),
};

export const ForhandsvarselUtenJournalpost: Story = {
  args: resolvePanel(
    createForhandsvarsel({ journalpostId: undefined }),
    href,
    now,
  ),
};

export const ForhandsvarselEtterFrist: Story = {
  args: resolvePanel(
    createForhandsvarsel({ fristDato: "2024-05-01T00:00:00.000Z" }),
    href,
    now,
  ),
};

export const IkkeAktuell: Story = {
  args: resolvePanel(createIkkeAktuell(), href, now),
};
