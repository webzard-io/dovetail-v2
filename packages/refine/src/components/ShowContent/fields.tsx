import { i18n as I18nType } from 'i18next';
import { Condition } from 'kubernetes-types/meta/v1';
import React from 'react';
import { KeyValueData } from 'src/components/KeyValueData';
import { Tags } from 'src/components/Tags';
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
  title?: string;
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

export enum AreaType {
  Inline = 'Inline',
  Grid = 'Grid'
}

export type ShowArea<Model extends ResourceModel> = {
  type?: AreaType;
  fields: ShowField<Model>[];
};

export type ShowGroup<Model extends ResourceModel> = {
  title?: string;
  areas: ShowArea<Model>[];
};

export type ShowTab<Model extends ResourceModel> = {
  title: string;
  key: string;
  groups: ShowGroup<Model>[];
};

export interface ShowConfig<Model extends ResourceModel = ResourceModel> {
  tabs?: ShowTab<Model>[];
}

export const ImageField = <Model extends WorkloadBaseModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'Image',
    title: i18n.t('dovetail.image'),
    path: ['imageNames'],
    renderContent(value) {
      return <ImageNames value={value as string[]} />;
    },
  };
};

export const ReplicaField = <Model extends WorkloadModel>(): ShowField<Model> => {
  return {
    key: 'Replicas',
    path: ['status', 'replicas'],
    renderContent: (_, record) => {
      return <WorkloadReplicas record={record} editable />;
    },
  };
};

export const ConditionsField = <Model extends ResourceModel>(): ShowField<Model> => {
  return {
    key: 'Conditions',
    path: ['status', 'conditions'],
    renderContent: value => {
      return <ConditionsTable conditions={value as Condition[]} />;
    },
  };
};

export const PodsField = <Model extends WorkloadBaseModel>(): ShowField<Model> => {
  return {
    key: 'pods',
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
>(): ShowField<Model> => {
  return {
    key: 'jobs',
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
          hideToolBar
        />
      );
    },
  };
};

export const DataField = <Model extends ResourceModel>(): ShowField<Model> => {
  return {
    key: 'data',
    path: ['data'],
    renderContent: val => {
      return <KeyValue value={val as Record<string, string>} />;
    },
  };
};

export const SecretDataField = <Model extends ResourceModel>(): ShowField<Model> => {
  return {
    key: 'data',
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
    renderContent(value) {
      return <Time date={value as string} />;
    },
  };
};

export const ServiceTypeField = <Model extends ServiceModel>(i18n: I18nType): ShowField<Model> => {
  return {
    key: 'type',
    title: i18n.t('dovetail.type'),
    path: ['spec', 'type'],
  };
};

export const ClusterIpField = <Model extends ServiceModel>(i18n: I18nType): ShowField<Model> => {
  return {
    key: 'clusterIp',
    title: i18n.t('dovetail.clusterIp'),
    path: ['spec', 'clusterIP'],
  };
};

export const SessionAffinityField = <Model extends ServiceModel>(i18n: I18nType): ShowField<Model> => {
  return {
    key: 'clusterIp',
    title: i18n.t('dovetail.sessionAffinity'),
    path: ['spec', 'sessionAffinity'],
  };
};

export const ServicePodsField = <Model extends ResourceModel>(): ShowField<Model> => {
  return {
    key: 'pods',
    path: [],
    renderContent: (_, record) => {
      return (
        <WorkloadPodsTable
          selector={
            (record.metadata as ExtendObjectMeta).relations?.find(r => {
              return r.kind === 'Pod' && r.type === 'selects';
            })?.selector
          }
          hideToolbar
        />
      );
    },
  };
};

export const IngressRulesTableTabField = <Model extends IngressModel>(): ShowField<Model> => {
  return {
    key: 'rules',
    path: ['spec', 'rules'],
    renderContent: (_, record) => {
      return <IngressRulesTable ingress={record} />;
    },
  };
};

export const EventsTableTabField = <Model extends ResourceModel>(): ShowField<Model> => {
  return {
    key: 'event',
    path: [],
    renderContent: () => {
      return <EventsTable />;
    },
  };
};

export const NamespaceField = <Model extends ResourceModel>(i18n: I18nType): ShowField<Model> => ({
  key: 'NameSpace',
  title: i18n.t('dovetail.namespace'),
  path: ['metadata', 'namespace'],
});

export const AgeField = <Model extends ResourceModel>(i18n: I18nType): ShowField<Model> => ({
  key: 'Age',
  title: i18n.t('dovetail.created_time'),
  path: ['metadata', 'creationTimestamp'],
  renderContent(value) {
    return <Time date={new Date(value as string)} />;
  },
});

export const LabelsField = <Model extends ResourceModel>(i18n: I18nType): ShowField<Model> => ({
  key: 'Labels',
  title: i18n.t('dovetail.label'),
  path: ['metadata', 'labels'],
  renderContent: value => {
    if (!value) {
      return <>-</>;
    }

    return <Tags value={value as Record<string, string>} />;
  },
});

export const AnnotationsField = <Model extends ResourceModel>(i18n: I18nType): ShowField<Model> => ({
  key: 'Annotations',
  title: i18n.t('dovetail.annotation'),
  path: ['metadata', 'annotations'],
  renderContent: value => {
    return <KeyValueData datas={value as Record<string, string>} expandable />;
  },
});
