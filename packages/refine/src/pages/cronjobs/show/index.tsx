import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { CronJobDropdown } from '../../../components/CronJobDropdown';
import { PageShow } from '../../../components/PageShow';
import { ImageField, JobsField } from '../../../components/ShowContent/fields';
import { CronJobModel } from '../../../models';

export const CronJobShow: React.FC<IResourceComponentsProps> = () => {
  return (
    <PageShow<CronJobModel>
      showConfig={{
        groups: [{
          fields: [ImageField()]
        }],
        tabs: [JobsField()],
      }}
      Dropdown={CronJobDropdown}
    />
  );
};
