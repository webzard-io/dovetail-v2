import { css } from '@linaria/core';
import { IResourceComponentsProps } from '@refinedev/core';
import { Pod } from 'kubernetes-types/core/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Table from 'src/components/Table';
import { TableToolBar } from 'src/components/Table/TableToolBar';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
  CommonSorter,
  RestartCountColumnRenderer,
  NodeNameColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { PodModel } from '../../../model';
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

export const PodList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<WithId<Pod>, PodModel>({
    useTableParams: {},
    columns: [
      PhaseColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      WorkloadImageColumnRenderer(i18n),
      {
        key: 'readyDisplay',
        display: true,
        dataIndex: ['readyDisplay'],
        title: 'Ready',
        sortable: true,
        sorter: CommonSorter(['readyDisplay']),
      },
      RestartCountColumnRenderer(i18n),
      NodeNameColumnRenderer(i18n),
      {
        key: 'ip',
        display: true,
        dataIndex: ['status', 'podIP'],
        title: 'IP',
        sortable: true,
        sorter: CommonSorter(['status', 'podIP']),
      },
      AgeColumnRenderer(i18n),
    ],
    tableProps: {
      currentSize: 10,
    },
    formatter: d => new PodModel(d),
  });

  return (
    <div className={ListPageStyle}>
      <TableToolBar title="Pod" selectedKeys={selectedKeys} />
      <Table {...tableProps} className={TableStyle} scroll={{ y: 'calc(100% - 48px)' }} />
    </div>
  );
};
