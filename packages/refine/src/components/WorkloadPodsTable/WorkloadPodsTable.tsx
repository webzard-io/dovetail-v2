import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useList } from '@refinedev/core';
import { LabelSelector } from 'kubernetes-types/meta/v1';
import React, { useMemo, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';
import ComponentContext from 'src/contexts/component';
import { addDefaultRenderToColumns } from 'src/hooks/useEagleTable';
import { matchSelector } from 'src/utils/match-selector';
import {
  NameColumnRenderer,
  NodeNameColumnRenderer,
  RestartCountColumnRenderer,
  StateDisplayColumnRenderer,
  WorkloadImageColumnRenderer,
  PodContainersNumColumnRenderer,
  AgeColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { PodModel } from '../../models';
import BaseTable, { Column } from '../Table';
import { TableToolBar } from '../Table/TableToolBar';

interface WorkloadPodsTableProps {
  selector?: LabelSelector;
  hideToolbar?: boolean;
}

export const WorkloadPodsTable: React.FC<WorkloadPodsTableProps> = ({
  selector,
  hideToolbar,
}) => {
  const { i18n } = useTranslation();
  const kit = useUIKit();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const component = useContext(ComponentContext);
  const Table = component.Table || BaseTable;
  const currentSize = 10;

  const { data } = useList<PodModel>({
    resource: 'pods',
    meta: { resourceBasePath: '/api/v1', kind: 'Pod' },
    pagination: {
      mode: 'off',
    },
  });

  const dataSource = useMemo(() => {
    return data?.data.filter(p => {
      return selector ? matchSelector(p, selector) : true;
    });
  }, [data?.data, selector]);

  const columns: Column<PodModel>[] = [
    NameColumnRenderer(i18n, 'pods'),
    StateDisplayColumnRenderer(i18n),
    {
      key: 'ip',
      display: true,
      dataIndex: ['status', 'podIP'],
      title: i18n.t('dovetail.ip_address'),
      sortable: true,
      width: 160,
    },
    NodeNameColumnRenderer(i18n),
    WorkloadImageColumnRenderer(i18n),
    PodContainersNumColumnRenderer(i18n),
    RestartCountColumnRenderer(i18n),
    AgeColumnRenderer(i18n),
  ];

  if (dataSource?.length === 0) {
    return <ErrorContent
      errorText={i18n.t('dovetail.no_resource', { kind: ` ${i18n.t('dovetail.pod')}` })}
      style={{ padding: '15px 0' }}
      type={ErrorContentType.Card}
    />;
  }

  return (
    <kit.space
      direction="vertical"
      className={css`
        width: 100%;
        vertical-align: top;
      `}
    >
      {hideToolbar ? null : (
        <TableToolBar selectedKeys={selectedKeys} hideCreate />
      )}
      <Table
        tableKey="pods"
        loading={!dataSource}
        data={(dataSource || []).slice((currentPage - 1) * currentSize, currentPage * currentSize)}
        total={dataSource?.length || 0}
        columns={addDefaultRenderToColumns<PodModel, Column<PodModel>>(columns)}
        onSelect={keys => setSelectedKeys(keys as string[])}
        rowKey="id"
        error={false}
        currentPage={currentPage}
        onPageChange={p => setCurrentPage(p)}
        currentSize={currentSize}
        refetch={() => null}
        showMenuColumn={false}
      />
    </kit.space>
  );
};
