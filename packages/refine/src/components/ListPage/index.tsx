import { Divider } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import React, { useContext } from 'react';
import { NamespacesFilter } from 'src/components/NamespacesFilter';
import BaseTable from 'src/components/Table';
import { TableProps } from 'src/components/Table';
import { TableToolBar } from 'src/components/Table/TableToolBar';
import ComponentContext from 'src/contexts/component';
import { ResourceModel } from '../../models';

const ListPageStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ListContentStyle = css`
  padding: 12px 24px;
`;
const TableStyle = css`
  &.table-wrapper {
    height: auto;
    flex-shrink: 1;
    min-height: 0;
  }
`;
const NamespaceFilterStyle = css`
  &.ant-select {
    margin-bottom: 12px;
  }
`;

interface ListPageProps<T extends ResourceModel> {
  selectedKeys: string[];
  tableProps: TableProps<T>;
}

export function ListPage<T extends ResourceModel>(props: ListPageProps<T>) {
  const { selectedKeys, tableProps } = props;
  const { Table: TableComponent } = useContext(ComponentContext);
  const Table = TableComponent || BaseTable;

  return (
    <div className={ListPageStyle}>
      <TableToolBar selectedKeys={selectedKeys} />
      <Divider style={{ margin: 0 }} />
      <div className={ListContentStyle}>
        <NamespacesFilter className={NamespaceFilterStyle} />
        <Table
          {...tableProps}
          className={cx(tableProps.className, TableStyle)}
          scroll={{ y: 'calc(100% - 48px)' }}
        />

      </div>
    </div>
  );
}
