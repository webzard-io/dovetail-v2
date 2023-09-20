import { useUIKit } from '@cloudtower/eagle';
import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { CreateButton } from '../../../components/CreateButton';
import { DeleteManyButton } from '../../../components/DeleteManyButton';
import Table, { IDObject } from '../../../components/Table';
import { DrawerShow } from '../../../components/Show/DrawerShow';
import { MetadataFields } from '../../../components/Show/Fields';
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
    <>
      <kit.space direction="vertical">
        <CreateButton />
        <DeleteManyButton ids={selectedKeys} />
        <Table {...tableProps} />
      </kit.space>
      <DrawerShow fields={MetadataFields} />
    </>
  );
};
