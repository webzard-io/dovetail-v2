import { Button, Typo, Icon } from '@cloudtower/eagle';
import {
  ArrowChevronDown16BlueIcon,
  ArrowChevronUp16BlueIcon,
} from '@cloudtower/icons-react';
import { css, cx } from '@linaria/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TitleWrapperStyle = css`
  color: $gray-120;
  padding: 7px 0;
  line-height: 18px;
  box-shadow: 0px -1px 0px 0px rgba(225, 230, 241, 0.6) inset;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;
const ButtonStyle = css`
  &.ant-btn.ant-btn-link {
    height: 18px;
  }
`;

export interface SectionTitleProps {
  title: string;
  collapsable?: boolean;
  defaultCollapse?: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SectionTitle(props: SectionTitleProps) {
  const {
    title,
    collapsable = true,
    defaultCollapse = false,
    children,
    className,
    contentClassName,
  } = props;

  const { t } = useTranslation();
  const [collapse, setCollapse] = useState(defaultCollapse);

  return (
    <div className={cx(className)}>
      <div className={cx(TitleWrapperStyle)}>
        <span className={Typo.Label.l4_bold_title}>{title}</span>
        {collapsable ? (
          <Button
            type="link"
            size="small"
            className={cx(ButtonStyle)}
            onClick={() => setCollapse(!collapse)}
          >
            {collapse ? t('dovetail.expand') : t('dovetail.fold')}
            <Icon
              style={{ marginLeft: 4 }}
              src={collapse ? ArrowChevronDown16BlueIcon : ArrowChevronUp16BlueIcon}
            />
          </Button>
        ) : null}
      </div>
      <div
        className={cx(contentClassName)}
        style={{ display: collapse ? 'none' : 'block' }}
      >
        {children}
      </div>
    </div>
  );
}
