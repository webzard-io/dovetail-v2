import { i18n as I18nType } from 'i18next';
import { Unstructured } from 'k8s-api-provider';
import { Condition } from 'kubernetes-types/meta/v1';
import { NetworkPolicy } from 'kubernetes-types/networking/v1';
import React from 'react';
import { DurationTime } from 'src/components/DurationTime';
import { PodSelectorTable } from 'src/components/PodSelectorTable';
import { PortsTable } from 'src/components/PortsTable';
import { ServiceInClusterAccessComponent, ServiceOutClusterAccessComponent } from 'src/components/ServiceComponents';
import { Tags } from 'src/components/Tags';
import { ServiceOutClusterAccessTitle, ServiceInClusterAccessTitle } from 'src/hooks/useEagleTable/columns';
import {
  JobModel,
  ResourceModel,
  WorkloadModel,
  WorkloadBaseModel,
  CronJobModel,
  IngressModel,
  ServiceModel,
  ServiceType,
} from '../../models';
import { ExtendObjectMeta } from '../../plugins/relation-plugin';
import { ConditionsTable } from '../ConditionsTable';
import { CronjobJobsTable } from '../CronjobJobsTable';
import { EventsTable } from '../EventsTable';
import { ImageNames } from '../ImageNames';
import { IngressRulesTable } from '../IngressRulesTable';
import { KeyValue, KeyValueAnnotation, KeyValueSecret } from '../KeyValue';
import { Time } from '../Time';
import { WorkloadPodsTable } from '../WorkloadPodsTable';
import { WorkloadReplicas } from '../WorkloadReplicas';

export type ShowField<Model extends ResourceModel> = {
  key: string;
  title?: React.ReactNode;
  path: string[];
  labelWidth?: string;
  col?: number;
  render?: (
    val: unknown,
    record: Model,
    field: ShowField<Model>
  ) => React.ReactNode | undefined;
  renderContent?: (
    val: unknown,
    record: Model,
    field: ShowField<Model>
  ) => React.ReactNode | undefined;
};

export enum AreaType {
  Inline = 'Inline',
  Grid = 'Grid',
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
      return <ImageNames value={value as string[]} breakLine={false} />;
    },
  };
};

export const ReplicaField = <Model extends WorkloadModel | JobModel>(): ShowField<Model> => {
  return {
    key: 'Replicas',
    path: [],
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

export const JobsField = <Model extends JobModel | CronJobModel>(): ShowField<Model> => {
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

export const DataField = <Model extends ResourceModel>(i18n: I18nType): ShowField<Model> => {
  return {
    key: 'data',
    path: ['data'],
    renderContent: val => {
      return <KeyValue data={val as Record<string, string>} empty={i18n.t('dovetail.no_resource', { kind: i18n.t('dovetail.data') })} />;
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
      return <KeyValueSecret data={decodeVal} />;
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

export const ServiceTypeField = <Model extends ServiceModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'type',
    title: i18n.t('dovetail.type'),
    path: ['displayType'],
  };
};

export const ClusterIpField = <Model extends ServiceModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'clusterIp',
    title: i18n.t('dovetail.clusterIp'),
    path: ['spec', 'clusterIP'],
  };
};

export const SessionAffinityField = <Model extends ServiceModel>(
  i18n: I18nType
): ShowField<Model> => {
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

export const IngressRulesTableTabField = <
  Model extends IngressModel,
>(): ShowField<Model> => {
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
    renderContent: (_, record) => {
      return (
        <div style={{ padding: '0 24px', height: '100%' }}>
          <EventsTable uid={record.metadata.uid as string} />
        </div>
      );
    },
  };
};

export const NamespaceField = <Model extends ResourceModel>(
  i18n: I18nType
): ShowField<Model> => ({
  key: 'NameSpace',
  title: i18n.t('dovetail.namespace'),
  path: ['metadata', 'namespace'],
});

export const AgeField = <Model extends ResourceModel>(
  i18n: I18nType
): ShowField<Model> => ({
  key: 'Age',
  title: i18n.t('dovetail.created_time'),
  path: ['metadata', 'creationTimestamp'],
  renderContent(value) {
    return <Time date={new Date(value as string)} />;
  },
});

export const LabelsField = <Model extends ResourceModel>(
  i18n: I18nType
): ShowField<Model> => ({
  key: 'Labels',
  title: i18n.t('dovetail.label'),
  path: ['metadata', 'labels'],
  renderContent: value => {
    if (!value) {
      return '-';
    }

    return <Tags value={value as Record<string, string>} />;
  },
});

export const AnnotationsField = <Model extends ResourceModel>(
  i18n: I18nType
): ShowField<Model> => ({
  key: 'Annotations',
  title: i18n.t('dovetail.annotation'),
  path: ['metadata', 'annotations'],
  renderContent: value => {
    return <KeyValueAnnotation data={value as Record<string, string>} expandable />;
  },
});

export const ServiceInnerClusterAccessField = <Model extends ServiceModel>(): ShowField<Model> => ({
  key: 'innerClusterAccess',
  title: <ServiceInClusterAccessTitle />,
  path: [],
  renderContent: (_, record) => {
    return <ServiceInClusterAccessComponent service={record} />;
  },
});

export const ServiceOutClusterAccessField = <Model extends ServiceModel>(clusterVip: string): ShowField<Model> => ({
  key: 'innerClusterAccess',
  title: <ServiceOutClusterAccessTitle />,
  path: [],
  renderContent: (_, record) => {
    return <ServiceOutClusterAccessComponent service={record} clusterVip={clusterVip} breakLine={false} />;
  },
});

export const PodSelectorField = <Model extends ResourceModel<ServiceType | (NetworkPolicy & Unstructured)>>(): ShowField<Model> => ({
  key: 'podSelector',
  path: [],
  renderContent: (_, resource) => {
    const spec = resource._rawYaml.spec;
    const selector = spec && (('selector' in spec && spec.selector) || ('podSelector' in spec && spec.podSelector.matchLabels));

    return <PodSelectorTable podSelectors={selector || {}} />;
  },
});

export const PortsTableField = <Model extends ServiceModel>(): ShowField<Model> => ({
  key: 'ports',
  path: [],
  renderContent: (_, service) => {
    return <PortsTable service={service} />;
  },
});

export const DurationField = <Model extends JobModel | CronJobModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'duration',
    path: ['duration'],
    title: i18n.t('dovetail.duration'),
    renderContent: (v) => {
      return <DurationTime value={v as number} />;
    },
  };
};
