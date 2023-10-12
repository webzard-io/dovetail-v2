import { SettingsGear16GradientGrayIcon } from '@cloudtower/icons-react';
import { useParsed, useTable } from '@refinedev/core';
import { useCallback, useMemo, useState } from 'react';
import { merge } from 'lodash-es';
import React from 'react';
import K8sDropdown from 'src/components/K8sDropdown';
import { Column, TableProps } from '../../components/Table';
import { ResourceModel } from '../../model';
import { Resource } from '../../types';
import { ALL_NS, NS_STORE_KEY } from 'src/components/NamespacesFilter';

type Params<Raw extends Resource, Model extends ResourceModel> = {
  useTableParams: Parameters<typeof useTable<Raw>>[0];
  columns: Column<Model>[];
  tableProps?: Partial<TableProps<Model>>;
  formatter: (d: Raw) => Model;
};

export enum ColumnKeys {
  age = 'age',
  name = 'name',
  namespace = 'namespace',
  phase = 'phase',
  replicas = 'replicas',
  deploymentImage = 'deploymentImage',
  podImage = 'podImage',
}

export const useEagleTable = <Raw extends Resource, Model extends ResourceModel>(
  params: Params<Raw, Model>
) => {
  const { columns, tableProps, formatter } = params;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(tableProps?.currentPage || 1);

  const parsed = useParsed();
  const nsFilter = parsed.params?.['namespace-filter'] || ALL_NS;

  const useTableParams = useMemo(() => {
    // TODO: check whether resource can be namespaced
    return merge(
      params.useTableParams,
      nsFilter === ALL_NS
        ? {}
        : {
            filters: {
              permanent: [
                {
                  field: 'metadata.namespace',
                  operator: 'eq',
                  value: nsFilter,
                },
              ],
            },
          }
    );
  }, [params.useTableParams, nsFilter]);

  const table = useTable<Raw>(useTableParams);

  const onPageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const actionColumn: Column<Model> = {
    key: 'action',
    display: true,
    dataIndex: [],
    title: () => <SettingsGear16GradientGrayIcon />,
    render: (_: unknown, record: Model) => {
      return <K8sDropdown data={record} />;
    },
  };

  const finalDataSource = table.tableQueryResult.data?.data.map(formatter);

  const finalProps: TableProps<Model> = {
    loading: table.tableQueryResult.isLoading,
    dataSource: finalDataSource || [],
    columns: [...columns, actionColumn],
    refetch: () => null,
    error: false,
    rowKey: 'id',
    currentPage,
    currentSize: tableProps?.currentSize || 5,
    onPageChange: onPageChange,
    onSelect: keys => {
      setSelectedKeys(keys as string[]);
    },
  };
  return { tableProps: finalProps, selectedKeys, ...table };
};
