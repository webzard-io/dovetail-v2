import { IResourceComponentsProps } from '@refinedev/core';
import { ResourceModel } from 'k8s-api-provider';
import React from 'react';
import { Resource, WithId } from '../../../types';
import { PageShow } from '../../PageShow';
import { ShowField } from '../../ShowContent';

type Props<
  Raw extends Resource,
  Model extends ResourceModel,
> = IResourceComponentsProps & {
  formatter?: (v: Raw) => Model;
  filedGroups: ShowField<Model>[][];
  Dropdown?: React.FC<{ data: Model }>;
};

export function ResourceShow<Raw extends Resource, Model extends ResourceModel>(
  props: Props<Raw, Model>
) {
  const { formatter, filedGroups, Dropdown } = props;

  return (
    <PageShow<WithId<Raw>, Model>
      fieldGroups={filedGroups}
      formatter={formatter}
      Dropdown={Dropdown}
    />
  );
}
