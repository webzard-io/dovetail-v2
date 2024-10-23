import { TableProps as BaseTableProps, RequiredColumnProps, Table as BaseTable, Pagination, Loading } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent from 'src/components/ErrorContent';
import { FormType } from 'src/types';
import { AuxiliaryLine } from './TableWidgets';

export type IDObject = { id: string };
export type SorterOrder = 'descend' | 'ascend' | undefined;

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

export type Column<Data extends { id: string; }> = RequiredColumnProps<Data> & {
  display?: boolean;
};

export type InternalTableProps<Data extends { id: string; }> = {
  tableKey: string;
  className?: string;
  loading: boolean;
  error?: boolean;
  data: Data[];
  total: number;
  refetch?: () => void;
  rowKey: (string & keyof Data) | ((record: Data) => string);
  columns: Array<Column<Data>>;
  scroll?: BaseTableProps<Data>['scroll'];
  currentPage: number;
  defaultSize: number;
  onActive?: (key: unknown, record: Data) => void;
  onSelect?: (keys: React.Key[], rows: Data[]) => void;
  onPageChange: (page: number) => void;
  onSizeChange?: (size: number) => void;
  onSorterChange?: (order: SorterOrder | null, key?: string) => void;
  RowMenu?: React.FC<{ record: Data; formType?: FormType; }>;
  empty?: string;
  showMenuColumn?: boolean;
};

function Table<Data extends { id: string; }>(props: InternalTableProps<Data>) {
  const { t } = useTranslation();
  const {
    loading,
    error,
    data: dataSource,
    rowKey,
    columns,
    scroll,
    currentPage,
    defaultSize,
    total,
    RowMenu,
    refetch,
    onPageChange,
    onSizeChange,
    empty,
  } = props;
  const auxiliaryLineRef = useRef(null);
  const wrapperRef = useRef(null);

  const finalColumns = useMemo(() => {
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
  }, [columns, RowMenu]);

  if (loading) {
    return <Loading />;
  } else if (error) {
    return (
      <ErrorContent
        errorText={t('dovetail.retry_when_access_data_failed')}
        refetch={refetch}
        style={{ padding: '15px 0', }}
      />
    );
  } else if (dataSource.length === 0) {
    return <ErrorContent
      errorText={empty || t('dovetail.empty')}
      style={{ padding: '15px 0' }}
    />;
  }

  return (
    <div
      ref={wrapperRef}
      className={cx(TableContainerStyle, props.className, 'table-wrapper')}
    >
      <BaseTable
        tableLayout="fixed"
        columns={finalColumns}
        dataSource={dataSource}
        error={error}
        loading={loading}
        rowKey={rowKey}
        wrapper={wrapperRef}
        scroll={scroll}
      />
      <AuxiliaryLine ref={auxiliaryLineRef}></AuxiliaryLine>
      <Pagination
        current={currentPage}
        size={defaultSize}
        count={total}
        onChange={onPageChange}
        onSizeChange={onSizeChange}
      />
    </div>
  );
}

export default Table;
