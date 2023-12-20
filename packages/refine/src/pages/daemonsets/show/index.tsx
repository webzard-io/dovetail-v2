import { IResourceComponentsProps } from '@refinedev/core';
import { WorkloadModel } from 'k8s-api-provider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadDropdown } from 'src/components/WorkloadDropdown';
import { PageShow } from '../../../components/PageShow';
import {
  ConditionsField,
  ImageField,
  PodsField,
} from '../../../components/ShowContent/fields';

export const DaemonSetShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  return (
    <PageShow< WorkloadModel>
      fieldGroups={[[], [ImageField(i18n)], [PodsField(i18n), ConditionsField(i18n)]]}
      Dropdown={WorkloadDropdown}
    />
  );
};
