import { Loading, Space } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { LabelSelector } from 'kubernetes-types/meta/v1';
import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';
import ComponentContext from 'src/contexts/component';
import { useEagleTable } from 'src/hooks/useEagleTable';
import { matchSelector } from 'src/utils/match-selector';
import {
  NameColumnRenderer,
  NodeNameColumnRenderer,
  RestartsColumnRenderer,
  StateDisplayColumnRenderer,
  WorkloadImageColumnRenderer,
  PodContainersNumColumnRenderer,
  AgeColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { PodModel } from '../../models';
import BaseTable, { Column } from '../InternalBaseTable';
import { TableToolBar } from '../TableToolbar';

interface WorkloadPodsTableProps {
  className?: string;
  namespace?: string;
  selector?: LabelSelector;
  filter?: (item: PodModel) => boolean;
  hideToolbar?: boolean;
  hideNodeColumn?: boolean;
}

export const WorkloadPodsTable: React.FC<WorkloadPodsTableProps> = ({
  namespace,
  selector,
  className,
  hideToolbar,
  filter,
  hideNodeColumn,
}) => {
  const { i18n } = useTranslation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const component = useContext(ComponentContext);
  const Table = component.Table || BaseTable;
  const currentSize = 10;
  const columns = [
    NameColumnRenderer(i18n, 'pods'),
    StateDisplayColumnRenderer(i18n),
    {
      key: 'ip',
      display: true,
      dataIndex: ['status', 'podIP'],
      title: i18n.t('dovetail.ip_address'),
      sortable: true,
      width: 160,
    },
    hideNodeColumn ? undefined : NodeNameColumnRenderer(i18n),
    WorkloadImageColumnRenderer(i18n),
    PodContainersNumColumnRenderer(i18n),
    RestartsColumnRenderer(i18n),
    AgeColumnRenderer(i18n),
  ].filter(v => !!v) as Column<PodModel>[];

  const { tableProps } = useEagleTable<PodModel>({
    columns,
    useTableParams: {
      resource: 'pods',
      meta: { resourceBasePath: '/api/v1', kind: 'Pod' },
      filters: {
        permanent: [{
          field: '',
          value: '',
          fn(item: PodModel) {
            return filter ? filter(item) : matchSelector(item, selector, namespace);
          }
        }] as any
      }
    }
  });

  if (tableProps.loading) {
    return <Loading />;
  }

  if (tableProps.data?.length === 0) {
    return <ErrorContent
      errorText={i18n.t('dovetail.no_resource', { kind: ` ${i18n.t('dovetail.pod')}` })}
      type={ErrorContentType.Card}
    />;
  }

  return (
    <Space
      direction="vertical"
      className={cx(css`
        width: 100%;
        vertical-align: top;
      `, className)}
    >
      {hideToolbar ? null : (
        <TableToolBar selectedKeys={selectedKeys} hideCreate />
      )}
      <Table
        {...tableProps}
        tableKey="pods"
        onSelect={keys => setSelectedKeys(keys as string[])}
        defaultSize={currentSize}
        showMenuColumn={false}
      />
    </Space>
  );
};
