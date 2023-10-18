import { IResourceComponentsProps, useList } from '@refinedev/core';
import { Pod } from 'kubernetes-types/core/v1';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ListPage from 'src/components/ListPage';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
  CommonSorter,
  RestartCountColumnRenderer,
  NodeNameColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { PodModel } from 'src/model';
import { PodMetricsModel } from 'src/model/pod-metrics-model';
import { WithId } from 'src/types';
import { PodMetrics } from 'src/types/metric';

export const PodList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  const { data } = useList({
    resource: 'podMetrics',
    meta: {
      resourceBasePath: '/apis/metrics.k8s.io/v1beta1',
      kind: 'PodMetrics',
      k8sResource: 'pods',
    },
  });

  const metricsMap = useMemo(() => {
    return ((data?.data || []) as WithId<PodMetrics>[]).reduce<
      Record<string, PodMetricsModel>
    >((prev, cur) => {
      prev[cur.id] = new PodMetricsModel(cur);
      return prev;
    }, {});
  }, [data]);

  const { tableProps, selectedKeys } = useEagleTable<WithId<Pod>, PodModel>({
    useTableParams: {},
    columns: [
      PhaseColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      WorkloadImageColumnRenderer(i18n),
      {
        key: 'readyDisplay',
        display: true,
        dataIndex: ['readyDisplay'],
        title: 'Ready',
        sortable: true,
        sorter: CommonSorter(['readyDisplay']),
      },
      RestartCountColumnRenderer(i18n),
      NodeNameColumnRenderer(i18n),
      {
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
      {
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
      AgeColumnRenderer(i18n),
    ],
    tableProps: {
      currentSize: 10,
    },
    formatter: d => new PodModel(d),
  });

  return <ListPage title="Pod" selectedKeys={selectedKeys} tableProps={tableProps} />;
};
