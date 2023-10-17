import { css } from '@linaria/core';
import React from 'react';
import Table from 'src/components/Table';
import { TableProps } from 'src/components/Table';
import { TableToolBar } from 'src/components/Table/TableToolBar';
import { ResourceModel } from 'src/model';

const ListPageStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TableStyle = css`
  &.table-wrapper {
    height: auto;
    flex-shrink: 1;
    min-height: 0;
  }
`;

interface ListPageProps<T extends ResourceModel> {
  title: string;
  selectedKeys: string[];
  tableProps: TableProps<T>;
}

export function ListPage<T extends ResourceModel>(props: ListPageProps<T>) {
  const { title, selectedKeys, tableProps } = props;

  return (
    <div className={ListPageStyle}>
      <TableToolBar title={title} selectedKeys={selectedKeys} />
      <Table {...tableProps} className={TableStyle} scroll={{ y: 'calc(100% - 48px)' }} />
    </div>
  );
}
