import { FormProps } from 'antd/lib/form';
import React from 'react';
import YamlForm from 'src/components/YamlForm';
import { BASE_INIT_VALUE } from 'src/constants/k8s';
import { ResourceConfig } from '../../../types';

type Props = { config: ResourceConfig } & FormProps;

export const ResourceForm: React.FC<Props> = ({ config }) => {
  return (
    <YamlForm
      initialValues={
        config.initYaml || {
          apiVersion: config.apiVersion,
          kind: config.kind,
          ...BASE_INIT_VALUE,
          spec: {},
        }
      }
    />
  );
};
