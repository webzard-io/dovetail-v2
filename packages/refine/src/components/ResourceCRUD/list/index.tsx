import { IResourceComponentsProps } from '@refinedev/core';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from 'src/components/InternalBaseTable';
import { useRefineFilters } from 'src/hooks';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  NameColumnRenderer,
  PlainTextNameColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { ResourceModel } from 'src/models';
import { ResourceConfig } from 'src/types';
import { ListPage } from '../../ListPage';

type Props<Model extends ResourceModel> = IResourceComponentsProps & {
  config: ResourceConfig<Model>;
};

export function ResourceList<Model extends ResourceModel>(props: Props<Model>) {
  const { formatter, columns, Dropdown, noShow } = props.config;
  const { i18n } = useTranslation();

  const nameRenderer: Column<Model> = noShow
    ? PlainTextNameColumnRenderer(i18n)
    : NameColumnRenderer(i18n);
  const filters = useRefineFilters();

  const { tableProps, selectedKeys } = useEagleTable<Model>({
    useTableParams: {
      filters,
    },
    columns: [nameRenderer, ...(columns?.() || [])],
    tableProps: {
      defaultSize: 50,
      ...props.config.tableProps,
    },
    formatter,
    Dropdown,
  });

  useEffect(() => {
    tableProps.onPageChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return <ListPage selectedKeys={selectedKeys} tableProps={tableProps} />;
}
