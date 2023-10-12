import { FormProps } from 'antd/lib/form';
import React from 'react';
import YamlForm from 'src/components/YamlForm';
import { BASE_INIT_VALUE } from 'src/constants/k8s';

export const PodForm: React.FC<FormProps> = () => {
  return (
    <YamlForm
      initialValues={{
        apiVersion: 'v1',
        kind: 'Pod',
        ...BASE_INIT_VALUE,
        spec: {
          containers: [
            {
              name: '',
              image: '',
            },
          ],
        },
      }}
    />
  );
};
