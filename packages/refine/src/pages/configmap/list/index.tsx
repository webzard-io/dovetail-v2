import { useUIKit } from '@cloudtower/eagle';
import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { CreateButton } from '../../../components/CreateButton';
import { DeleteManyButton } from '../../../components/DeleteManyButton';
import { KeyValue } from '../../../components/KeyValue';
import { DrawerShow } from '../../../components/Show/DrawerShow';
import { MetadataFields } from '../../../components/Show/Fields';
import Table, { IDObject } from '../../../components/Table';
import { useEagleTable } from '../../../hooks/useEagleTable';
import {
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  AgeColumnRenderer,
} from '../../../hooks/useEagleTable/Columns';

export const ConfigmapList: React.FC<IResourceComponentsProps> = <
  T extends IDObject,
>() => {
  const kit = useUIKit();

  const { tableProps, selectedKeys } = useEagleTable<T>({
    useTableParams: [{ syncWithLocation: true }],
    columns: [NameColumnRenderer(), NameSpaceColumnRenderer(), AgeColumnRenderer()],
    tableProps: {},
  });

  return (
    <>
      <kit.space direction="vertical">
        <CreateButton />
        <DeleteManyButton ids={selectedKeys} />
        <Table {...tableProps} />
      </kit.space>
      <DrawerShow
        fields={[
          ...MetadataFields,
          {
            title: 'Data',
            path: ['data'],
            render: val => {
              return <KeyValue value={val as any} />;
            },
          },
        ]}
      />
    </>
  );
};
