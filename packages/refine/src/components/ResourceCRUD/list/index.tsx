import { IResourceComponentsProps } from '@refinedev/core';
import { ResourceModel } from 'k8s-api-provider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEagleTable } from '../../../hooks/useEagleTable';
import {
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
} from '../../../hooks/useEagleTable/columns';
import { ListPage } from '../../ListPage';
import { Column } from '../../Table';

type Props<Model extends ResourceModel> = IResourceComponentsProps & {
  formatter?: (v: Model) => Model;
  columns: Column<Model>[];
  Dropdown?: React.FC<{ data: Model }>;
};

export function ResourceList<Model extends ResourceModel>(props: Props<Model>) {
  const { formatter, name, columns, Dropdown } = props;
  const { i18n } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<Model>({
    useTableParams: {},
    columns: [
      PhaseColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      ...columns,
    ],
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
