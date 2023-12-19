import { IResourceComponentsProps } from '@refinedev/core';
import { WorkloadModel } from 'k8s-api-provider';
import { StatefulSet } from 'kubernetes-types/apps/v1';
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
import { WithId } from '../../../types';

export const StatefulSetShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  return (
    <PageShow<WithId<StatefulSet>, WorkloadModel>
      fieldGroups={[
        [],
        [ImageField(i18n), ReplicaField(i18n)],
        [PodsField(i18n), ConditionsField(i18n)],
      ]}
      Dropdown={WorkloadDropdown}
    />
  );
};
