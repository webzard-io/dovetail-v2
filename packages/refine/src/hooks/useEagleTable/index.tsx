import {
  SettingsGear16GradientGrayIcon,
} from '@cloudtower/icons-react';
import { useTable } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import { useCallback, useState } from 'react';
import React from 'react';
import K8sDropdown from 'src/components/K8sDropdown';
import { Column, TableProps, IDObject } from '../../components/Table';

type Params<T extends IDObject> = {
  useTableParams: Parameters<typeof useTable<T>>;
  columns: Column<T>[];
  tableProps?: Partial<TableProps<T>>;
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

export const useEagleTable = <T extends IDObject & Unstructured>(params: Params<T>) => {
  const { useTableParams, columns, tableProps } = params;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(tableProps?.currentPage || 1);
  const table = useTable<T>(...useTableParams);

  const onPageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const actionColumn: Column<T> = {
    key: 'action',
    display: true,
    dataIndex: [],
    title: () => <SettingsGear16GradientGrayIcon />,
    render: (_: unknown, record: T) => {
      return (
        <K8sDropdown data={record} />
      );
    },
  };

  const finalProps: TableProps<T> = {
    loading: table.tableQueryResult.isLoading,
    dataSource: table.tableQueryResult.data?.data || [],
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
