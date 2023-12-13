import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { LabelSelector } from 'kubernetes-types/meta/v1';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NameColumnRenderer,
  NodeNameColumnRenderer,
  PhaseColumnRenderer,
  RestartCountColumnRenderer,
  WorkloadImageColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { PodModel } from '../../model';
import Table, { Column } from '../Table';
import { TableToolBar } from '../Table/TableToolBar';
import { usePods } from '../../hooks/usePods';

export const WorkloadPodsTable: React.FC<{ selector?: LabelSelector }> = ({
  selector,
}) => {
  const kit = useUIKit();
  const { i18n } = useTranslation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { pods, isLoading } = usePods(selector);

  const columns: Column<PodModel>[] = [
    PhaseColumnRenderer(i18n),
    NameColumnRenderer(i18n, 'pods'),
    NodeNameColumnRenderer(i18n),
    WorkloadImageColumnRenderer(i18n),
    RestartCountColumnRenderer(i18n),
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
        loading={isLoading}
        dataSource={pods || []}
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
