import { Button, Icon } from '@cloudtower/eagle';
import { ViewEye16GradientGrayIcon, EntityFilterIgnoreGradient16GrayIcon } from '@cloudtower/icons-react';
import { css } from '@linaria/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShowGroupComponent } from '../ShowContent/ShowContent';
import { KeyValue } from './KeyValue';

const ButtonStyle = css`
  &.ant-btn-quiet.ant-btn {
    color: rgba(44, 56, 82, 0.75);
  }
`;

export interface KeyValueSecretProps {
  data: Record<string, string>;
}

export function KeyValueSecret(props: KeyValueSecretProps) {
  const { data = {} } = props;
  const { i18n } = useTranslation();
  const [hideSecret, setHideSecret] = useState(true);

  const toggleButton = (
    <Button
      type="quiet"
      prefixIcon={<Icon src={hideSecret ? ViewEye16GradientGrayIcon : EntityFilterIgnoreGradient16GrayIcon} />}
      onClick={() => setHideSecret(v => !v)}
      className={ButtonStyle}
      size="small"
    >
      {hideSecret
        ? i18n.t('dovetail.show_data_value')
        : i18n.t('dovetail.hide_data_value')}
    </Button>
  );

  return (
    <ShowGroupComponent title={i18n.t('dovetail.data')} operationEle={toggleButton}>
      <KeyValue data={data} hideSecret={hideSecret} empty={i18n.t('dovetail.no_resource', { kind: i18n.t('dovetail.data') })} />
    </ShowGroupComponent>
  );
}
