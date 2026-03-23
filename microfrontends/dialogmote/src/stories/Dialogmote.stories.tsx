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
const href = "/syk/dialogmoter/sykmeldt";

const createSvar = (svarType: SvarTypeDto): NonNullable<BrevDto["svar"]> => ({
  svarTidspunkt: "2024-01-20T10:00:00.000Z",
  svarType,
  svarTekst: null,
});

export const InnkaltIkkeSvart: Story = {
  args: resolvePanel(
    createBrev({ brevType: "INNKALT", svar: null, lestDato: null }),
    href,
  ),
};

export const InnkaltTakketJa: Story = {
  args: resolvePanel(
    createBrev({ brevType: "INNKALT", svar: createSvar("KOMMER") }),
    href,
  ),
};

export const InnkaltOnskerAvlyse: Story = {
  args: resolvePanel(
    createBrev({ brevType: "INNKALT", svar: createSvar("KOMMER_IKKE") }),
    href,
  ),
};

export const InnkaltOnskerEndre: Story = {
  args: resolvePanel(
    createBrev({ brevType: "INNKALT", svar: createSvar("NYTT_TID_STED") }),
    href,
  ),
};

export const NyttTidStedIkkeSvart: Story = {
  args: resolvePanel(
    createBrev({ brevType: "NYTT_TID_STED", svar: null, lestDato: null }),
    href,
  ),
};

export const NyttTidStedTakketJa: Story = {
  args: resolvePanel(
    createBrev({ brevType: "NYTT_TID_STED", svar: createSvar("KOMMER") }),
    href,
  ),
};

export const NyttTidStedOnskerAvlyse: Story = {
  args: resolvePanel(
    createBrev({
      brevType: "NYTT_TID_STED",
      svar: createSvar("KOMMER_IKKE"),
    }),
    href,
  ),
};

export const NyttTidStedOnskerEndre: Story = {
  args: resolvePanel(
    createBrev({
      brevType: "NYTT_TID_STED",
      svar: createSvar("NYTT_TID_STED"),
    }),
    href,
  ),
};
