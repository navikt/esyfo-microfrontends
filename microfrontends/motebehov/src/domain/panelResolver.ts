import { MOTEBEHOV_URL } from "astro:env/server";
import type { MainPanelProps } from "@esyfo/shared/components";
import { BodyContent, HeadingContent, TagContent } from "@src/language/text";

export const resolvePanel = (): MainPanelProps => {
  return {
    headingText: HeadingContent.dialogmote,
    bodyText: BodyContent.trengerDuDialogmote,
    href: `${MOTEBEHOV_URL}/motebehov/svar`,
    alertStyle: "warning",
    panelId: "motebehov-panel",
    tag: { text: TagContent.ikkeSvart, variant: "warning-moderate" },
  };
};
