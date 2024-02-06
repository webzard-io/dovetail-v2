import { Condition } from 'kubernetes-types/meta/v1';
import React from 'react';
import i18n from '../../i18n';
import {
  JobModel,
  ResourceModel,
  WorkloadModel,
  WorkloadBaseModel,
  CronJobModel,
} from '../../models';
import { ExtendObjectMeta } from '../../plugins/relation-plugin';
import { ConditionsTable } from '../ConditionsTable';
import { CronjobJobsTable } from '../CronjobJobsTable';
import { ImageNames } from '../ImageNames';
import { KeyValue } from '../KeyValue';
import Time from '../Time';
import { WorkloadPodsTable } from '../WorkloadPodsTable';
import { WorkloadReplicas } from '../WorkloadReplicas';

export type ShowField<Model extends ResourceModel> = {
  key: string;
  title: string;
  path: string[];
  render?: (val: unknown, record: Model, field: ShowField<Model>) => React.ReactElement | undefined;
};

export const ImageField = (): ShowField<WorkloadBaseModel> => {
  return {
    key: 'Image',
    title: i18n.t('dovetail.image'),
    path: ['imageNames'],
    render(value) {
      return <ImageNames value={value as string[]} />;
    },
  };
};

export const ReplicaField = (): ShowField<WorkloadModel> => {
  return {
    key: 'Replicas',
    title: i18n.t('dovetail.replicas'),
    path: ['status', 'replicas'],
    render: (_, record, field) => {
      return <WorkloadReplicas record={record} field={field} editable />;
    },
  };
};

export const ConditionsField = (): ShowField<ResourceModel> => {
  return {
    key: 'Conditions',
    title: i18n.t('dovetail.condition'),
    path: ['status', 'conditions'],
    render: value => {
      return <ConditionsTable conditions={value as Condition[]} />;
    },
  };
};

export const PodsField = (): ShowField<WorkloadModel> => {
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

export const JobsField = (): ShowField<JobModel | CronJobModel> => {
  return {
    key: 'jobs',
    title: 'Jobs',
    path: [],
    render: (_, record) => {
      return (
        <CronjobJobsTable
          owner={{
            apiVersion: record.apiVersion || '',
            kind: record.kind || '',
            name: record.metadata?.name || '',
            namespace: record.metadata?.namespace || '',
            uid: record.metadata?.uid || '',
          }}
        />
      );
    },
  };
};

export const DataField = (): ShowField<ResourceModel> => {
  return {
    key: 'data',
    title: i18n.t('dovetail.data'),
    path: ['data'],
    render: val => {
      return <KeyValue value={val as Record<string, string>} />;
    },
  };
};

export const SecretDataField = (): ShowField<ResourceModel> => {
  return {
    key: 'data',
    title: i18n.t('dovetail.data'),
    path: ['data'],
    render: val => {
      const decodeVal: Record<string, string> = {};
      for (const key in val as Record<string, string>) {
        decodeVal[key] = atob((val as Record<string, string>)[key]);
      }
      return <KeyValue value={decodeVal} />;
    },
  };
};

export const StartTimeField = (): ShowField<JobModel> => {
  return {
    key: 'started',
    title: i18n.t('dovetail.started'),
    path: ['status', 'startTime'],
    render(value) {
      return <Time date={value as string} />;
    },
  };
};

export const ServiceTypeField = (): ShowField<ResourceModel> => {
  return {
    key: 'type',
    title: i18n.t('dovetail.type'),
    path: ['spec', 'type'],
  };
};

export const ClusterIpField = (): ShowField<ResourceModel> => {
  return {
    key: 'clusterIp',
    title: i18n.t('dovetail.clusterIp'),
    path: ['spec', 'clusterIP'],
  };
};

export const SessionAffinityField = (): ShowField<ResourceModel> => {
  return {
    key: 'clusterIp',
    title: i18n.t('dovetail.sessionAffinity'),
    path: ['spec', 'sessionAffinity'],
  };
};

export const ServicePodsField = (): ShowField<ResourceModel> => {
  return {
    key: 'pods',
    title: 'Pods',
    path: [],
    render: (_, record) => {
      return (
        <WorkloadPodsTable
          selector={
            (record.metadata as ExtendObjectMeta).relations?.find(r => {
              return r.kind === 'Pod' && r.type === 'selects';
            })?.selector
          }
        />
      );
    },
  };
};
