import React from 'react';
import YamlForm from 'src/components/YamlForm';
import { BASE_INIT_VALUE } from 'src/constants/k8s';
import { ResourceModel } from '../../../models';
import { ResourceConfig } from '../../../types';

type Props<Model extends ResourceModel> = {
  config: ResourceConfig<Model>;
};

export function ResourceForm<Model extends ResourceModel>(props: Props<Model>) {
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
