import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import {
  ConditionsField,
  ImageField,
  ReplicaField,
  ShowField,
} from '../../../components/Show/Fields';
import { PageShow } from '../../../components/Show/PageShow';

const secondLineFields: ShowField[] = [ImageField, ReplicaField];
const thirdLineFields: ShowField[] = [ConditionsField];

export const DeploymentShow: React.FC<IResourceComponentsProps> = () => {
  return <PageShow fieldGroups={[[], secondLineFields, thirdLineFields]} />;
};
