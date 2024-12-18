import { Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';

const ContentBlockStyle = css`
  display: flex;
  padding: 8px 10px;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  border-radius: 4px;
  background: $gray-a60-1;

  &:not(:last-of-type) {
    margin-bottom: 8px;
  }
`;
const KeyStyle = css`
  color: rgba(44, 56, 82, 0.75);
  width: calc(30% - 4px);
  margin-right: 8px;
  word-break: break-all;
`;
const ValueStyle = css`
  word-break: break-all;
  white-space: pre-wrap;
  width: calc(70% - 4px);
`;

export interface KeyValueProps {
  data: Record<string, string>;
  empty?: string;
  hideSecret?: boolean;
}

export const KeyValue: React.FC<KeyValueProps> = (props: KeyValueProps) => {
  const { data = {}, hideSecret, empty } = props;
  const { t } = useTranslation();

  const result = Object.keys(data).map(key => (
    <div key={key} className={ContentBlockStyle}>
      <span className={cx(KeyStyle, Typo.Label.l4_regular)}>{key}</span>
      <span className={cx(Typo.Label.l4_regular, ValueStyle)}>
        {hideSecret ? toAsterisk(data[key]) : data[key]}
      </span>
    </div>
  ));

  if (!result.length) {
    return <ErrorContent
      errorText={empty || t('dovetail.empty')}
      type={ErrorContentType.Card}
    />;
  }

  return <>{result}</>;
};

function toAsterisk(str: string) {
  return Array(str.length).join('*');
}
