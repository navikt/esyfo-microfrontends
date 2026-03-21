import "@navikt/ds-css/dist/global/tokens.css";
import "@navikt/ds-css/dist/global/baseline.css";
import "@navikt/ds-css/dist/global/fonts.css";
import "@navikt/ds-css/dist/component/typography.css";
import "@navikt/ds-css/dist/component/tag.css";
import {
  CheckmarkCircleFillIcon,
  ChevronRightIcon,
  ExclamationmarkTriangleFillIcon,
  InformationSquareFillIcon,
  XMarkOctagonFillIcon,
} from "@navikt/aksel-icons";
import { Heading, Tag } from "@navikt/ds-react";
import styles from "./MainPanel.module.css";

export interface TagMeta {
  text: string;
  variant:
    | "info-moderate"
    | "success-moderate"
    | "warning-moderate"
    | "error-moderate";
}

export interface MainPanelProps {
  headingText: string;
  bodyText: string;
  href: string;
  alertStyle: "info" | "success" | "warning" | "error";
  tag?: TagMeta;
}

const alertIconMap = {
  info: { icon: InformationSquareFillIcon, className: styles.infoIcon },
  success: { icon: CheckmarkCircleFillIcon, className: styles.successIcon },
  warning: {
    icon: ExclamationmarkTriangleFillIcon,
    className: styles.warningIcon,
  },
  error: { icon: XMarkOctagonFillIcon, className: styles.errorIcon },
};

export function MainPanel({
  headingText,
  bodyText,
  href,
  alertStyle,
  tag,
}: MainPanelProps) {
  const { icon: AlertIcon, className: alertClassName } =
    alertIconMap[alertStyle];

  return (
    <a
      href={href}
      className={styles.chevronPanel}
      id="mikrofrontend__linkPanel"
    >
      <div className={styles.headingRow}>
        <Heading
          className={`${styles.headingSpacing} ${styles.headingTitle}`}
          size="small"
          level="2"
        >
          {headingText}
        </Heading>
        <div className={styles.chevronSection}>
          <div className={styles.alertContainer}>
            <AlertIcon className={alertClassName} />
          </div>
          <ChevronRightIcon
            className={styles.chevron}
            fontSize="1.5rem"
            aria-hidden={true}
          />
        </div>
      </div>
      <div className={styles.mainContentRow}>
        <div className={styles.column}>
          <Heading className={styles.mainContentText} size="medium" level="3">
            {bodyText}
          </Heading>
          {tag && (
            <Tag
              className={styles.containedTag}
              size="small"
              variant={tag.variant}
            >
              {tag.text}
            </Tag>
          )}
        </div>
      </div>
    </a>
  );
}
