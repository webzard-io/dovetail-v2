import { IResourceComponentsProps } from '@refinedev/core';
import { CronJobModel } from 'k8s-api-provider';
import { CronJob } from 'kubernetes-types/batch/v1';
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
  PhaseColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { WithId } from 'src/types';

export const CronJobList: React.FC<IResourceComponentsProps> = () => {
  const { i18n, t } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<WithId<CronJob>, CronJobModel>({
    useTableParams: {},
    columns: [
      PhaseColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      WorkloadImageColumnRenderer(i18n),
      {
        key: 'schedule',
        display: true,
        dataIndex: ['spec', 'schedule'],
        title: t('dovetail.schedule'),
        sortable: true,
      },
      {
        key: 'lastScheduleTime',
        display: true,
        dataIndex: ['status', 'lastScheduleTime'],
        title: t('dovetail.lastScheduleTime'),
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

  return <ListPage title="CronJob" selectedKeys={selectedKeys} tableProps={tableProps} />;
};
