import { Typo, useUIKit } from '@cloudtower/eagle';
import { cx, css } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

const MoreTriggerStyle = css`
  color: #bec1d2;
`;

export const ImageNames: React.FC<{ value: string[] }> = ({ value }) => {
  const kit = useUIKit();
  const { t } = useTranslation();

  return (
    <div>
      <div>{value[0]}</div>
      {value.length > 1 && (
        <kit.tooltip
          title={
            <>
              {value.slice(1).map((name, index) => {
                return <div key={index}>{name}</div>;
              })}
            </>
          }
        >
          <div className={cx(Typo.Label.l4_regular, MoreTriggerStyle)}>
            +{value.length - 1} {t('dovetail.more')}
          </div>
        </kit.tooltip>
      )}
    </div>
  );
};
