import { i18n } from 'i18next';
import { ExtendObjectMeta } from 'k8s-api-provider';
import { Condition } from 'kubernetes-types/meta/v1';
import React from 'react';
import { ResourceModel, WorkloadModel } from '../../model';
import { ConditionsTable } from '../ConditionsTable';
import { WorkloadPodsTable } from '../WorkloadPodsTable';

export type ShowField<Model extends ResourceModel> = {
  key: string;
  title: string;
  path: string[];
  render?: (val: unknown, record: Model) => React.ReactElement | undefined;
};

export const ImageField = (i18n: i18n): ShowField<WorkloadModel> => {
  return {
    key: 'Image',
    title: i18n.t('image'),
    path: ['spec', 'template', 'spec', 'containers', '0', 'image'],
  };
};

export const ReplicaField = (i18n: i18n): ShowField<WorkloadModel> => {
  return {
    key: 'Replicas',
    title: i18n.t('replicas'),
    path: ['status', 'replicas'],
    render: (_, record) => {
      return (
        <span>
          {record.status?.readyReplicas}/{record.status?.replicas}
        </span>
      );
    },
  };
};

export const ConditionsField = (i18n: i18n): ShowField<WorkloadModel> => {
  return {
    key: 'Conditions',
    title: i18n.t('condition'),
    path: ['status', 'conditions'],
    render: value => {
      return <ConditionsTable conditions={value as Condition[]} />;
    },
  };
};

export const PodsField = (_: i18n): ShowField<WorkloadModel> => {
  return {
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
  };
};
