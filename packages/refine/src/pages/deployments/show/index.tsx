import { IResourceComponentsProps } from '@refinedev/core';
import { WorkloadModel } from 'k8s-api-provider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageShow } from '../../../components/PageShow';
import {
  ConditionsField,
  ImageField,
  PodsField,
  ReplicaField,
} from '../../../components/ShowContent/fields';
import { WorkloadDropdown } from '../../../components/WorkloadDropdown';

export const DeploymentShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  return (
    <PageShow<WorkloadModel>
      fieldGroups={[
        [],
        [ImageField(i18n), ReplicaField(i18n)],
        [PodsField(i18n), ConditionsField(i18n)],
      ]}
      Dropdown={WorkloadDropdown}
    />
  );
};
