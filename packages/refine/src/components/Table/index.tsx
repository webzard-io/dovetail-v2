import { useUIKit, TableProps as BaseTableProps } from '@cloudtower/eagle';
import { RequiredColumnProps } from '@cloudtower/eagle/dist/spec/base';
import { css, cx } from '@linaria/core';
import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceModel } from '../../models';
import ErrorContent from './ErrorContent';
import { AuxiliaryLine } from './TableWidgets';

export type IDObject = { id: string };

const TableContainerStyle = css`
  width: 100%;
  border-top: 1px solid rgba(211, 218, 235, 0.6);
  display: flex;
  flex-direction: column;

  // use eagle's own pagination component, hide antd's
  .ant-table-pagination {
    display: none;
  }

  .table-container {
    min-height: 0;
  }
`;

export type Column<Data extends ResourceModel> = RequiredColumnProps<Data> & {
  display: boolean;
};

export type TableProps<Data extends ResourceModel> = {
  tableKey: string;
  className?: string;
  loading: boolean;
  error: boolean;
  data: Data[];
  refetch: () => void;
  rowKey: (string & keyof Data) | ((record: Data) => string);
  columns: Array<Column<Data>>;
  scroll?: BaseTableProps<Data>['scroll'];
  currentPage: number;
  currentSize: number;
  onActive?: (key: unknown, record: Data) => void;
  onSelect?: (keys: React.Key[], rows: Data[]) => void;
  onPageChange: (page: number) => void;
  onSizeChange?: (size: number) => void;
  RowMenu?: React.FC<{ record: Data; }>;
};

function Table<Data extends ResourceModel>(props: TableProps<Data>) {
  const kit = useUIKit();
  const { t } = useTranslation();
  const {
    loading,
    error,
    data: dataSource,
    rowKey,
    columns,
    scroll,
    currentPage,
    currentSize,
    RowMenu,
    refetch,
    onSelect,
    onPageChange,
    onSizeChange,
  } = props;
  const auxiliaryLineRef = useRef(null);
  const wrapperRef = useRef(null);

  const pagination = useMemo(
    () => ({
      current: currentPage,
      pageSize: currentSize,
      onChange: onPageChange,
    }),
    [currentPage, currentSize, onPageChange]
  );
  const finalColumns = useMemo(()=> {
    if (RowMenu) {
      const actionColumn: Column<Data> = {
        key: '_action_',
        display: true,
        dataIndex: [],
        title: '',
        render: (_: unknown, record) => {
          return <RowMenu record={record} />;
        },
      };

      return [
        ...columns,
        actionColumn
      ];
    }

    return columns;
  }, [columns, RowMenu])

  if (loading) {
    return <kit.loading />;
  } else if (error) {
    return (
      <ErrorContent
        errorText={t('dovetail.retry_when_access_data_failed')}
        refetch={refetch}
        style={{ padding: '15px 0' }}
      />
    );
  } else if (dataSource.length === 0) {
    return <ErrorContent errorText={t('dovetail.empty')} style={{ padding: '15px 0' }} />;
  }

  return (
    <div
      ref={wrapperRef}
      className={cx(TableContainerStyle, props.className, 'table-wrapper')}
    >
      <kit.table
        tableLayout="fixed"
        rowSelection={
          onSelect
            ? {
                onChange: (keys, rows) => {
                  onSelect?.(keys, rows);
                },
              }
            : undefined
        }
        columns={finalColumns}
        dataSource={dataSource}
        pagination={pagination}
        error={error}
        loading={loading}
        rowKey={rowKey}
        wrapper={wrapperRef}
        scroll={scroll}
      />
      <AuxiliaryLine ref={auxiliaryLineRef}></AuxiliaryLine>
      <kit.pagination
        current={currentPage}
        size={currentSize}
        count={dataSource.length}
        onChange={onPageChange}
        onSizeChange={onSizeChange}
      />
    </div>
  );
}

export default Table;
