import { StatusCapsule, StatusCapsuleColor } from '@cloudtower/eagle';
import { cx } from '@linaria/core';
import { useList, useParsed } from '@refinedev/core';
import React, { useMemo, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent from 'src/components/ErrorContent';
import { StateTagStyle } from 'src/components/StateTag';
import ComponentContext from 'src/contexts/component';
import { addDefaultRenderToColumns } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  CommonSorter,
} from '../../hooks/useEagleTable/columns';
import { EventModel } from '../../models';
import { Column } from '../Table';
import BaseTable from '../Table';

export const EventsTable: React.FC = ({ }) => {
  const { i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const currentSize = 50;

  const { data, isLoading } = useList<EventModel>({
    resource: 'events',
    meta: { resourceBasePath: '/apis/events.k8s.io/v1', kind: 'Event' },
    pagination: {
      mode: 'off'
    }
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
        width: 120,
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
        width: 120,
        sorter: CommonSorter(['reason']),
      },
      {
        key: 'note',
        display: true,
        dataIndex: ['note'],
        title: i18n.t('dovetail.note'),
        sortable: true,
        width: 723,
        sorter: CommonSorter(['note']),
      },
      AgeColumnRenderer<EventModel>(i18n, { title: i18n.t('dovetail.last_seen'), width: 160, }, { isRelativeTime: false }),
    ],
    [i18n]
  );
  const component = useContext(ComponentContext);
  const Table = component.Table || BaseTable;

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
    />;
  }

  return (
    <Table
      tableKey="events"
      loading={isLoading}
      data={(dataSource || []).slice((currentPage - 1) * currentSize, currentPage * currentSize)}
      total={dataSource?.length || 0}
      columns={addDefaultRenderToColumns<EventModel, Column<EventModel>>(columns)}
      rowKey="id"
      error={false}
      currentPage={currentPage}
      onPageChange={p => setCurrentPage(p)}
      defaultSize={currentSize}
      refetch={() => null}
      showMenuColumn={false}
    />
  );
};
