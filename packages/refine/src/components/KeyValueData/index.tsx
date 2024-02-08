import { useUIKit, Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const WrapperStyle = css`
  width: 100%;
`;
const HeaderStyle = css`
  width: 100%;
  display: flex;
  justify-content: space-space-between;
  align-items: center;
  margin-bottom: 8px;
`;
const HeaderItemStyle = css`
  flex: 1;
`;
const ExpandButtonStyle = css`
  &.ant-btn.ant-btn-link {
    height: 22px;
    font-size: 12px;
  }
`;
const ContentBlockStyle = css`
  display: flex;
  padding: 8px 10px;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  border-radius: 4px;
  background: rgba(237, 241, 250, 0.60);

  &:not(:last-of-type) {
    margin-bottom: 8px;
  }
`;
const KeyStyle = css`
  color: rgba(44, 56, 82, 0.60);
`;

export interface KeyValueDataProps {
  datas: Record<string, string>;
  expandable?: boolean;
}

export function KeyValueData(props: KeyValueDataProps) {
  const { datas, expandable } = props;
  const [isExpand, setIsExpand] = useState(expandable ? false : true);
  const kit = useUIKit();
  const { t } = useTranslation();

  return (
    <div className={WrapperStyle}>
      <div className={HeaderStyle}>
        <span className={HeaderItemStyle}>{Object.keys(datas).length}</span>
        <kit.button
          type="link"
          className={ExpandButtonStyle}
          onClick={()=> {
            setIsExpand(!isExpand);
          }}
        >
          {isExpand ? t('dovetail.fold') : t('dovetail.expand')}
        </kit.button>
      </div>
      {
        isExpand ? (
          Object.keys(datas).map(key => (
            <div key={key} className={ContentBlockStyle}>
              <span className={cx(KeyStyle, Typo.Label.l4_regular)}>{key}</span>
              <span className={Typo.Label.l4_regular}>{datas[key]}</span>
            </div>
          ))
        ) : null
      }
    </div>
  );
}
