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
  name: "Innkalt — ikke svart",
  args: resolvePanel(
    createBrev({ brevType: "INNKALT", svar: null, lestDato: null }),
    href,
  ),
};

export const InnkaltTakketJa: Story = {
  name: "Innkalt — takket ja",
  args: resolvePanel(
    createBrev({ brevType: "INNKALT", svar: createSvar("KOMMER") }),
    href,
  ),
};

export const InnkaltOnskerAvlyse: Story = {
  name: "Innkalt — ønsker avlyse",
  args: resolvePanel(
    createBrev({ brevType: "INNKALT", svar: createSvar("KOMMER_IKKE") }),
    href,
  ),
};

export const InnkaltOnskerEndre: Story = {
  name: "Innkalt — ønsker endre",
  args: resolvePanel(
    createBrev({ brevType: "INNKALT", svar: createSvar("NYTT_TID_STED") }),
    href,
  ),
};

export const NyttTidStedIkkeSvart: Story = {
  name: "Nytt tid/sted — ikke svart",
  args: resolvePanel(
    createBrev({ brevType: "NYTT_TID_STED", svar: null, lestDato: null }),
    href,
  ),
};

export const NyttTidStedTakketJa: Story = {
  name: "Nytt tid/sted — takket ja",
  args: resolvePanel(
    createBrev({ brevType: "NYTT_TID_STED", svar: createSvar("KOMMER") }),
    href,
  ),
};

export const NyttTidStedOnskerAvlyse: Story = {
  name: "Nytt tid/sted — ønsker avlyse",
  args: resolvePanel(
    createBrev({
      brevType: "NYTT_TID_STED",
      svar: createSvar("KOMMER_IKKE"),
    }),
    href,
  ),
};

export const NyttTidStedOnskerEndre: Story = {
  name: "Nytt tid/sted — ønsker endre",
  args: resolvePanel(
    createBrev({
      brevType: "NYTT_TID_STED",
      svar: createSvar("NYTT_TID_STED"),
    }),
    href,
  ),
};
