import { IResourceComponentsProps } from '@refinedev/core';
import { Pod } from 'kubernetes-types/core/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageShow } from '../../../components/PageShow';
import { ConditionsField } from '../../../components/ShowContent/fields';
import { PodModel } from '../../../model';
import { WithId } from '../../../types';

export const PodShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  return (
    <PageShow<WithId<Pod>, PodModel>
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
            title: i18n.t('workload'),
            path: ['metadata', 'ownerReferences', '0', 'name'],
          },
          {
            key: 'Node',
            title: i18n.t('node_name'),
            path: ['spec', 'nodeName'],
          },
          {
            key: 'readyDisplay',
            title: 'Ready',
            path: ['readyDisplay'],
          },
        ],
        [ConditionsField(i18n)],
      ]}
      formatter={d => new PodModel(d)}
    />
  );
};
