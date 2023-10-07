import { useUIKit } from '@cloudtower/eagle';
import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { CreateButton } from 'src/components/CreateButton';
import { DeleteManyButton } from 'src/components/DeleteManyButton';
import { KeyValue } from 'src/components/KeyValue';
import { DrawerShow } from 'src/components/Show/DrawerShow';
import { MetadataFields } from 'src/components/Show/Fields';
import Table, { IDObject } from 'src/components/Table';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  AgeColumnRenderer,
} from 'src/hooks/useEagleTable/Columns';
import { Unstructured } from 'src/providers/k8s-data-provider/kube-api';

export const ConfigmapList: React.FC<IResourceComponentsProps> = <
  T extends IDObject & Unstructured,
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
