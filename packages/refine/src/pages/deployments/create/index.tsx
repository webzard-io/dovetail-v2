import { FormProps } from 'antd/lib/form';
import React from 'react';
import YamlForm from 'src/components/YamlForm';
import { BASE_INIT_VALUE } from 'src/constants/k8s';

export const DeploymentForm: React.FC<FormProps> = () => {
  return (
    <YamlForm
      initialValues={{
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
    />
  );
};
