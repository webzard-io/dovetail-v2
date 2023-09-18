import React from "react";
import useEagleForm from '../../../hooks/useEagleForm';
import { FormProps } from 'antd/lib/form';
import { useUIKit } from '@cloudtower/eagle';
import { MetadataWidget } from '../../../components/Form/MetadataWidget';

export const DeploymentCreate: React.FC<FormProps> = () => {
  const { formProps, saveButtonProps, queryResult } = useEagleForm();
  const kit = useUIKit();

  return (
    <kit.form
      {...formProps}
      onFinish={(values) => {
        (values as any).spec.selector = {
          matchLabels: {
            'workload.user.cattle.io/workloadselector': 'apps.deployment-default-undefined',
          }
        };
        (values as any).spec.template.metadata = {
          labels: {
            'workload.user.cattle.io/workloadselector': 'apps.deployment-default-undefined',
          }
        };
        formProps.onFinish?.(values);
      }}
      style={{
        width: '500px'
      }}
      layout="horizontal"
    >
      <MetadataWidget />
      <kit.form.List name={['spec', 'template', 'spec', 'containers']}>
        {(fields, { add, remove }) => {
          return (
            <kit.form.Item
              label="Containers"
            >
              {
                fields.map((field) => (
                  <>
                    <kit.form.Item label="Container name" name={[field.name, 'name']}>
                      <kit.input></kit.input>
                    </kit.form.Item>
                    <kit.form.Item label="Container image" name={[field.name, 'image']}>
                      <kit.input />
                    </kit.form.Item>
                    <kit.button onClick={() => remove(field.name)} danger>
                      Remove
                    </kit.button>
                  </>
                ))
              }
              <kit.form.Item>
                <kit.button
                  type="primary"
                  onClick={() => {
                    add();
                  }}
                >
                  Add Container
                </kit.button>
              </kit.form.Item>
            </kit.form.Item>
          )
        }}
      </kit.form.List>
      <kit.form.Item>
        <kit.button
          {...saveButtonProps}
          type="primary"
        >Save</kit.button>
      </kit.form.Item>
    </kit.form>
  );
};
