import { cx } from '@linaria/core';
import { useTable } from '@refinedev/core';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';
import BaseTable from 'src/components/Table';
import { Column } from 'src/components/Table';
import ComponentContext from 'src/contexts/component';
import ConfigsContext from 'src/contexts/configs';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  NameColumnRenderer,
  PlainTextNameColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { ResourceModel } from 'src/models';
import { ResourceConfig } from 'src/types';

interface ResourceTableProps<Model extends ResourceModel> {
  resource: string;
  useTableParams?: Parameters<typeof useTable<Model>>[0];
}

export function ResourceTable<Model extends ResourceModel>(props: ResourceTableProps<Model>) {
  const { resource, useTableParams } = props;
  const configs = useContext(ConfigsContext);
  const config = configs[resource] as unknown as ResourceConfig<Model>;
  const { formatter, columns, Dropdown, noShow } = config;
  const { i18n } = useTranslation();
  const { Table: TableComponent } = useContext(ComponentContext);
  const Table = TableComponent || BaseTable;

  const nameRenderer: Column<Model> = noShow
    ? PlainTextNameColumnRenderer(i18n)
    : NameColumnRenderer(i18n);

  const { tableProps } = useEagleTable<Model>({
    useTableParams: {
      ...useTableParams,
    },
    columns: [nameRenderer, ...(columns?.() || [])],
    tableProps: {
      defaultSize: 10,
      ...config.tableProps,
    },
    resource,
    formatter,
    Dropdown,
  });

  useEffect(() => {
    tableProps.onPageChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!tableProps.data?.length && !tableProps.loading) {
    return <ErrorContent
      errorText={tableProps.empty || i18n.t('dovetail.no_resource', { kind: ` ${config.kind}` })}
      type={ErrorContentType.Card}
    />;
  }

  return (
    <Table
      {...tableProps}
      empty={
        tableProps.empty || i18n.t('dovetail.no_resource', { kind: ` ${config.kind}` })
      }
      className={cx(tableProps.className)}
    />
  );
}
