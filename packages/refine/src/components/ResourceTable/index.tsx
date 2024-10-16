import { useTable } from '@refinedev/core';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorContentType } from 'src/components/ErrorContent';
import { Column } from 'src/components/InternalBaseTable';
import { Table } from 'src/components/Table';
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

  const nameRenderer: Column<Model> = noShow
    ? PlainTextNameColumnRenderer(i18n)
    : NameColumnRenderer(i18n);

  const { tableProps } = useEagleTable<Model>({
    useTableParams: {
      resource,
      ...useTableParams,
    },
    columns: [nameRenderer, ...(columns?.() || [])],
    tableProps: {
      defaultSize: 10,
      ...config.tableProps,
    },
    formatter,
    Dropdown,
  });

  useEffect(() => {
    tableProps.onPageChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Table
      tableProps={tableProps}
      displayName={config.displayName || config.kind}
      errorContentProps={{
        type: ErrorContentType.Card,
      }}
    />
  );
}
