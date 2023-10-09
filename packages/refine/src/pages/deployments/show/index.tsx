import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import {
  ConditionsField,
  ImageField,
  ReplicaField,
  ShowField,
} from '../../../components/Show/Fields';
import { PageShow } from '../../../components/Show/PageShow';
import { PodsList } from './PodsList';

const secondLineFields: ShowField[] = [ImageField, ReplicaField];
const tabFields: ShowField[] = [
  {
    key: 'pods',
    title: 'Pods',
    path: [],
    render: () => {
      return <PodsList />;
    },
  },
  ConditionsField,
];

export const DeploymentShow: React.FC<IResourceComponentsProps> = () => {
  return <PageShow fieldGroups={[[], secondLineFields, tabFields]} />;
};
