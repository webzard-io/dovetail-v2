import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEagleTable } from '../../../hooks/useEagleTable';
import {
  NameColumnRenderer,
  PlainTextNameColumnRenderer,
} from '../../../hooks/useEagleTable/columns';
import { ResourceModel } from '../../../models';
import { ResourceConfig } from '../../../types';
import { ListPage } from '../../ListPage';
import { Column } from '../../Table';

type Props<Model extends ResourceModel> = IResourceComponentsProps & {
  config: ResourceConfig<Model>;
};

export function ResourceList<Model extends ResourceModel>(props: Props<Model>) {
  const { formatter, columns, Dropdown, noShow } = props.config;
  const { i18n } = useTranslation();

  const nameRenderer: Column<Model> = noShow
    ? PlainTextNameColumnRenderer(i18n)
    : NameColumnRenderer(i18n);

  const { tableProps, selectedKeys } = useEagleTable<Model>({
    useTableParams: {},
    columns: [nameRenderer, ...(columns?.() || [])],
    tableProps: {
      currentSize: 50,
    },
    formatter,
    Dropdown,
  });

  return (
    <ListPage selectedKeys={selectedKeys} tableProps={tableProps} />
  );
}
