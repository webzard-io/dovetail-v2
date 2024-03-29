import { Button, Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ValueDisplay from 'src/components/ValueDisplay';
import { KeyValue } from './KeyValue';

const WrapperStyle = css`
  width: 100%;
`;
const HeaderStyle = css`
  width: 100%;
  display: flex;
  align-items: center;

  &.expanded {
    margin-bottom: 8px;
  }
`;
const HeaderItemStyle = css`
  margin-right: 8px;
  line-height: 18px;
`;
const ExpandButtonStyle = css`
  &.ant-btn.ant-btn-link {
    height: 18px;
    line-height: 18px;
    font-size: 12px;
  }
`;

export interface KeyValueDataProps {
  data: Record<string, string>;
  expandable?: boolean;
}

export function KeyValueAnnotation(props: KeyValueDataProps) {
  const { data = {}, expandable } = props;
  const [isExpand, setIsExpand] = useState(expandable ? false : true);
  const { t } = useTranslation();

  return (
    <div className={WrapperStyle}>
      <div className={cx(HeaderStyle, isExpand && 'expanded')}>
        {Object.keys(data).length ? (
          <>
            <span className={HeaderItemStyle}>{Object.keys(data).length}</span>
            <Button
              type="link"
              className={cx(ExpandButtonStyle, Typo.Label.l4_regular_title)}
              onClick={() => {
                setIsExpand(!isExpand);
              }}
            >
              {isExpand ? t('dovetail.fold') : t('dovetail.expand')}
            </Button>
          </>
        ) : <ValueDisplay value="" />}
      </div>
      {isExpand ? <KeyValue data={data} /> : null}
    </div>
  );
}
