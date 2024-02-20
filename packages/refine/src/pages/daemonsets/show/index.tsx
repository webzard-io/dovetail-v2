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
import { useTranslation } from 'react-i18next';

export const DaemonSetShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  return (
    <PageShow<WorkloadModel>
      showConfig={{
        groups: [
          {
            fields: [ImageField(i18n)],
          },
        ],
        tabs: [PodsField(), ConditionsField(i18n)],
      }}
      Dropdown={WorkloadDropdown}
    />
  );
};
