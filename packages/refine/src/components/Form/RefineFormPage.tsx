import { Button, Space } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useParsed } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceConfig } from '../../types';
import { RefineFormContent } from './RefineFormContent';
import { useRefineForm } from './useRefineForm';

type Props = {
  config: ResourceConfig<any>;
};

export const RefineFormPage = (props: Props) => {
  const { config } = props;
  const { t } = useTranslation();
  const { id } = useParsed();
  const { formResult } = useRefineForm({
    config,
    id: id as string,
  });
  const action = id ? 'edit' : 'create';

  const {
    refineCore: { onFinish },
    getValues,
    saveButtonProps,
  } = formResult;

  const onClick = () => {
    const data = getValues();
    onFinish(data);
  };

  return (
    <Space
      direction="vertical"
      className={css`
        width: 100%;
      `}
    >
      <RefineFormContent config={config} formResult={formResult} action={action} />;
      <Button {...saveButtonProps} onClick={onClick}>
        {action === 'create' ? t('dovetail.create') : t('dovetail.edit')}
      </Button>
    </Space>
  );
};
