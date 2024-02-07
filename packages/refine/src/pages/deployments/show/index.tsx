import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { PageShow } from '../../../components/PageShow';
import {
  ConditionsField,
  EventsTableTabField,
  ImageField,
  PodsField,
  ReplicaField,
} from '../../../components/ShowContent/fields';
import { WorkloadDropdown } from '../../../components/WorkloadDropdown';
import { WorkloadModel } from '../../../models';

export const DeploymentShow: React.FC<IResourceComponentsProps> = () => {
  return (
    <PageShow<WorkloadModel>
      showConfig={{
        groups: [{
          fields: [ImageField(), ReplicaField()]
        }],
        tabs: [PodsField(), ConditionsField(), EventsTableTabField()],
      }}
      Dropdown={WorkloadDropdown}
    />
  );
};
