import { IResourceComponentsProps } from '@refinedev/core';
import { Job } from 'kubernetes-types/batch/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageShow } from '../../../components/PageShow';
import {
  ConditionsField,
  ImageField,
  PodsField,
} from '../../../components/ShowContent/fields';
import { JobModel } from '../../../model';
import { WithId } from '../../../types';

export const JobShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  return (
    <PageShow<WithId<Job>, JobModel>
      fieldGroups={[[], [ImageField(i18n)], [PodsField(i18n), ConditionsField(i18n)]]}
      formatter={d => new JobModel(d)}
    />
  );
};
