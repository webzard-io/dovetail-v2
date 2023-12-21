import { Icon } from '@cloudtower/eagle';
import { SettingsGear16GradientGrayIcon } from '@cloudtower/icons-react';
import { useTable, useResource } from '@refinedev/core';
import { merge } from 'lodash-es';
import React, { useCallback, useMemo, useState } from 'react';
import K8sDropdown from '../../components/K8sDropdown';
import { useNamespacesFilter, ALL_NS } from '../../components/NamespacesFilter';
import { Column, TableProps } from '../../components/Table';
import { ResourceModel } from '../../model';
import { Resource } from '../../types';

type Params<Raw extends Resource, Model extends ResourceModel> = {
  useTableParams: Parameters<typeof useTable<Raw>>[0];
  columns: Column<Model>[];
  tableProps?: Partial<TableProps<Model>>;
  formatter: (d: Raw) => Model;
  Dropdown?: React.FC<{ record: Model }>;
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
  const { columns, tableProps, formatter, Dropdown = K8sDropdown } = params;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(tableProps?.currentPage || 1);
  const { resource } = useResource();

  const { value: nsFilter } = useNamespacesFilter();

  const useTableParams = useMemo(() => {
    // TODO: check whether resource can be namespaced
    const mergedParams = merge(params.useTableParams, {
      filters: {
        permanent: [
          {
            field: 'metadata.namespace',
            operator: 'eq',
            value: nsFilter === ALL_NS ? null : nsFilter,
          },
        ],
      },
    });
    return mergedParams;
  }, [params.useTableParams, nsFilter]);

  const table = useTable<Raw>(useTableParams);

  const onPageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const finalDataSource = table.tableQueryResult.data?.data.map(formatter);

  const finalProps: TableProps<Model> = {
    tableKey: resource?.name || 'table',
    loading: table.tableQueryResult.isLoading,
    data: finalDataSource || [],
    columns,
    refetch: () => null,
    error: false,
    rowKey: 'id',
    currentPage,
    currentSize: tableProps?.currentSize || 5,
    onPageChange: onPageChange,
    onSelect: keys => {
      setSelectedKeys(keys as string[]);
    },
    RowMenu: Dropdown
  };
  return { tableProps: finalProps, selectedKeys, ...table };
};
