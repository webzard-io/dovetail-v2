import { RequiredColumnProps } from '@cloudtower/eagle';
import { useTable, useResource } from '@refinedev/core';
import { merge } from 'lodash-es';
import React, { useCallback, useMemo, useState } from 'react';
import ValueDisplay from 'src/components/ValueDisplay';
import K8sDropdown from '../../components/K8sDropdown';
import { useNamespacesFilter, ALL_NS } from '../../components/NamespacesFilter';
import { Column, TableProps } from '../../components/Table';
import { ResourceModel } from '../../models';

type Params<Model extends ResourceModel> = {
  useTableParams: Parameters<typeof useTable<Model>>[0];
  columns: Column<Model>[];
  tableProps?: Partial<TableProps<Model>>;
  formatter?: (d: Model) => Model;
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

export function addDefaultRenderToColumns<Data, Col extends RequiredColumnProps<Data> = RequiredColumnProps<Data>>(columns: Col[]) {
  return columns.map(col => ({
    render(value: unknown) {
      return (
        <ValueDisplay
          value={value}
        />
      );
    },
    ...col,
  }));
}

export const useEagleTable = <Model extends ResourceModel>(params: Params<Model>) => {
  const { columns, tableProps, formatter, Dropdown = K8sDropdown } = params;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(tableProps?.currentPage || 1);
  const { resource } = useResource();

  const { value: nsFilters = [] } = useNamespacesFilter();

  const useTableParams = useMemo(() => {
    // TODO: check whether resource can be namespaced
    const mergedParams = merge(params.useTableParams, {
      pagination: {
        mode: 'off',
      },
      filters: {
        permanent: [
          {
            operator: 'or',
            value: nsFilters.filter(filter => filter !== ALL_NS).map(filter => ({
              field: 'metadata.namespace',
              operator: 'eq',
              value: filter,
            }))
          }
        ],
      },
    });
    return mergedParams;
  }, [params.useTableParams, nsFilters]);
  const finalColumns: Column<Model>[] = useMemo(() =>
    addDefaultRenderToColumns<Model, Column<Model>>(columns),
    [columns]
  );

  const table = useTable<Model>(useTableParams);
  const onPageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const currentSize = tableProps?.defaultSize || 10;
  const data = table.tableQueryResult.data?.data?.slice((currentPage - 1) * currentSize, currentPage * currentSize);
  const total = table.tableQueryResult.data?.data.length || 0;
  const finalDataSource = formatter ? data?.map(formatter) : data;

  const finalProps: TableProps<Model> = {
    tableKey: resource?.name || 'table',
    loading: table.tableQueryResult.isLoading,
    data: finalDataSource || [],
    columns: finalColumns,
    refetch: () => null,
    error: false,
    rowKey: 'id',
    currentPage,
    defaultSize: currentSize,
    onPageChange: onPageChange,
    onSelect: keys => {
      setSelectedKeys(keys as string[]);
    },
    total,
    RowMenu: Dropdown
  };
  return { tableProps: finalProps, selectedKeys, ...table };
};
