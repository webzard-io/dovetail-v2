import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CronJobDropdown } from 'src/components/CronJobDropdown';
import { ListPage } from 'src/components/ListPage';
import Time from 'src/components/Time';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  StateDisplayColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { CronJobModel } from '../../../models';

export const CronJobList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<CronJobModel>({
    useTableParams: {},
    columns: [
      StateDisplayColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      WorkloadImageColumnRenderer(i18n),
      {
        key: 'schedule',
        display: true,
        dataIndex: ['spec', 'schedule'],
        title: i18n.t('dovetail.schedule'),
        sortable: true,
      },
      {
        key: 'lastScheduleTime',
        display: true,
        dataIndex: ['status', 'lastScheduleTime'],
        title: i18n.t('dovetail.lastScheduleTime'),
        sortable: true,
        render(value) {
          return <Time date={value} />;
        },
      },
      AgeColumnRenderer(i18n),
    ],
    tableProps: {
      currentSize: 10,
    },
    Dropdown: CronJobDropdown,
  });

  return <ListPage resourceName="CronJob" selectedKeys={selectedKeys} tableProps={tableProps} />;
};
