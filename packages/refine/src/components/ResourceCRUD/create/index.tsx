import { FormProps } from 'antd/lib/form';
import { ResourceModel } from 'k8s-api-provider';
import React from 'react';
import YamlForm from 'src/components/YamlForm';
import { BASE_INIT_VALUE } from 'src/constants/k8s';
import { Resource, ResourceConfig } from '../../../types';

type Props<Raw extends Resource, Model extends ResourceModel> = {
  config: ResourceConfig<Raw, Model>;
};

export function ResourceForm<Raw extends Resource, Model extends ResourceModel>(
  props: Props<Raw, Model>
) {
  const { config } = props;
  return (
    <YamlForm
      initialValues={
        config.initValue || {
          apiVersion: config.apiVersion,
          kind: config.kind,
          ...BASE_INIT_VALUE,
          spec: {},
        }
      }
    />
  );
}
