import { IResourceComponentsProps } from '@refinedev/core';
import { CronJob } from 'kubernetes-types/batch/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CronJobDropdown } from '../../../components/CronJobDropdown';
import { PageShow } from '../../../components/PageShow';
import { ImageField, JobsField } from '../../../components/ShowContent/fields';
import { CronJobModel } from '../../../model';
import { WithId } from '../../../types';

export const CronJobShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  return (
    <PageShow<WithId<CronJob>, CronJobModel>
      fieldGroups={[[], [ImageField(i18n)], [JobsField(i18n)]]}
      formatter={d => new CronJobModel(d)}
      Dropdown={CronJobDropdown}
    />
  );
};
