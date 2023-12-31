import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PodLog } from 'src/components/PodLog';
import { PageShow } from '../../../components/PageShow';
import { PodContainersTable } from '../../../components/PodContainersTable';
import { ConditionsField } from '../../../components/ShowContent/fields';
import { PodModel } from '../../../models';

export const PodShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  return (
    <PageShow<PodModel>
      fieldGroups={[
        [],
        [
          {
            key: 'podIp',
            title: 'Pod IP',
            path: ['status', 'podIP'],
          },
          {
            key: 'Workload',
            title: i18n.t('dovetail.workload'),
            path: ['metadata', 'ownerReferences', '0', 'name'],
          },
          {
            key: 'Node',
            title: i18n.t('dovetail.node_name'),
            path: ['spec', 'nodeName'],
          },
          {
            key: 'readyDisplay',
            title: 'Ready',
            path: ['readyDisplay'],
          },
        ],
        [
          {
            key: 'container',
            title: i18n.t('dovetail.container'),
            path: [],
            render: (_, record) => {
              return (
                <PodContainersTable
                  containerStatuses={record.status?.containerStatuses || []}
                  initContainerStatuses={record.status?.initContainerStatuses || []}
                />
              );
            },
          },
          ConditionsField(),
          {
            key: 'log',
            title: i18n.t('dovetail.log'),
            path: [],
            render: (_, record) => {
              return <PodLog pod={record} />;
            },
          },
        ],
      ]}
    />
  );
};
