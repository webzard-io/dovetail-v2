import { useUIKit } from '@cloudtower/eagle';
import { IResourceComponentsProps } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreateButton } from 'src/components/CreateButton';
import { DeleteManyButton } from 'src/components/DeleteManyButton';
import { DrawerShow } from 'src/components/DrawerShow';
import Table, { IDObject } from 'src/components/Table';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  AgeColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { Tags } from '../../../components/Tags';

export const ConfigmapList: React.FC<IResourceComponentsProps> = <
  T extends IDObject & Unstructured,
>() => {
  const kit = useUIKit();
  const { i18n } = useTranslation();

  const { tableProps, selectedKeys } = useEagleTable<T>({
    useTableParams: [{ syncWithLocation: true }],
    columns: [
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      AgeColumnRenderer(i18n),
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
      <DrawerShow
        fieldGroups={[
          [],
          [
            {
              key: 'data',
              title: 'Data',
              path: ['data'],
              render: (val: any) => {
                return <Tags value={val} />;
              },
            },
          ],
        ]}
      />
    </>
  );
};
