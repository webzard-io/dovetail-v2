import { Icon } from '@cloudtower/eagle';
import { SettingsGear16GradientGrayIcon } from '@cloudtower/icons-react';
import { useTable } from '@refinedev/core';
import { ResourceModel } from 'k8s-api-provider';
import { merge } from 'lodash-es';
import React, { useCallback, useMemo, useState } from 'react';
import K8sDropdown from '../../components/K8sDropdown';
import { useNamespacesFilter, ALL_NS } from '../../components/NamespacesFilter';
import { Column, TableProps } from '../../components/Table';

type Params<Model extends ResourceModel> = {
  useTableParams: Parameters<typeof useTable<Model>>[0];
  columns: Column<Model>[];
  tableProps?: Partial<TableProps<Model>>;
  formatter?: (d: Model) => Model;
  Dropdown?: React.FC<{ data: Model }>;
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

export const useEagleTable = <Model extends ResourceModel>(params: Params<Model>) => {
  const { columns, tableProps, formatter, Dropdown = K8sDropdown } = params;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(tableProps?.currentPage || 1);

  const { value: nsFilter } = useNamespacesFilter();

  const useTableParams = useMemo(() => {
    // TODO: check whether resource can be namespaced
    const mergedParams = merge(params.useTableParams, {
      pagination: {
        mode: 'off',
      },
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

  const table = useTable<Model>(useTableParams);
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
    title: () => <Icon src={SettingsGear16GradientGrayIcon} />,
    render: (_: unknown, record: Model) => {
      return <Dropdown data={record} />;
    },
  };

  const data = table.tableQueryResult.data?.data;
  const finalDataSource = formatter ? data?.map(formatter) : data;
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
