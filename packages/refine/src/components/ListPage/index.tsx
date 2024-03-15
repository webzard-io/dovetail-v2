import { Divider } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { useResource } from '@refinedev/core';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent from 'src/components/ErrorContent';
import { NamespacesFilter } from 'src/components/NamespacesFilter';
import BaseTable from 'src/components/Table';
import { TableProps } from 'src/components/Table';
import { TableToolBar } from 'src/components/Table/TableToolBar';
import ComponentContext from 'src/contexts/component';
import ConfigsContext from 'src/contexts/configs';
import { ResourceModel } from '../../models';

const ListPageStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ListContentStyle = css`
  padding: 12px 24px;
  flex: 1;
  display: flex;
  min-height: 0;
  flex-direction: column;
`;
const TableStyle = css`
  flex: 1;
  min-height: 0;

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
  const { t } = useTranslation();
  const Table = TableComponent || BaseTable;
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);
  const config = configs[resource?.name || ''];

  return (
    <div className={ListPageStyle}>
      <TableToolBar selectedKeys={selectedKeys} description={config?.description} />
      <Divider style={{ margin: 0, minHeight: 1 }} />
      <div className={ListContentStyle}>
        <NamespacesFilter className={NamespaceFilterStyle} />
        <div className={TableStyle}>
          {
            !(tableProps.data.length || tableProps.loading) ? (
              <ErrorContent errorText={tableProps.empty || t('dovetail.no_resource', { kind: ` ${config.kind}` })} />
            ) : (
              <Table
                {...tableProps}
                empty={tableProps.empty || t('dovetail.no_resource', { kind: ` ${config.kind}` })}
                className={cx(tableProps.className)}
                scroll={{ y: 'calc(100% - 48px)' }}
              />
            )
          }
        </div>
      </div>
    </div>
  );
}
