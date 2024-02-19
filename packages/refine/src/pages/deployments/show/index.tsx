import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { i18n } = useTranslation();
  return (
    <PageShow<WorkloadModel>
      showConfig={{
        groups: [
          {
            fields: [ImageField(i18n), ReplicaField(i18n)],
          },
        ],
        tabs: [PodsField(), ConditionsField(i18n), EventsTableTabField(i18n)],
      }}
      Dropdown={WorkloadDropdown}
    />
  );
};
