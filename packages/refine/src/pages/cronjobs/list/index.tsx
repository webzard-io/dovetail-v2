import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { CronJobDropdown } from 'src/components/CronJobDropdown';
import { ListPage } from 'src/components/ListPage';
import Time from 'src/components/Time';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import i18n from '../../../i18n';
import { CronJobModel } from '../../../models';

export const CronJobList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, selectedKeys } = useEagleTable<CronJobModel>({
    useTableParams: {},
    columns: [
      PhaseColumnRenderer(),
      NameColumnRenderer(),
      NameSpaceColumnRenderer(),
      WorkloadImageColumnRenderer(),
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
      AgeColumnRenderer(),
    ],
    tableProps: {
      currentSize: 10,
    },
    Dropdown: CronJobDropdown,
  });

  return <ListPage title="CronJob" selectedKeys={selectedKeys} tableProps={tableProps} />;
};
