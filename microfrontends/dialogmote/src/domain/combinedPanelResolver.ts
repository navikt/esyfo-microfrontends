import type { MainPanelProps } from "@esyfo/shared/components";
import type { BrevDto } from "@schema/brevSchema";
import type { MotebehovStatusDto } from "@schema/motebehovSchema";

import { shouldShowDialogmotePanel } from "./brev";
import { shouldShowMotebehovPanel } from "./motebehov";
import { resolveMotebehovPanel } from "./motebehovPanelResolver";
import { resolvePanel } from "./panelResolver";

export const resolveCombinedPanel = (
  latestBrev: BrevDto | null,
  motebehov: MotebehovStatusDto,
  href: string,
): MainPanelProps | null => {
  if (shouldShowDialogmotePanel(latestBrev)) {
    return resolvePanel(latestBrev, href);
  }

  if (shouldShowMotebehovPanel(motebehov)) {
    return resolveMotebehovPanel(href);
  }

  return null;
};
