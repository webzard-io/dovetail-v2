import { css } from '@linaria/core';
import { IResourceComponentsProps } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import React from 'react';
import Table, { IDObject } from 'src/components/Table';
import { TableToolBar } from 'src/components/Table/TableToolBar';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  DeploymentImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
  ReplicasColumnRenderer,
} from 'src/hooks/useEagleTable/Columns';

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

export const DeploymentList: React.FC<IResourceComponentsProps> = <
  T extends IDObject & Unstructured,
>() => {
  const { tableProps, selectedKeys } = useEagleTable<T>({
    useTableParams: [{}],
    columns: [
      PhaseColumnRenderer(),
      NameColumnRenderer(),
      NameSpaceColumnRenderer(),
      DeploymentImageColumnRenderer(),
      ReplicasColumnRenderer(),
      AgeColumnRenderer(),
    ],
    tableProps: {
      currentSize: 10,
    },
  });

  return (
    <div
      className={ListPageStyle}
    >
      <TableToolBar title="Deployments" selectedKeys={selectedKeys} />
      <Table className={TableStyle} {...tableProps} scroll={{ y: 'calc(100% - 48px)' }} />
    </div>
  );
};
