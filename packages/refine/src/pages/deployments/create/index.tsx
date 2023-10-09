import { useUIKit } from '@cloudtower/eagle';
import { FormProps } from 'antd/lib/form';
import React from 'react';
import { YamlEditorComponent } from 'src/components/YamlEditor/YamlEditorComponent';
import { BASE_INIT_VALUE } from 'src/constants/k8s';
import useEagleForm from 'src/hooks/useEagleForm';


export const DeploymentForm: React.FC<FormProps> = () => {
  const { formProps, saveButtonProps, editorProps } = useEagleForm();
  const kit = useUIKit();

  return (
    <kit.form
      {...formProps}
      initialValues={formProps.initialValues ?? {
        ...BASE_INIT_VALUE,
        spec: {
          replicas: 1,
          selector: {
            matchLabels: {
              'workload.user.cattle.io/workloadselector':
                'apps.deployment-default-undefined',
            },
          },
          template: {
            metadata: {
              labels: {
                'workload.user.cattle.io/workloadselector':
                  'apps.deployment-default-undefined',
              },
            },
            spec: {
              containers: [{
                name: '',
                image: '',
              }]
            }
          }
        }
      }}
      style={{
        width: '800px',
      }}
      layout="horizontal"
    >
      <kit.form.Item>
        {
          editorProps.schema ? (
            <YamlEditorComponent
              {...editorProps}
              schema={editorProps.schema}
              collapsable={false}
            />
          ) : (
            <kit.loading />
          )
        }
      </kit.form.Item>
      <kit.form.Item>
        <kit.button {...saveButtonProps} type="primary">
          Save
        </kit.button>
      </kit.form.Item>
    </kit.form>
  );
};
