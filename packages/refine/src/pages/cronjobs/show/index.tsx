import { IResourceComponentsProps } from '@refinedev/core';
import { CronJob } from 'kubernetes-types/batch/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageShow } from '../../../components/PageShow';
import { ImageField, JobsField } from '../../../components/ShowContent/fields';
import { WorkloadModel } from '../../../model';
import { WithId } from '../../../types';

export const CronJobShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  return (
    <PageShow<WithId<CronJob>, WorkloadModel>
      fieldGroups={[[], [ImageField(i18n)], [JobsField(i18n)]]}
      formatter={d => new WorkloadModel(d)}
    />
  );
};
