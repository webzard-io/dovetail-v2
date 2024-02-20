import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CronJobDropdown } from '../../../components/CronJobDropdown';
import { PageShow } from '../../../components/PageShow';
import { ImageField, JobsField } from '../../../components/ShowContent/fields';
import { CronJobModel } from '../../../models';

export const CronJobShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  return (
    <PageShow<CronJobModel>
      showConfig={{
        groups: [
          {
            fields: [ImageField(i18n)],
          },
        ],
        tabs: [JobsField()],
      }}
      Dropdown={CronJobDropdown}
    />
  );
};
