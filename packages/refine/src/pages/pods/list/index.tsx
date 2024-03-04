import { IResourceComponentsProps, useList } from '@refinedev/core';
import { compact } from 'lodash-es';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../components';
import { ListPage } from '../../../components/ListPage';
import { useEagleTable } from '../../../hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  CommonSorter,
  RestartCountColumnRenderer,
  NodeNameColumnRenderer,
  StateDisplayColumnRenderer,
  PodWorkloadColumnRenderer,
} from '../../../hooks/useEagleTable/columns';
import { PodMetricsModel, PodModel } from '../../../models';

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
      StateDisplayColumnRenderer(i18n),
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
      PodWorkloadColumnRenderer(i18n),
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
        title: i18n.t('dovetail.ip_address'),
        sortable: true,
        sorter: CommonSorter(['status', 'podIP']),
      },
      AgeColumnRenderer(i18n),
    ]) as Column<PodModel>[],
    tableProps: {
      currentSize: 10,
    },
  });

  return <ListPage selectedKeys={selectedKeys} tableProps={tableProps} />;
};
