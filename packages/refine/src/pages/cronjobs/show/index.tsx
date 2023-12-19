import { IResourceComponentsProps } from '@refinedev/core';
import { CronJobModel } from 'k8s-api-provider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CronJobDropdown } from '../../../components/CronJobDropdown';
import { PageShow } from '../../../components/PageShow';
import { ImageField, JobsField } from '../../../components/ShowContent/fields';

export const CronJobShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  return (
    <PageShow<CronJobModel>
      fieldGroups={[[], [ImageField(i18n)], [JobsField(i18n)]]}
      Dropdown={CronJobDropdown}
    />
  );
};
