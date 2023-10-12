import { FormProps } from 'antd/lib/form';
import React from 'react';
import YamlForm from 'src/components/YamlForm';
import { BASE_INIT_VALUE } from 'src/constants/k8s';

export const JobForm: React.FC<FormProps> = () => {
  return (
    <YamlForm
      initialValues={{
        apiVersion: 'batch/v1',
        kind: 'Job',
        ...BASE_INIT_VALUE,
        spec: {
          replicas: 1,
          selector: {
            matchLabels: {},
          },
          template: {
            metadata: {
              labels: {},
            },
            spec: {
              containers: [
                {
                  name: '',
                  image: '',
                },
              ],
            },
          },
        },
      }}
    />
  );
};
