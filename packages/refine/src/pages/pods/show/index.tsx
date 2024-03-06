import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageShow } from '../../../components/PageShow';
import { BasicGroup, ConditionsGroup, PodContainersGroup, PodLogTab } from '../../../components/ShowContent';
import { PodModel } from '../../../models';

export const PodShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  return (
    <PageShow<PodModel>
      showConfig={{
        tabs: [
          {
            title: i18n.t('dovetail.detail'),
            key: 'detail',
            groups: [
              BasicGroup(i18n, {
                basicFields: [
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
                    title: i18n.t('dovetail.belong_to_node'),
                    path: ['spec', 'nodeName'],
                  },
                  {
                    key: 'readyDisplay',
                    title: 'Ready',
                    path: ['readyDisplay'],
                  },
                ]
              }),
              PodContainersGroup(i18n),
              ConditionsGroup(i18n),
            ],
          },
          PodLogTab(i18n),
        ],
      }}
    />
  );
};
