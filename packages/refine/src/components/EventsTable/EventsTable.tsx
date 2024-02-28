import { useList, useParsed } from '@refinedev/core';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AgeColumnRenderer,
  CommonSorter,
  NameSpaceColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { EventModel } from '../../models';
import Table from '../Table';

export const EventsTable: React.FC = ({ }) => {
  const { i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading } = useList<EventModel>({
    resource: 'events',
    meta: { resourceBasePath: '/apis/events.k8s.io/v1', kind: 'Event' },
  });
  const parsed = useParsed();

  const columns = useMemo(
    () => [
      NameSpaceColumnRenderer(i18n),
      {
        key: 'type',
        display: true,
        dataIndex: ['type'],
        title: i18n.t('dovetail.type'),
        sortable: true,
        sorter: CommonSorter(['type']),
      },
      {
        key: 'reason',
        display: true,
        dataIndex: ['reason'],
        title: i18n.t('dovetail.reason'),
        sortable: true,
        sorter: CommonSorter(['reason']),
      },
      {
        key: 'object',
        display: true,
        dataIndex: ['regarding', 'name'],
        title: i18n.t('dovetail.object'),
        sortable: true,
        sorter: CommonSorter(['regarding', 'name']),
      },
      {
        key: 'note',
        display: true,
        dataIndex: ['note'],
        title: i18n.t('dovetail.note'),
        sortable: true,
        sorter: CommonSorter(['note']),
      },
      AgeColumnRenderer(i18n, { title: i18n.t('dovetail.last_seen') }),
    ],
    [i18n]
  );

  const dataSource = useMemo<EventModel[]>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data?.data.filter((d: any) => {
      const objectId = `${d.regarding.namespace}/${d.regarding.name}`;
      return objectId === parsed.id;
    }) as EventModel[];
  }, [data?.data, parsed]);

  return (
    <Table
      tableKey="events"
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
