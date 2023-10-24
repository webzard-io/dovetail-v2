import { Icon, RequiredColumnProps, useUIKit } from '@cloudtower/eagle';
import {
  CheckmarkDoneSuccessCorrect16BoldGreenIcon,
  XmarkFailed16BoldRedIcon,
} from '@cloudtower/icons-react';
import { Event } from 'kubernetes-types/core/v1';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AgeColumnRenderer,
  CommonSorter,
  NameSpaceColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { WithId } from '../../types';
import { addId } from '../../utils/addId';
import { StateTag } from '../StateTag';
import Time from '../Time';
import { useList, useParsed, useShow } from '@refinedev/core';
import { ResourceModel } from '../../model';
import Table from '../Table';

type Props = {};

export const EventsTable: React.FC<Props> = ({}) => {
  const kit = useUIKit();
  const { i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const parsed = useParsed();

  const { data, isLoading } = useList({
    resource: 'events',
    meta: { resourceBasePath: '/apis/events.k8s.io/v1', kind: 'Event' },
  });
  const columns = useMemo(
    () => [
      NameSpaceColumnRenderer(i18n),
      {
        key: 'type',
        display: true,
        dataIndex: ['rawYaml', 'type'],
        title: i18n.t('type'),
        sortable: true,
        sorter: CommonSorter(['rawYaml', 'type']),
      },
      {
        key: 'reason',
        display: true,
        dataIndex: ['rawYaml', 'reason'],
        title: i18n.t('reason'),
        sortable: true,
        sorter: CommonSorter(['rawYaml', 'reason']),
      },
      {
        key: 'object',
        display: true,
        dataIndex: ['rawYaml', 'regarding', 'name'],
        title: i18n.t('object'),
        sortable: true,
        sorter: CommonSorter(['rawYaml', 'regarding', 'name']),
      },
      {
        key: 'note',
        display: true,
        dataIndex: ['rawYaml', 'note'],
        title: i18n.t('note'),
        sortable: true,
        sorter: CommonSorter(['rawYaml', 'note']),
      },
      AgeColumnRenderer(i18n),
    ],
    [i18n]
  );

  const dataSource = useMemo(
    () =>
      addId(data?.data || [], 'metadata.uid')
        .filter(d => {
          const objectId = `${d.regarding.namespace}/${d.regarding.name}`;
          return objectId === parsed.id;
        })
        .map(d => new ResourceModel(d)),
    [data?.data, parsed]
  );

  return (
    <Table
      loading={isLoading}
      dataSource={dataSource || []}
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
