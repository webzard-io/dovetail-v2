import { css } from '@linaria/core';
import { IResourceComponentsProps } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Table, { IDObject } from 'src/components/Table';
import { TableToolBar } from 'src/components/Table/TableToolBar';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
  ReplicasColumnRenderer,
} from 'src/hooks/useEagleTable/columns';

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

export const JobList: React.FC<IResourceComponentsProps> = <
  T extends IDObject & Unstructured,
>() => {
  const { i18n } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<T>({
    useTableParams: [{}],
    columns: [
      PhaseColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      ReplicasColumnRenderer(i18n),
      AgeColumnRenderer(i18n),
    ],
    tableProps: {
      currentSize: 10,
    },
  });

  return (
    <div className={ListPageStyle}>
      <TableToolBar title="Jobs" selectedKeys={selectedKeys} />
      <Table className={TableStyle} {...tableProps} scroll={{ y: 'calc(100% - 48px)' }} />
    </div>
  );
};
