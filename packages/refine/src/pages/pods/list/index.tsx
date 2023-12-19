import { IResourceComponentsProps, useList } from '@refinedev/core';
import { PodModel, PodMetricsModel } from 'k8s-api-provider';
import { compact } from 'lodash-es';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ListPage } from 'src/components/ListPage';
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

export const PodList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

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
      AgeColumnRenderer(i18n),
    ]),
    tableProps: {
      currentSize: 10,
    },
  });

  return <ListPage title="Pod" selectedKeys={selectedKeys} tableProps={tableProps} />;
};
