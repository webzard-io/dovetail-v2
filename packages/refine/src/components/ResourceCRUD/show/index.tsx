import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { ResourceModel } from '../../../models';
import { ResourceConfig } from '../../../types';
import { PageShow } from '../../PageShow';

type Props<Model extends ResourceModel> = IResourceComponentsProps & {
  config: ResourceConfig<Model>;
};

export function ResourceShow<Model extends ResourceModel>(props: Props<Model>) {
  const { formatter, showConfig, Dropdown } = props.config;

  return (
    <PageShow<Model>
      showConfig={showConfig?.() || {}}
      formatter={formatter}
      Dropdown={Dropdown}
    />
  );
}
