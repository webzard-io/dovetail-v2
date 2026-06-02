import { Icon, Tooltip } from '@cloudtower/eagle';
import {
  ClipboardCopy16GradientBlueIcon,
  ClipboardCopy16GradientGrayIcon,
} from '@cloudtower/icons-react';
import { css, cx } from '@linaria/core';
import copyToClipboard from 'copy-to-clipboard';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CopyIconStyle = css`
  cursor: pointer;
  margin: 1px 0;
`;

export type CopyButtonProps = {
  /** 需要复制到剪贴板的内容。 */
  value: string;
  className?: string;
};

export const CopyButton: React.FC<CopyButtonProps> = ({ value, className }) => {
  const { i18n } = useTranslation();
  const [tooltip, setTooltip] = useState(i18n.t('dovetail.copy'));

  return (
    <Tooltip
      title={tooltip}
      onVisibleChange={visible => {
        if (!visible) {
          setTimeout(() => {
            setTooltip(i18n.t('dovetail.copy'));
          }, 80);
        }
      }}
    >
      <Icon
        src={ClipboardCopy16GradientGrayIcon}
        hoverSrc={ClipboardCopy16GradientBlueIcon}
        className={cx(CopyIconStyle, className)}
        iconWidth={16}
        iconHeight={16}
        onClick={() => {
          copyToClipboard(value);
          setTooltip(i18n.t('dovetail.copied'));
        }}
      />
    </Tooltip>
  );
};
