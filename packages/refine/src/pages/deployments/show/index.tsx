import { IResourceComponentsProps } from '@refinedev/core';
import { ExtendObjectMeta } from 'k8s-api-provider';
import { Condition } from 'kubernetes-types/meta/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConditionsTable } from '../../../components/ConditionsTable';
import { PageShow } from '../../../components/PageShow';
import { ShowField } from '../../../components/ShowContent/fields';
import { WorkloadPodsTable } from '../../../components/WorkloadPodsTable';

export const DeploymentShow: React.FC<IResourceComponentsProps> = () => {
  const { t } = useTranslation();

  const ImageField: ShowField = {
    key: 'Image',
    title: t('image'),
    path: ['spec', 'template', 'spec', 'containers', '0', 'image'],
  };

  const ReplicaField: ShowField = {
    key: 'Replicas',
    title: t('replicas'),
    path: ['status', 'replicas'],
    render: (_, record) => {
      return (
        <span>
          {record.status.readyReplicas}/{record.status.replicas}
        </span>
      );
    },
  };

  const ConditionsField: ShowField = {
    key: 'Conditions',
    title: t('condition'),
    path: ['status', 'conditions'],
    render: value => {
      return <ConditionsTable conditions={value as Condition[]} />;
    },
  };

  return (
    <PageShow
      fieldGroups={[
        [],
        [ImageField, ReplicaField],
        [
          {
            key: 'pods',
            title: 'Pods',
            path: [],
            render: (_, record) => {
              return (
                <WorkloadPodsTable
                  selector={
                    (record.metadata as ExtendObjectMeta).relations?.find(r => {
                      return r.kind === 'Pod' && r.type === 'creates';
                    })?.selector
                  }
                />
              );
            },
          },
          ConditionsField,
        ],
      ]}
    />
  );
};
