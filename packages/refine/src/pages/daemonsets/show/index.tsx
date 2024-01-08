import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { WorkloadDropdown } from 'src/components/WorkloadDropdown';
import { PageShow } from '../../../components/PageShow';
import {
  ConditionsField,
  ImageField,
  PodsField,
} from '../../../components/ShowContent/fields';
import { WorkloadModel } from '../../../models';

export const DaemonSetShow: React.FC<IResourceComponentsProps> = () => {
  return (
    <PageShow<WorkloadModel>
      fieldGroups={[[], [ImageField()], [PodsField(), ConditionsField()]]}
      Dropdown={WorkloadDropdown}
    />
  );
};
