import { Icon, useUIKit } from '@cloudtower/eagle';
import {
  EditPen16PrimaryIcon,
  MoreEllipsis16BlueIcon,
  SettingsGear16GradientGrayIcon,
  TrashBinDelete16Icon,
} from '@cloudtower/icons-react';
import { useParsed, useTable } from '@refinedev/core';
import { Dropdown } from 'antd';
import { useCallback, useState } from 'react';
import React from 'react';
import { Column, TableProps, IDObject } from '../../components/Table';
import { useDeleteModal } from '../useDeleteModal';
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
  const { edit } = useEdit();
  const [currentPage, setCurrentPage] = useState(tableProps?.currentPage || 1);
  const table = useTable<T>(...useTableParams);
  const { showDeleteConfirm } = useDeleteModal();

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
        <Dropdown
          overlay={
            <kit.menu style={{ width: 130 }}>
              <kit.menuItem
                onClick={() => {
                  if (record.id) {
                    edit(record.id);
                  }
                }}
              >
                <Icon src={EditPen16PrimaryIcon}>Edit</Icon>
              </kit.menuItem>
              <kit.menuItem
                danger={true}
                onClick={() => {
                  showDeleteConfirm(resource?.name || '', record.id);
                }}
              >
                <Icon src={TrashBinDelete16Icon}>Delete</Icon>
              </kit.menuItem>
            </kit.menu>
          }
        >
          <kit.button type="tertiary" size="small">
            <MoreEllipsis16BlueIcon />
          </kit.button>
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
