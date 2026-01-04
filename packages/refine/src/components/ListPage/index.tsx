import { Divider } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { useResource } from '@refinedev/core';
import React, { useContext } from 'react';
import { InternalTableProps } from 'src/components/InternalBaseTable';
import { NamespacesFilter } from 'src/components/NamespacesFilter';
import { Table } from 'src/components/Table';
import { TableToolBar } from 'src/components/TableToolbar';
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
  tableProps: InternalTableProps<T>;
  contentClassName?: string;
  belowToolBarContent?: React.ReactNode;
  customFilterBar?: React.ReactNode;
  isSearching?: boolean;
}

export function ListPage<T extends ResourceModel>(props: ListPageProps<T>) {
  const {
    selectedKeys,
    tableProps,
    contentClassName,
    belowToolBarContent,
    customFilterBar,
    isSearching,
  } = props;
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);
  const config = configs[resource?.name || ''];

  return (
    <div className={ListPageStyle}>
      {!config.hideListToolBar ? (
        <>
          <TableToolBar
            selectedKeys={selectedKeys}
            title={config?.customListTitle || config?.displayName || config.kind}
            description={config?.description}
            hideCreate={config?.hideCreate}
          />
          {belowToolBarContent}
          <Divider
            style={{
              margin: 0,
              minHeight: 1,
              marginRight: 24,
              width: 'calc(100% - 24px)',
            }}
          />
        </>
      ) : undefined}

      <div
        className={cx(ListContentStyle, contentClassName)}
        style={
          !customFilterBar && !config.customFilterBar && config.nonNsResource
            ? { paddingTop: 0 }
            : {}
        }
      >
        {customFilterBar ||
          config.customFilterBar ||
          (!config.nonNsResource && (
            <NamespacesFilter className={NamespaceFilterStyle} />
          ))}
        <div className={TableStyle}>
          <Table
            tableProps={{
              ...tableProps,
              scroll: { y: 'calc(100% - 48px)' },
            }}
            displayName={config?.displayName || config.kind}
            isSearching={isSearching}
          />
        </div>
      </div>
    </div>
  );
}
