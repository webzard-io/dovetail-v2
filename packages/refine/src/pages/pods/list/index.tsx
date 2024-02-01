import { IResourceComponentsProps, useList } from '@refinedev/core';
import { compact } from 'lodash-es';
import React, { useMemo } from 'react';
import { ListPage } from 'src/components/ListPage';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  CommonSorter,
  RestartCountColumnRenderer,
  NodeNameColumnRenderer,
  StateDisplayColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { Column } from '../../../components';
import { PodMetricsModel, PodModel } from '../../../models';

export const PodList: React.FC<IResourceComponentsProps> = () => {

  const { data: metricsData } = useList<PodMetricsModel>({
    resource: 'podMetrics',
    meta: {
      resourceBasePath: '/apis/metrics.k8s.io/v1beta1',
      kind: 'PodMetrics',
      k8sResource: 'pods',
    },
  });

  const metricsMap = useMemo(() => {
    return (metricsData?.data || []).reduce<Record<string, PodMetricsModel>>(
      (prev, cur) => {
        prev[cur.id] = cur;
        return prev;
      },
      {}
    );
  }, [metricsData]);
  const supportMetrics = Boolean(metricsData);

  const { tableProps, selectedKeys } = useEagleTable<PodModel>({
    useTableParams: {},
    columns: compact([
      StateDisplayColumnRenderer(),
      NameColumnRenderer(),
      NameSpaceColumnRenderer(),
      WorkloadImageColumnRenderer(),
      {
        key: 'readyDisplay',
        display: true,
        dataIndex: ['readyDisplay'],
        title: 'Ready',
        sortable: true,
        sorter: CommonSorter(['readyDisplay']),
      },
      RestartCountColumnRenderer(),
      NodeNameColumnRenderer(),
      supportMetrics && {
        key: 'memory_usage',
        display: true,
        dataIndex: ['spec'],
        title: '内存',
        sortable: false,
        align: 'right',
        render(value, record) {
          return metricsMap[record.id]?.usage.memory.si;
        },
      },
      supportMetrics && {
        key: 'cpu_usage',
        display: true,
        dataIndex: ['spec'],
        title: 'CPU',
        sortable: false,
        align: 'right',
        render(value, record) {
          return metricsMap[record.id]?.usage.cpu.si;
        },
      },
      {
        key: 'ip',
        display: true,
        dataIndex: ['status', 'podIP'],
        title: 'IP',
        sortable: true,
        sorter: CommonSorter(['status', 'podIP']),
      },
      AgeColumnRenderer(),
    ]) as Column<PodModel>[],
    tableProps: {
      currentSize: 10,
    },
  });

  return <ListPage title="Pod" selectedKeys={selectedKeys} tableProps={tableProps} />;
};
