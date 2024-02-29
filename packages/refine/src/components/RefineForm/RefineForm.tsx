import { Button, Space } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useForm } from '@refinedev/react-hook-form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceModel } from '../../models';
import { ResourceConfig } from '../../types';
import { RefineFormContent } from './RefineFormContent';

type Props<Model extends ResourceModel> = {
  config: ResourceConfig<Model>;
  action: 'create' | 'edit';
};

export const RefineForm = <Model extends ResourceModel>(props: Props<Model>) => {
  const { config, action } = props;
  const { t } = useTranslation();
  const {
    refineCore: { onFinish },
    getValues,
    saveButtonProps,
    control,
  } = useForm<Model>({
    mode: 'onChange',
    refineCoreProps: {
      resource: config.name,
      action,
    },
    defaultValues: config?.initValue,
  });

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
      <RefineFormContent config={config} control={control} />;
      <Button {...saveButtonProps} onClick={onClick}>
        {action === 'create' ? t('dovetail.create') : t('dovetail.edit')}
      </Button>
    </Space>
  );
};
