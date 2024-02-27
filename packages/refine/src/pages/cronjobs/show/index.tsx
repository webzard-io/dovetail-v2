import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CronJobDropdown } from '../../../components/CronJobDropdown';
import { PageShow } from '../../../components/PageShow';
import { BasicGroup, ImageField, JobsTab } from '../../../components/ShowContent';
import { CronJobModel } from '../../../models';

export const CronJobShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  return (
    <PageShow<CronJobModel>
      showConfig={{
        tabs: [
          {
            title: i18n.t('dovetail.detail'),
            key: 'detail',
            groups: [BasicGroup(i18n, { basicFields: [ImageField(i18n)] })]
          },
          JobsTab(),
        ],
      }}
      Dropdown={CronJobDropdown}
    />
  );
};
