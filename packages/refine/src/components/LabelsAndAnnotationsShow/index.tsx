import { css } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';
import { KeyValue } from 'src/components/KeyValue';
import { Tags } from 'src/components/Tags';
import { SmallSectionTitleStyle } from 'src/styles/show';

const ItemWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface LabelsAndAnnotationsShowProps {
  labels: Record<string, string>;
  annotations: Record<string, string>;
  size?: 'small' | 'medium';
}

export const LabelsAndAnnotationsShow = ({
  labels,
  annotations,
  size = 'medium',
}: LabelsAndAnnotationsShowProps) => {
  const { i18n: sksI18n } = useTranslation();

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
      `}
      style={{
        padding: size === 'small' ? '12px' : '16px 24px',
        gap: size === 'small' ? '12px' : '16px',
      }}
    >
      <div className={ItemWrapperStyle}>
        <div className={SmallSectionTitleStyle}>{sksI18n.t('dovetail.label')}</div>
        {Object.keys(labels || {}).length ? (
          <Tags value={labels} />
        ) : (
          <ErrorContent
            errorText={sksI18n.t('dovetail.empty')}
            type={ErrorContentType.Card}
          />
        )}
      </div>
      <div className={ItemWrapperStyle}>
        <div className={SmallSectionTitleStyle}>{sksI18n.t('dovetail.annotation')}</div>
        <KeyValue data={annotations} errorContent={ErrorContentType.Card} />
      </div>
    </div>
  );
};
