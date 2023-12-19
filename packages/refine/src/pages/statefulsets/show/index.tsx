import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { WorkloadDropdown } from 'src/components/WorkloadDropdown';
import { PageShow } from '../../../components/PageShow';
import {
  ConditionsField,
  ImageField,
  PodsField,
  ReplicaField,
} from '../../../components/ShowContent/fields';
import { WorkloadModel } from '../../../models';

export const StatefulSetShow: React.FC<IResourceComponentsProps> = () => {
  return (
    <PageShow<WorkloadModel>
      fieldGroups={[[], [ImageField(), ReplicaField()], [PodsField(), ConditionsField()]]}
      Dropdown={WorkloadDropdown}
    />
  );
};
