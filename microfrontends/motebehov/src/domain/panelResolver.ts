import { MOTEBEHOV_URL } from "astro:env/server";
import type { MainPanelProps } from "@esyfo/shared/components";

export const resolvePanel = (): MainPanelProps => {
  return {
    headingText: "Dialogmøte med NAV",
    bodyText: "Trenger du et dialogmøte?",
    href: `${MOTEBEHOV_URL}/motebehov/svar`,
    alertStyle: "warning",
    panelId: "motebehov-panel",
    tag: { text: "Du har ikke svart", variant: "warning-moderate" },
  };
};
