import { useUIKit, TableProps as BaseTableProps } from '@cloudtower/eagle';
import { RequiredColumnProps } from '@cloudtower/eagle/dist/spec/base';
import { css } from '@linaria/core';
import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent from './ErrorContent';
import { AuxiliaryLine } from './TableWidgets';

const TableContainerStyle = css`
  width: 100%;
  border-top: 1px solid rgba(211, 218, 235, 0.6);
`;

export type IDObject = { id: string };

export type Column<Data extends IDObject> = RequiredColumnProps<Data> & {
  display: boolean;
};

export type TableProps<Data extends IDObject> = {
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
    <div className={TableContainerStyle}>
      <div>
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
        />
        <AuxiliaryLine ref={auxiliaryLineRef}></AuxiliaryLine>
      </div>
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
