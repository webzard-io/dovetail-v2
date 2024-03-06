import { Icon, RequiredColumnProps, useUIKit } from '@cloudtower/eagle';
import {
  CheckmarkDoneSuccessCorrect16BoldGreenIcon,
  XmarkFailed16BoldRedIcon,
} from '@cloudtower/icons-react';
import { ContainerStatus } from 'kubernetes-types/core/v1';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadState } from '../../constants';
import { CommonSorter } from '../../hooks/useEagleTable/columns';
import { WithId } from '../../types';
import { addId } from '../../utils/addId';
import { StateTag } from '../StateTag';
import Time from '../Time';

type Props = {
  containerStatuses: ContainerStatus[];
  initContainerStatuses: ContainerStatus[];
};

export const PodContainersTable: React.FC<Props> = ({
  containerStatuses,
  initContainerStatuses,
}) => {
  const kit = useUIKit();
  const { i18n } = useTranslation();

  const columns: RequiredColumnProps<WithId<ContainerStatus>>[] = useMemo(
    () => [
      {
        key: 'name',
        dataIndex: ['name'],
        title: i18n.t('dovetail.name'),
        sortable: true,
        sorter: CommonSorter(['name']),
      },
      {
        key: 'state',
        dataIndex: ['state'],
        title: i18n.t('dovetail.state'),
        sortable: true,
        sorter: CommonSorter(['state']),
        render: v => <StateTag state={Object.keys(v)[0] as WorkloadState} hideBackground />,
      },
      {
        key: 'image',
        dataIndex: ['image'],
        title: i18n.t('dovetail.image'),
        sortable: true,
        sorter: CommonSorter(['image']),
      },
      {
        key: 'init',
        dataIndex: [],
        title: i18n.t('dovetail.type'),
        render: (_, record) => {
          const isInit = initContainerStatuses.some(
            c => c.containerID === record.containerID
          );

          return i18n.t(isInit ? 'dovetail.init_container' : 'dovetail.regular_container');
        },
      },
      {
        key: 'restartCount',
        dataIndex: ['restartCount'],
        title: i18n.t('dovetail.restarts'),
        sortable: true,
        sorter: CommonSorter(['restartCount']),
      },
      {
        key: 'started',
        dataIndex: ['state', 'running', 'startedAt'],
        title: i18n.t('dovetail.created_time'),
        sortable: true,
        sorter: CommonSorter(['state', 'running', 'startedAt']),
        render: (value: string) => {
          if (value) return <Time date={new Date(value)} />;
          return <span>-</span>;
        },
      },
    ],
    [i18n, initContainerStatuses]
  );

  const dataSource = useMemo(
    () => addId(containerStatuses.concat(initContainerStatuses), 'containerID'),
    [containerStatuses, initContainerStatuses]
  );

  return (
    <kit.table
      loading={false}
      dataSource={dataSource}
      columns={columns}
      rowKey="containerID"
      error={false}
    />
  );
};
