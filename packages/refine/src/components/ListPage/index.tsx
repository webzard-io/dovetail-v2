import { css, cx } from '@linaria/core';
import React, { useContext } from 'react';
import BaseTable from 'src/components/Table';
import { TableProps } from 'src/components/Table';
import { TableToolBar } from 'src/components/Table/TableToolBar';
import ComponentContext from 'src/contexts/component';
import { FormType } from 'src/types';
import { ResourceModel } from '../../models';

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
  formType?: FormType;
}

export function ListPage<T extends ResourceModel>(props: ListPageProps<T>) {
  const { title, selectedKeys, tableProps, formType } = props;
  const { Table: TableComponent } = useContext(ComponentContext);
  const Table = TableComponent || BaseTable;

  return (
    <div className={ListPageStyle}>
      <TableToolBar title={title} selectedKeys={selectedKeys} formType={formType} />
      <Table
        {...tableProps}
        className={cx(tableProps.className, TableStyle)}
        scroll={{ y: 'calc(100% - 48px)' }}
      />
    </div>
  );
}
