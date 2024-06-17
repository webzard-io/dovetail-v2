import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import K8sDropdown from 'src/components/K8sDropdown';
import { ListPage } from 'src/components/ListPage';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { NodeModel } from 'src/models';

export const NodeList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<NodeModel>({
    useTableParams: {},
    columns: [
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      {
        display: true,
        key: 'role',
        title: 'Role',
        dataIndex: ['role']
      },
      AgeColumnRenderer(i18n),
    ],
    tableProps: {
      defaultSize: 10,
    },
    Dropdown: K8sDropdown,
  });

  return (
    <ListPage
      selectedKeys={selectedKeys}
      tableProps={tableProps}
    />
  );
};
