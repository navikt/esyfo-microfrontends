import type { MainPanelProps } from "@esyfo/shared/components";
import { BodyContent, HeadingContent, TagContent } from "@src/language/text";

export const resolveMotebehovPanel = (href: string): MainPanelProps => {
  return {
    headingText: HeadingContent.dialogmote,
    bodyText: BodyContent.trengerDuDialogmote,
    href: `${href}/motebehov/svar`,
    alertStyle: "warning",
    panelId: "motebehov-panel",
    tag: { text: TagContent.ikkeSvart, variant: "warning-moderate" },
  };
};
