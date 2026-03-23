import { MainPanel } from "@esyfo/shared/components";
import type { BrevDto, SvarTypeDto } from "@schema/brevSchema";
import type { Meta, StoryObj } from "@storybook/react";
import { resolvePanel } from "../domain/panelResolver";
import { createBrev } from "../domain/test-utils/brev";

const meta = {
  title: "Dialogmote",
  component: MainPanel,
} satisfies Meta<typeof MainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const createSvar = (svarType: SvarTypeDto): NonNullable<BrevDto["svar"]> => ({
  svarTidspunkt: "2024-01-20T10:00:00.000Z",
  svarType,
  svarTekst: null,
});

export const InnkaltIkkeSvart: Story = {
  args: resolvePanel(
    createBrev({ brevType: "INNKALT", svar: null, lestDato: null }),
  ),
};

export const InnkaltTakketJa: Story = {
  args: resolvePanel(
    createBrev({ brevType: "INNKALT", svar: createSvar("KOMMER") }),
  ),
};

export const InnkaltOnskerAvlyse: Story = {
  args: resolvePanel(
    createBrev({ brevType: "INNKALT", svar: createSvar("KOMMER_IKKE") }),
  ),
};

export const InnkaltOnskerEndre: Story = {
  args: resolvePanel(
    createBrev({ brevType: "INNKALT", svar: createSvar("NYTT_TID_STED") }),
  ),
};

export const NyttTidStedIkkeSvart: Story = {
  args: resolvePanel(
    createBrev({ brevType: "NYTT_TID_STED", svar: null, lestDato: null }),
  ),
};

export const NyttTidStedTakketJa: Story = {
  args: resolvePanel(
    createBrev({ brevType: "NYTT_TID_STED", svar: createSvar("KOMMER") }),
  ),
};
