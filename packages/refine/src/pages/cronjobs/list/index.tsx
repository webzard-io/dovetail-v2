import { css } from '@linaria/core';
import { IResourceComponentsProps } from '@refinedev/core';
import { CronJob } from 'kubernetes-types/batch/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Table from 'src/components/Table';
import { TableToolBar } from 'src/components/Table/TableToolBar';
import Time from 'src/components/Time';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { WorkloadModel } from '../../../model/workload-model';
import { WithId } from '../../../types';

const ListPageStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TableStyle = css`
  flex: 1;
  min-height: 0;
`;

export const CronJobList: React.FC<IResourceComponentsProps> = () => {
  const { i18n, t } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<WithId<CronJob>, WorkloadModel>({
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
    formatter: d => new WorkloadModel(d),
  });

  return (
    <div className={ListPageStyle}>
      <TableToolBar title="CronJob" selectedKeys={selectedKeys} />
      <Table {...tableProps} className={TableStyle} scroll={{ y: 'calc(100% - 48px)' }} />
    </div>
  );
};
