import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { i18n } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<Model>({
    useTableParams: {},
    columns: [NameColumnRenderer(i18n), ...columns],
    tableProps: {
      currentSize: 10,
    },
    formatter,
    Dropdown,
  });

  return (
    <ListPage selectedKeys={selectedKeys} tableProps={tableProps} />
  );
}
