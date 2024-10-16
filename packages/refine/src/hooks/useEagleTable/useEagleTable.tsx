import { RequiredColumnProps } from '@cloudtower/eagle';
import { useTable, useResource } from '@refinedev/core';
import { merge } from 'lodash-es';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ValueDisplay from 'src/components/ValueDisplay';
import K8sDropdown from '../../components/Dropdowns/K8sDropdown';
import { Column, InternalTableProps, SorterOrder } from '../../components/InternalBaseTable';
import { ResourceModel } from '../../models';

type Params<Model extends ResourceModel> = {
  useTableParams: Parameters<typeof useTable<Model>>[0];
  columns: Column<Model>[];
  tableProps?: Partial<InternalTableProps<Model>>;
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
  const currentSize = tableProps?.defaultSize || 10;

  const useTableParams = useMemo(() => {
    // TODO: check whether resource can be namespaced
    const mergedParams = merge(params.useTableParams, {
      pagination: {
        pageSize: currentSize,
        mode: 'server',
      },
      resource: params.useTableParams?.resource || resource?.name,
    });
    return mergedParams;
  }, [params.useTableParams, currentSize, resource]);
  const finalColumns: Column<Model>[] = useMemo(() =>
    addDefaultRenderToColumns<Model, Column<Model>>(columns),
    [columns]
  );

  const table = useTable<Model>(useTableParams);
  const onPageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      table.setCurrent?.(page || 1);
    },
    [setCurrentPage, table]
  );
  const onSorterChange = useCallback((order?: SorterOrder | null, key?: string) => {
    const ORDER_MAP = {
      descend: 'desc',
      ascend: 'asc'
    } as const;
    const sorters = [{
      field: columns.find(col => col.key === key)?.dataIndex,
      order: order ? ORDER_MAP[order] : order,
    }];

    table.setSorters(sorters as any);
  }, [table, columns]);

  const data = table.tableQueryResult.data?.data;
  const total = table.tableQueryResult.data?.total || 0;
  const finalDataSource = formatter ? data?.map(formatter) : data;

  const finalProps: InternalTableProps<Model> = {
    tableKey: params.useTableParams?.resource || resource?.name || 'table',
    loading: table.tableQueryResult.isLoading,
    data: finalDataSource || [],
    columns: finalColumns,
    error: false,
    rowKey: 'id',
    currentPage,
    onPageChange: onPageChange,
    onSorterChange,
    onSelect: keys => {
      setSelectedKeys(keys as string[]);
    },
    total,
    RowMenu: Dropdown,
    ...tableProps,
    defaultSize: currentSize,
  };

  useEffect(() => {
    table.setSorters([{
      field: 'metadata.creationTimestamp',
      order: 'desc'
    }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { tableProps: finalProps, selectedKeys, ...table };
};
