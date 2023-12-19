import { IResourceComponentsProps } from '@refinedev/core';
import { ResourceModel } from 'k8s-api-provider';
import React from 'react';
import { PageShow } from '../../PageShow';
import { ShowField } from '../../ShowContent';

type Props<Model extends ResourceModel> = IResourceComponentsProps & {
  formatter?: (v: Model) => Model;
  filedGroups: ShowField<Model>[][];
  Dropdown?: React.FC<{ data: Model }>;
};

export function ResourceShow<Model extends ResourceModel>(props: Props<Model>) {
  const { formatter, filedGroups, Dropdown } = props;

  return (
    <PageShow<Model>
      fieldGroups={filedGroups}
      formatter={formatter}
      Dropdown={Dropdown}
    />
  );
}
