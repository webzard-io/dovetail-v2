import { i18n as I18nType } from 'i18next';
import { Condition } from 'kubernetes-types/meta/v1';
import React from 'react';
import {
  JobModel,
  ResourceModel,
  WorkloadModel,
  WorkloadBaseModel,
  CronJobModel,
  IngressModel,
  ServiceModel,
} from '../../models';
import { ExtendObjectMeta } from '../../plugins/relation-plugin';
import { ConditionsTable } from '../ConditionsTable';
import { CronjobJobsTable } from '../CronjobJobsTable';
import { EventsTable } from '../EventsTable';
import { ImageNames } from '../ImageNames';
import { IngressRulesTable } from '../IngressRulesTable';
import { KeyValue } from '../KeyValue';
import Time from '../Time';
import { WorkloadPodsTable } from '../WorkloadPodsTable';
import { WorkloadReplicas } from '../WorkloadReplicas';

export type ShowField<Model extends ResourceModel> = {
  key: string;
  title: string;
  path: string[];
  labelWidth?: string;
  col?: number;
  render?: (
    val: unknown,
    record: Model,
    field: ShowField<Model>
  ) => React.ReactElement | undefined;
  renderContent?: (
    val: unknown,
    record: Model,
    field: ShowField<Model>
  ) => React.ReactElement | undefined;
};

export type ShowTabField<Model extends ResourceModel> = {
  key: string;
  title: string;
  path: string[];
  renderContent?: (
    val: unknown,
    record: Model,
    field: ShowTabField<Model>
  ) => React.ReactElement | undefined;
};

export interface ShowConfig<Model extends ResourceModel = ResourceModel> {
  title?: string;
  descriptions?: ShowField<Model>[];
  groups?: {
    fields: ShowField<Model>[];
  }[];
  tabs?: ShowTabField<Model>[];
}

export const ImageField = <Model extends WorkloadBaseModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'Image',
    title: i18n.t('dovetail.image'),
    path: ['imageNames'],
    col: 12,
    renderContent(value) {
      return <ImageNames value={value as string[]} />;
    },
  };
};

export const ReplicaField = (i18n: I18nType): ShowField<WorkloadModel> => {
  return {
    key: 'Replicas',
    title: i18n.t('dovetail.replicas'),
    path: ['status', 'replicas'],
    renderContent: (_, record) => {
      return <WorkloadReplicas record={record} editable />;
    },
  };
};

export const ConditionsField = <Model extends ResourceModel>(
  i18n: I18nType
): ShowTabField<Model> => {
  return {
    key: 'Conditions',
    title: i18n.t('dovetail.condition'),
    path: ['status', 'conditions'],
    renderContent: value => {
      return <ConditionsTable conditions={value as Condition[]} />;
    },
  };
};

export const PodsField = <Model extends WorkloadBaseModel>(): ShowTabField<Model> => {
  return {
    key: 'pods',
    title: 'Pods',
    path: [],
    renderContent: (_, record) => {
      return (
        <WorkloadPodsTable
          selector={
            (record.metadata as ExtendObjectMeta).relations?.find(r => {
              return r.kind === 'Pod' && r.type === 'creates';
            })?.selector
          }
          hideToolbar
        />
      );
    },
  };
};

export const JobsField = <
  Model extends JobModel | CronJobModel,
>(): ShowTabField<Model> => {
  return {
    key: 'jobs',
    title: 'Jobs',
    path: [],
    renderContent: (_, record) => {
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

export const DataField = (i18n: I18nType): ShowField<ResourceModel> => {
  return {
    key: 'data',
    title: i18n.t('dovetail.data'),
    path: ['data'],
    renderContent: val => {
      return <KeyValue value={val as Record<string, string>} />;
    },
  };
};

export const SecretDataField = (i18n: I18nType): ShowField<ResourceModel> => {
  return {
    key: 'data',
    title: i18n.t('dovetail.data'),
    path: ['data'],
    renderContent: val => {
      const decodeVal: Record<string, string> = {};
      for (const key in val as Record<string, string>) {
        decodeVal[key] = atob((val as Record<string, string>)[key]);
      }
      return <KeyValue value={decodeVal} />;
    },
  };
};

export const StartTimeField = (i18n: I18nType): ShowField<JobModel> => {
  return {
    key: 'started',
    title: i18n.t('dovetail.started'),
    path: ['status', 'startTime'],
    col: 12,
    renderContent(value) {
      return <Time date={value as string} />;
    },
  };
};

export const ServiceTypeField = (i18n: I18nType): ShowField<ServiceModel> => {
  return {
    key: 'type',
    title: i18n.t('dovetail.type'),
    path: ['spec', 'type'],
  };
};

export const ClusterIpField = (i18n: I18nType): ShowField<ServiceModel> => {
  return {
    key: 'clusterIp',
    title: i18n.t('dovetail.clusterIp'),
    path: ['spec', 'clusterIP'],
  };
};

export const SessionAffinityField = (i18n: I18nType): ShowField<ServiceModel> => {
  return {
    key: 'clusterIp',
    title: i18n.t('dovetail.sessionAffinity'),
    path: ['spec', 'sessionAffinity'],
  };
};

export const ServicePodsField = <Model extends ResourceModel>(): ShowTabField<Model> => {
  return {
    key: 'pods',
    title: 'Pods',
    path: [],
    renderContent: (_, record) => {
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

export const IngressRulesTableTabField = <Model extends IngressModel>(
  i18n: I18nType
): ShowTabField<Model> => {
  return {
    key: 'rules',
    title: i18n.t('dovetail.rule'),
    path: ['spec', 'rules'],
    renderContent: (_, record) => {
      return <IngressRulesTable ingress={record} />;
    },
  };
};

export const EventsTableTabField = <Model extends ResourceModel>(
  i18n: I18nType
): ShowTabField<Model> => {
  return {
    key: 'event',
    title: i18n.t('dovetail.event'),
    path: [],
    renderContent: () => {
      return <EventsTable />;
    },
  };
};
