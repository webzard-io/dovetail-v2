import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { ResourceModel } from '../../../model';
import { Resource, WithId } from '../../../types';
import { PageShow } from '../../PageShow';
import { ShowField } from '../../ShowContent';

type Props<Model extends ResourceModel> = IResourceComponentsProps & {
  formatter: (v: Resource) => Model;
  filedGroups: ShowField<Model>[][];
};

export function ResourceShow<Raw extends Resource, Model extends ResourceModel>(
  props: Props<Model>
) {
  const { formatter, filedGroups } = props;

  return <PageShow<WithId<Raw>, Model> fieldGroups={filedGroups} formatter={formatter} />;
}
