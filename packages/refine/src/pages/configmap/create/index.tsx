import { useUIKit } from '@cloudtower/eagle';
import { FormProps } from 'antd/lib/form';
import React from 'react';
import { KeyValueListWidget } from '../../../components/Form/KeyValueListWidget';
import { MetadataWidget } from '../../../components/Form/MetadataForm';
import useEagleForm from '../../../hooks/useEagleForm';

export const ConfigmapForm: React.FC<FormProps> = () => {
  const { formProps, saveButtonProps } = useEagleForm();
  const kit = useUIKit();

  return (
    <kit.form
      {...formProps}
      onFinish={formProps.onFinish}
      style={{
        width: '500px'
      }}
      layout="horizontal"
    >
      <MetadataWidget />
      <kit.form.Item name={['data']} label="Data">
        <KeyValueListWidget />
      </kit.form.Item>
      <kit.form.Item>
        <kit.button
          {...saveButtonProps}
          type="primary"
        >Save</kit.button>
      </kit.form.Item>
    </kit.form>
  );
};
