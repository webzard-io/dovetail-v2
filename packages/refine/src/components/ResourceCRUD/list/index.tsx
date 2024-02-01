import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useEagleTable } from '../../../hooks/useEagleTable';
import { NameColumnRenderer } from '../../../hooks/useEagleTable/columns';
import { ResourceModel } from '../../../models';
import { ListPage } from '../../ListPage';
import { Column } from '../../Table';

type Props<Model extends ResourceModel> = IResourceComponentsProps & {
  formatter?: (v: Model) => Model;
  columns: Column<Model>[];
  Dropdown?: React.FC<{ record: Model }>;
};

export function ResourceList<Model extends ResourceModel>(props: Props<Model>) {
  const { formatter, name, columns, Dropdown } = props;
  const { tableProps, selectedKeys } = useEagleTable<Model>({
    useTableParams: {},
    columns: [NameColumnRenderer(), ...columns],
    tableProps: {
      currentSize: 10,
    },
    formatter,
    Dropdown,
  });

  return (
    <ListPage title={name || ''} selectedKeys={selectedKeys} tableProps={tableProps} />
  );
}
