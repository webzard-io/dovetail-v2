import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageShow } from '../../../components/PageShow';
import {
  ConditionsField,
  ImageField,
  PodsField,
  ReplicaField,
} from '../../../components/ShowContent/fields';

export const StatefulSetShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  return (
    <PageShow
      fieldGroups={[
        [],
        [ImageField(i18n), ReplicaField(i18n)],
        [PodsField(i18n), ConditionsField(i18n)],
      ]}
    />
  );
};
