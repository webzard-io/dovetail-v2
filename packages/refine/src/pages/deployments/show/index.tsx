import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { FormType } from 'src/types';
import { PageShow } from '../../../components/PageShow';
import {
  ConditionsField,
  ImageField,
  PodsField,
  ReplicaField,
} from '../../../components/ShowContent/fields';
import { WorkloadDropdown } from '../../../components/WorkloadDropdown';
import { WorkloadModel } from '../../../models';

export const DeploymentShow: React.FC<IResourceComponentsProps> = () => {

  return (
    <PageShow<WorkloadModel>
      fieldGroups={[
        [],
        [ImageField(), ReplicaField()],
        [PodsField(), ConditionsField()],
      ]}
      Dropdown={WorkloadDropdown}
    />
  );
};
