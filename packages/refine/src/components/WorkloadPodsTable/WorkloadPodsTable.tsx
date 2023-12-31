import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useList } from '@refinedev/core';
import { LabelSelector } from 'kubernetes-types/meta/v1';
import React, { useMemo, useState } from 'react';
import { matchSelector } from 'src/utils/selector';
import {
  NameColumnRenderer,
  NodeNameColumnRenderer,
  PhaseColumnRenderer,
  RestartCountColumnRenderer,
  WorkloadImageColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { PodModel } from '../../models';
import Table, { Column } from '../Table';
import { TableToolBar } from '../Table/TableToolBar';

export const WorkloadPodsTable: React.FC<{ selector?: LabelSelector }> = ({
  selector,
}) => {
  const kit = useUIKit();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data } = useList<PodModel>({
    resource: 'pods',
    meta: { resourceBasePath: '/api/v1', kind: 'Pod' },
  });

  const dataSource = useMemo(() => {
    return data?.data.filter(p => {
      return selector ? matchSelector(p, selector) : true;
    });
  }, [data?.data, selector]);

  const columns: Column<PodModel>[] = [
    PhaseColumnRenderer(),
    NameColumnRenderer('pods'),
    NodeNameColumnRenderer(),
    WorkloadImageColumnRenderer(),
    RestartCountColumnRenderer(),
  ];

  return (
    <kit.space
      direction="vertical"
      className={css`
        width: 100%;
      `}
    >
      <TableToolBar title="" selectedKeys={selectedKeys} hideCreate />
      <Table
        tableKey='pods'
        loading={!dataSource}
        data={dataSource || []}
        columns={columns}
        onSelect={keys => setSelectedKeys(keys as string[])}
        rowKey="id"
        error={false}
        currentPage={currentPage}
        onPageChange={p => setCurrentPage(p)}
        currentSize={10}
        refetch={() => null}
      />
    </kit.space>
  );
};
