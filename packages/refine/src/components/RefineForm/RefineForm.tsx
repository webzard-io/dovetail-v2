import { Button, Space } from '@cloudtower/eagle';
import { useForm } from '@refinedev/react-hook-form';
import React from 'react';
import { ResourceModel } from '../../models';
import { ResourceConfig } from '../../types';
import { RefineFormContent } from './RefineFormContent';

type Props<Model extends ResourceModel> = {
  config: ResourceConfig<Model>;
  action: 'create' | 'edit';
};

export const RefineForm = <Model extends ResourceModel>(props: Props<Model>) => {
  const { config, action } = props;
  const {
    refineCore: { onFinish },
    getValues,
    saveButtonProps,
    control,
  } = useForm<Model>({
    refineCoreProps: {
      resource: config.name,
      action,
    },
    defaultValues: config?.initValue,
  });

  const onClick = () => {
    const data = getValues();
    console.log(getValues());
    onFinish(data);
  };

  return (
    <Space direction="vertical">
      <RefineFormContent config={config} control={control} />;
      <Button {...saveButtonProps} onClick={onClick}>
        Submit
      </Button>
    </Space>
  );
};
