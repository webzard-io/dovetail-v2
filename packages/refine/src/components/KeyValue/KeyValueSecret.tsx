import { Button, Icon } from '@cloudtower/eagle';
import {
  ViewEye16GradientGrayIcon,
  EntityFilterIgnoreGradient16GrayIcon,
} from '@cloudtower/icons-react';
import { css } from '@linaria/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyValue } from './KeyValue';

export interface KeyValueSecretProps {
  data: Record<string, string>;
}

export function KeyValueSecret(props: KeyValueSecretProps) {
  const { data = {} } = props;
  const { i18n } = useTranslation();
  const [hideSecret, setHideSecret] = useState(true);

  const toggleButton = Object.keys(data).length ? (
    <Button
      prefixIcon={
        <Icon
          src={
            hideSecret ? ViewEye16GradientGrayIcon : EntityFilterIgnoreGradient16GrayIcon
          }
        />
      }
      onClick={() => setHideSecret(v => !v)}
      size="small"
      className={css`
        align-self: flex-end;
        justify-self: flex-start;
      `}
    >
      {hideSecret
        ? i18n.t('dovetail.show_data_value')
        : i18n.t('dovetail.hide_data_value')}
    </Button>
  ) : null;

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: 100%;
      `}
    >
      {toggleButton}
      <KeyValue
        data={data}
        hideSecret={hideSecret}
        empty={i18n.t('dovetail.no_resource', { kind: i18n.t('dovetail.data') })}
      />
    </div>
  );
}
