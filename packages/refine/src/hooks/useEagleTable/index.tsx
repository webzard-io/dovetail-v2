import { SettingsGear16GradientGrayIcon } from '@cloudtower/icons-react';
import { useTable } from '@refinedev/core';
import { useCallback, useState } from 'react';
import React from 'react';
import K8sDropdown from 'src/components/K8sDropdown';
import { Column, TableProps } from '../../components/Table';
import { ResourceModel } from '../../model';
import { Resource } from '../../types';

type Params<Raw extends Resource, Model extends ResourceModel> = {
  useTableParams: Parameters<typeof useTable<Raw>>;
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
  const { useTableParams, columns, tableProps, formatter } = params;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(tableProps?.currentPage || 1);
  const table = useTable<Raw>(...useTableParams);

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
