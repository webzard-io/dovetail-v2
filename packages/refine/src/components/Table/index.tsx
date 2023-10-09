import { useUIKit, TableProps as BaseTableProps } from '@cloudtower/eagle';
import { RequiredColumnProps } from '@cloudtower/eagle/dist/spec/base';
import { css, cx } from '@linaria/core';
import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent from './ErrorContent';
import { AuxiliaryLine } from './TableWidgets';

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
    flex: 1;
    min-height: 0;
  }
`;

export type IDObject = { id: string };

export type Column<Data extends IDObject> = RequiredColumnProps<Data> & {
  display: boolean;
};

export type TableProps<Data extends IDObject> = {
  className?: string;
  loading: boolean;
  error: boolean;
  dataSource: Data[];
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
};

function Table<Data extends IDObject>(props: TableProps<Data>) {
  const kit = useUIKit();
  const { t } = useTranslation();
  const {
    loading,
    error,
    dataSource,
    rowKey,
    columns,
    scroll,
    currentPage,
    currentSize,
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
    <div ref={wrapperRef} className={cx(TableContainerStyle, props.className)}>
      <kit.table
        tableLayout="fixed"
        rowSelection={{
          onChange: (keys, rows) => {
            onSelect?.(keys, rows);
          },
        }}
        columns={columns}
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
