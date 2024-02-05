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
      showConfig={{
        groups: [{
          fields: [
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
          ]
        }],
        tabs: [
          {
            key: 'container',
            title: i18n.t('dovetail.container'),
            path: [],
            renderContent: (_, record) => {
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
            renderContent: (_, record) => {
              return <PodLog pod={record} />;
            },
          },
        ],
      }}
    />
  );
};
