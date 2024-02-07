import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { ResourceModel } from '../../../models';
import { PageShow } from '../../PageShow';
import { ShowConfig } from '../../ShowContent';

type Props<Model extends ResourceModel> = IResourceComponentsProps & {
  formatter?: (v: Model) => Model;
  showConfig: ShowConfig<Model>;
  Dropdown?: React.FC<{ record: Model }>;
};

export function ResourceShow<Model extends ResourceModel>(props: Props<Model>) {
  const { formatter, showConfig, Dropdown } = props;

  return (
    <PageShow<Model>
      showConfig={showConfig}
      formatter={formatter}
      Dropdown={Dropdown}
    />
  );
}
