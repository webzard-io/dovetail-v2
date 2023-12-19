import { useList, useParsed } from '@refinedev/core';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AgeColumnRenderer,
  CommonSorter,
  NameSpaceColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { ResourceModel } from '../../models';
import { addId } from '../../utils/addId';
import Table from '../Table';

export const EventsTable: React.FC = ({}) => {
  const { i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading } = useList<ResourceModel>({
    resource: 'events',
    meta: { resourceBasePath: '/apis/events.k8s.io/v1', kind: 'Event' },
  });
  const parsed = useParsed();

  const columns = useMemo(
    () => [
      NameSpaceColumnRenderer(),
      {
        key: 'type',
        display: true,
        dataIndex: ['rawYaml', 'type'],
        title: i18n.t('dovetail.type'),
        sortable: true,
        sorter: CommonSorter(['rawYaml', 'type']),
      },
      {
        key: 'reason',
        display: true,
        dataIndex: ['rawYaml', 'reason'],
        title: i18n.t('dovetail.reason'),
        sortable: true,
        sorter: CommonSorter(['rawYaml', 'reason']),
      },
      {
        key: 'object',
        display: true,
        dataIndex: ['rawYaml', 'regarding', 'name'],
        title: i18n.t('dovetail.object'),
        sortable: true,
        sorter: CommonSorter(['rawYaml', 'regarding', 'name']),
      },
      {
        key: 'note',
        display: true,
        dataIndex: ['rawYaml', 'note'],
        title: i18n.t('dovetail.note'),
        sortable: true,
        sorter: CommonSorter(['rawYaml', 'note']),
      },
      AgeColumnRenderer(),
    ],
    [i18n]
  );

  const dataSource = useMemo<ResourceModel[]>(
    () =>
      addId(data?.data || [], 'metadata.uid' as any).filter((d: any) => {
        const objectId = `${d.regarding.namespace}/${d.regarding.name}`;
        return objectId === parsed.id;
      }) as ResourceModel[],
    [data?.data, parsed]
  );

  return (
    <Table
      tableKey='events'
      loading={isLoading}
      data={dataSource || []}
      columns={columns}
      rowKey="id"
      error={false}
      currentPage={currentPage}
      onPageChange={p => setCurrentPage(p)}
      currentSize={10}
      refetch={() => null}
    />
  );
};
