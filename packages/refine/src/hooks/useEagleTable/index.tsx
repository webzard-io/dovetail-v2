import { useUIKit } from '@cloudtower/eagle';
import { useDelete, useParsed, useTable } from '@refinedev/core';
import { Dropdown } from 'antd';
import { useCallback, useState } from 'react';
import React from 'react';
import { Column, TableProps, IDObject } from '../../components/Table';
import { useEdit } from '../useEdit';

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

export const useEagleTable = <T extends IDObject>(params: Params<T>) => {
  const { useTableParams, columns, tableProps } = params;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const kit = useUIKit();
  const parsed = useParsed();
  const { resource } = parsed;
  const { mutate } = useDelete();
  const { edit } = useEdit();
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
    title: 'Actions',
    render: (_: unknown, record: T) => {
      return (
        <Dropdown
          overlay={
            <kit.menu style={{ width: 130 }}>
              <kit.menu.Item
                onClick={() =>
                  mutate({
                    resource: resource?.name || '',
                    id: record.id,
                  })
                }
              >
                Delete
              </kit.menu.Item>
              <kit.menu.Item
                onClick={() => {
                  if (record.id) {
                    edit(record.id);
                  }
                }}
              >
                Edit
              </kit.menu.Item>
            </kit.menu>
          }
        >
          <kit.button>...</kit.button>
        </Dropdown>
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
