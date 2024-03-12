import { StatusCapsule, StatusCapsuleColor } from '@cloudtower/eagle';
import { cx } from '@linaria/core';
import { useList, useParsed } from '@refinedev/core';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent from 'src/components/ErrorContent';
import { StateTagStyle } from 'src/components/StateTag';
import { transformColumns } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  CommonSorter,
} from '../../hooks/useEagleTable/columns';
import { EventModel } from '../../models';
import { Column } from '../Table';
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
      {
        key: 'type',
        display: true,
        dataIndex: ['type'],
        title: i18n.t('dovetail.type'),
        sortable: true,
        render(value: string) {
          const colorMap: Record<string, StatusCapsuleColor> = {
            'Warning': 'red',
            'Normal': 'green',
          };

          return (
            <StatusCapsule color={colorMap[value]} className={cx(StateTagStyle, 'no-background')}>
              {i18n.t(`dovetail.${value.toLowerCase()}`)}
            </StatusCapsule>
          );
        },
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
        key: 'note',
        display: true,
        dataIndex: ['note'],
        title: i18n.t('dovetail.note'),
        sortable: true,
        sorter: CommonSorter(['note']),
      },
      AgeColumnRenderer<EventModel>(i18n, { title: i18n.t('dovetail.last_seen') }),
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

  if (!dataSource?.length && !isLoading) {
    return <ErrorContent
      errorText={i18n.t('dovetail.no_resource', { kind: i18n.t('dovetail.event') })}
      hiddenRetry
    />;
  }

  return (
    <Table
      tableKey="events"
      loading={isLoading}
      data={dataSource || []}
      columns={transformColumns<EventModel, Column<EventModel>>(columns)}
      rowKey="id"
      error={false}
      currentPage={currentPage}
      onPageChange={p => setCurrentPage(p)}
      currentSize={10}
      refetch={() => null}
    />
  );
};
