import { useUIKit } from '@cloudtower/eagle';
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

export const DeploymentList: React.FC<IResourceComponentsProps> = <
  T extends IDObject & Unstructured,
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
