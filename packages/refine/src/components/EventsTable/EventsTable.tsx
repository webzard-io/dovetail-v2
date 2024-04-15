import { StatusCapsule, StatusCapsuleColor } from '@cloudtower/eagle';
import { cx } from '@linaria/core';
import { useParsed, CrudFilters } from '@refinedev/core';
import React, { useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent from 'src/components/ErrorContent';
import { StateTagStyle } from 'src/components/StateTag';
import ComponentContext from 'src/contexts/component';
import { useEagleTable } from 'src/hooks/useEagleTable/useEagleTable';
import {
  AgeColumnRenderer,
  CommonSorter,
} from '../../hooks/useEagleTable/columns';
import { EventModel } from '../../models';
import BaseTable from '../Table';

export const EventsTable: React.FC = ({ }) => {
  const { i18n } = useTranslation();
  const parsed = useParsed();
  const [regardingNamespace, regardingName] = (parsed?.id as string)?.split('/');

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
  const params = useMemo(() => ({
    columns,
    tableProps: {
      defaultSize: 50,
    },
    useTableParams: {
      resource: 'events',
      meta: { resourceBasePath: '/apis/events.k8s.io/v1', kind: 'Event' },
      filters: {
        permanent: [{
          operator: 'and',
          value: [
            {
              field: 'regarding.namespace',
              operator: 'eq',
              value: regardingNamespace
            },
            {
              field: 'regarding.name',
              operator: 'eq',
              value: regardingName
            },
          ]
        }] as CrudFilters
      }
    }
  }), [columns, regardingName, regardingNamespace]);
  const { tableProps } = useEagleTable<EventModel>(params);

  const component = useContext(ComponentContext);
  const Table = component.Table || BaseTable;

  if (!tableProps.data?.length && !tableProps.loading) {
    return <ErrorContent
      errorText={i18n.t('dovetail.no_resource', { kind: i18n.t('dovetail.event') })}
    />;
  }

  return (
    <Table
      {...tableProps}
      tableKey="events"
      showMenuColumn={false}
    />
  );
};
