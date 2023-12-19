import { i18n } from 'i18next';
import { ExtendObjectMeta, WorkloadBaseModel } from 'k8s-api-provider';
import { JobModel, ResourceModel, WorkloadModel } from 'k8s-api-provider';
import { Condition } from 'kubernetes-types/meta/v1';
import React from 'react';
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
  render?: (val: unknown, record: Model) => React.ReactElement | undefined;
};

export const ImageField = <Model extends WorkloadBaseModel>(
  i18n: i18n
): ShowField<Model> => {
  return {
    key: 'Image',
    title: i18n.t('image'),
    path: ['imageNames'],
    render(value) {
      return <ImageNames value={value as string[]} />;
    },
  };
};

export const ReplicaField = (i18n: i18n): ShowField<WorkloadModel> => {
  return {
    key: 'Replicas',
    title: i18n.t('replicas'),
    path: ['status', 'replicas'],
    render: (_, record) => {
      return <WorkloadReplicas record={record} />;
    },
  };
};

export const ConditionsField = (i18n: i18n): ShowField<ResourceModel> => {
  return {
    key: 'Conditions',
    title: i18n.t('condition'),
    path: ['status', 'conditions'],
    render: value => {
      return <ConditionsTable conditions={value as Condition[]} />;
    },
  };
};

export const PodsField = (_: i18n): ShowField<WorkloadBaseModel> => {
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

export const JobsField = (_: i18n): ShowField<WorkloadBaseModel> => {
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

export const DataField = (i18n: i18n): ShowField<ResourceModel> => {
  return {
    key: 'data',
    title: i18n.t('data'),
    path: ['rawYaml', 'data'],
    render: val => {
      return <KeyValue value={val as Record<string, string>} />;
    },
  };
};

export const SecretDataField = (i18n: i18n): ShowField<ResourceModel> => {
  return {
    key: 'data',
    title: i18n.t('data'),
    path: ['rawYaml', 'data'],
    render: (val) => {
      const decodeVal: Record<string, string> = {};
      for (const key in val as Record<string, string>) {
        decodeVal[key] = atob((val as Record<string, string>)[key]);
      }
      return <KeyValue value={decodeVal} />;
    },
  };
};

export const StartTimeField = (i18n: i18n): ShowField<JobModel> => {
  return {
    key: 'started',
    title: i18n.t('started'),
    path: ['status', 'startTime'],
    render(value) {
      return <Time date={value as string} />;
    },
  };
};

export const ServiceTypeField = (i18n: i18n): ShowField<ResourceModel> => {
  return {
    key: 'type',
    title: i18n.t('dovetail.type'),
    path: ['rawYaml', 'spec', 'type'],
  };
};

export const ClusterIpField = (i18n: i18n): ShowField<ResourceModel> => {
  return {
    key: 'clusterIp',
    title: i18n.t('dovetail.clusterIp'),
    path: ['rawYaml', 'spec', 'clusterIP'],
  };
};

export const SessionAffinityField = (i18n: i18n): ShowField<ResourceModel> => {
  return {
    key: 'clusterIp',
    title: i18n.t('dovetail.sessionAffinity'),
    path: ['rawYaml', 'spec', 'sessionAffinity'],
  };
};

export const ServicePodsField = (_: i18n): ShowField<ResourceModel> => {
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
