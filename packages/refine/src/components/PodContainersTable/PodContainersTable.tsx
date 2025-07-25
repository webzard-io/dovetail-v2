import { RequiredColumnProps } from '@cloudtower/eagle';
import { ContainerStatus } from 'kubernetes-types/core/v1';
import { get } from 'lodash-es';
import React, { useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';
import BaseTable from 'src/components/InternalBaseTable';
import ValueDisplay from 'src/components/ValueDisplay';
import ComponentContext from 'src/contexts/component';
import { addDefaultRenderToColumns } from 'src/hooks/useEagleTable';
import useTableData from 'src/hooks/useTableData';
import { ResourceState } from '../../constants';
import { CommonSorter } from '../../hooks/useEagleTable/columns';
import { WithId } from '../../types';
import { addId } from '../../utils/addId';
import { StateTag } from '../StateTag';
import { Time } from '../Time';

type Props = {
  containerStatuses: ContainerStatus[];
  initContainerStatuses: ContainerStatus[];
};

export const PodContainersTable: React.FC<Props> = ({
  containerStatuses,
  initContainerStatuses,
}) => {
  const { i18n } = useTranslation();
  const component = useContext(ComponentContext);
  const Table = component.Table || BaseTable;
  const currentSize = 10;

  const columns: RequiredColumnProps<WithId<ContainerStatus> & { startedAt: string }>[] = useMemo(
    () => [
      {
        key: 'name',
        dataIndex: ['name'],
        title: i18n.t('dovetail.name'),
        sortable: true,
        sorter: CommonSorter(['name']),
        width: 200,
      },
      {
        key: 'state',
        dataIndex: ['state'],
        title: i18n.t('dovetail.state'),
        sortable: true,
        sorter: CommonSorter(['state']),
        width: 120,
        render: v => <StateTag state={Object.keys(v)[0] as ResourceState} hideBackground />,
      },
      {
        key: 'image',
        dataIndex: ['image'],
        title: i18n.t('dovetail.image'),
        sortable: true,
        width: 383,
        sorter: CommonSorter(['image']),
      },
      {
        key: 'init',
        dataIndex: [],
        title: i18n.t('dovetail.type'),
        width: 120,
        render: (_, record) => {
          const isInit = initContainerStatuses.some(
            c => c.containerID === record.containerID
          );

          return i18n.t(isInit ? 'dovetail.init_container' : 'dovetail.regular_container');
        },
      },
      {
        key: 'restarts',
        dataIndex: ['restarts'],
        title: i18n.t('dovetail.restarts'),
        sortable: true,
        align: 'right',
        width: 120,
        sorter: CommonSorter(['restarts']),
      },
      {
        key: 'started',
        dataIndex: ['startedAt'],
        title: i18n.t('dovetail.created_time'),
        sortable: true,
        sorter: CommonSorter(['startedAt']),
        width: 120,
        render: (_: string, record) => {
          const value = record.startedAt;

          if (value) return <Time date={new Date(value)} />;

          return <ValueDisplay value="" />;
        },
      },
    ],
    [i18n, initContainerStatuses]
  );

  const dataSource = useMemo(
    () => addId(containerStatuses.concat(initContainerStatuses), 'containerID').map(container => ({
      ...container,
      startedAt: get(container, ['state', 'running', 'startedAt']) || get(container, ['state', 'terminated', 'startedAt']),
    })),
    [containerStatuses, initContainerStatuses]
  );

  const {
    data: finalData,
    currentPage,
    onPageChange,
    onSorterChange,
  } = useTableData({
    data: dataSource,
    columns,
    defaultSorters: [{
      field: 'startedAt',
      order: 'desc'
    }]
  });

  if (dataSource.length === 0) {
    return <ErrorContent
      errorText={i18n.t('dovetail.no_resource', { kind: i18n.t('dovetail.container') })}
      type={ErrorContentType.Card}
    />;
  }

  return (
    <Table<WithId<ContainerStatus> & { startedAt: string }>
      tableKey="podContainers"
      loading={false}
      data={finalData}
      total={dataSource.length}
      columns={addDefaultRenderToColumns<WithId<ContainerStatus> & { startedAt: string }>(columns)}
      rowKey="containerID"
      error={false}
      defaultSize={currentSize}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onSorterChange={onSorterChange}
      showMenuColumn={false}
    />
  );
};
