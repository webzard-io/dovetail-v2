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
      showConfig={{
        groups: [{
          fields: [ImageField(), ReplicaField()]
        }],
        tabs: [PodsField(), ConditionsField()]
      }}
      Dropdown={WorkloadDropdown}
    />
  );
};
