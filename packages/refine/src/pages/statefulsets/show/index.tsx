import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { i18n } = useTranslation();

  return (
    <PageShow<WorkloadModel>
      showConfig={{
        groups: [
          {
            fields: [ImageField(i18n), ReplicaField(i18n)],
          },
        ],
        tabs: [PodsField(), ConditionsField(i18n)],
      }}
      Dropdown={WorkloadDropdown}
    />
  );
};
