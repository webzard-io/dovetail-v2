import { Button, Icon } from '@cloudtower/eagle';
import { ViewEye16GrayIcon } from '@cloudtower/icons-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShowGroup } from '../ShowContent/ShowContent';
import { KeyValue } from './KeyValue';

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
      prefixIcon={<Icon src={ViewEye16GrayIcon} />}
      onClick={() => setHideSecret(v => !v)}
    >
      {hideSecret
        ? i18n.t('dovetail.show_data_value')
        : i18n.t('dovetail.hide_data_value')}
    </Button>
  );

  return (
    <ShowGroup title={i18n.t('dovetail.data')} operationEle={toggleButton}>
      <KeyValue data={data} hideSecret={hideSecret} />
    </ShowGroup>
  );
}
