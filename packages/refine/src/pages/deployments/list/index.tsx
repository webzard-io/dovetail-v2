import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import Table, { IDObject } from '../../../components/Table';
import { TableToolBar } from '../../../components/Table/TableToolBar';
import { useEagleTable } from '../../../hooks/useEagleTable';
import {
  AgeColumnRenderer,
  DeploymentImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
  ReplicasColumnRenderer,
} from '../../../hooks/useEagleTable/Columns';

export const DeploymentList: React.FC<IResourceComponentsProps> = <
  T extends IDObject,
>() => {
  const kit = useUIKit();

  const { tableProps, selectedKeys } = useEagleTable<T>({
    useTableParams: [{ syncWithLocation: true }],
    columns: [
      PhaseColumnRenderer(),
      NameColumnRenderer(),
      NameSpaceColumnRenderer(),
      DeploymentImageColumnRenderer(),
      ReplicasColumnRenderer(),
      AgeColumnRenderer(),
    ],
    tableProps: {},
  });

  return (
    <kit.space
      direction="vertical"
      className={css`
        width: 100%;
      `}
    >
      <TableToolBar title="Deployments" selectedKeys={selectedKeys} />
      <Table {...tableProps} />
    </kit.space>
  );
};
