import { StatusCapsuleColor, Units } from '@cloudtower/eagle';
import { useTable, CrudFilters } from '@refinedev/core';
import { i18n as I18nType } from 'i18next';
import { Unstructured } from 'k8s-api-provider';
import { Taint } from 'kubernetes-types/core/v1';
import { Condition } from 'kubernetes-types/meta/v1';
import { NetworkPolicy } from 'kubernetes-types/networking/v1';
import React from 'react';
import { DurationTime } from 'src/components/DurationTime';
import { PodSelectorTable } from 'src/components/PodSelectorTable';
import { PortsTable } from 'src/components/PortsTable';
import PVCDistributeStorage from 'src/components/PVCDistributeStorage';
import {
  ServiceInClusterAccessComponent,
  ServiceOutClusterAccessComponent,
} from 'src/components/ServiceComponents';
import { Tags } from 'src/components/Tags';
import { ResourceState } from 'src/constants';
import {
  ServiceOutClusterAccessTitle,
  ServiceInClusterAccessTitle,
} from 'src/hooks/useEagleTable/columns';
import {
  JobModel,
  ResourceModel,
  WorkloadModel,
  WorkloadBaseModel,
  CronJobModel,
  IngressModel,
  ServiceModel,
  ServiceType,
  StorageClassModel,
  PersistentVolumeModel,
  PersistentVolumeClaimModel,
} from '../../models';
import { ExtendObjectMeta } from '../../plugins/relation-plugin';
import { parseSi } from '../../utils/unit';
import { ConditionsTable } from '../ConditionsTable';
import { CronjobJobsTable } from '../CronjobJobsTable';
import { EventsTable } from '../EventsTable';
import { ImageNames } from '../ImageNames';
import { IngressRulesTable } from '../IngressRulesTable';
import { KeyValue, KeyValueAnnotation, KeyValueSecret } from '../KeyValue';
import { NodeTaintsTable } from '../NodeTaintsTable';
import { PVVolumeModeDisplay } from '../ResourceFiledDisplays';
import { ResourceLink } from '../ResourceLink';
import { ResourceTable } from '../ResourceTable';
import { StateTag } from '../StateTag';
import { Time } from '../Time';
import { WorkloadPodsTable } from '../WorkloadPodsTable';
import { WorkloadReplicas } from '../WorkloadReplicas';

export type ShowField<Model extends ResourceModel> = {
  key: string;
  title?: React.ReactNode;
  path: string[];
  labelWidth?: string;
  col?: number;
  hidden?: boolean;
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
  renderExtraButton?: (record: Model) => React.ReactNode;
  resourceStateMap?: {
    color: Record<string, StatusCapsuleColor | 'loading'>;
    text: Record<string, string>;
  };
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

export const ReplicaField = <
  Model extends WorkloadModel | JobModel,
>(): ShowField<Model> => {
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

export const NodeTaintsField = (): ShowField<ResourceModel<Node & Unstructured>> => {
  return {
    key: 'NodeTaints',
    path: ['spec', 'taints'],
    renderContent: value => {
      return <NodeTaintsTable taints={value as Taint[]} />;
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
          namespace={record.metadata.namespace}
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

export const DataField = <Model extends ResourceModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'data',
    path: ['data'],
    renderContent: val => {
      return (
        <KeyValue
          data={val as Record<string, string>}
          empty={i18n.t('dovetail.no_resource', { kind: i18n.t('dovetail.data') })}
        />
      );
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
          namespace={record.metadata?.namespace}
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
          <EventsTable uid={record.metadata?.uid as string} />
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

export const ServiceInnerClusterAccessField = <
  Model extends ServiceModel,
>(): ShowField<Model> => ({
  key: 'innerClusterAccess',
  title: <ServiceInClusterAccessTitle />,
  path: [],
  renderContent: (_, record) => {
    return <ServiceInClusterAccessComponent service={record} />;
  },
});

export const ServiceOutClusterAccessField = <
  Model extends ServiceModel,
>(): ShowField<Model> => ({
  key: 'innerClusterAccess',
  title: <ServiceOutClusterAccessTitle />,
  path: [],
  renderContent: (_, record) => {
    return <ServiceOutClusterAccessComponent service={record} breakLine={false} />;
  },
});

export const PodSelectorField = <
  Model extends ResourceModel<ServiceType | (NetworkPolicy & Unstructured)>,
>(): ShowField<Model> => ({
  key: 'podSelector',
  path: [],
  renderContent: (_, resource) => {
    const spec = resource._rawYaml.spec;
    const selector =
      spec &&
      (('selector' in spec && spec.selector) ||
        ('podSelector' in spec && spec.podSelector.matchLabels));

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
    renderContent: v => {
      return <DurationTime value={v as number} />;
    },
  };
};

export const StorageClassProvisionerField = <Model extends StorageClassModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'provisioner',
    path: ['provisioner'],
    title: i18n.t('dovetail.provisioner'),
  };
};

export const StorageClassPvField = <
  Model extends StorageClassModel,
>(): ShowField<Model> => {
  return {
    key: 'pvs',
    path: ['pvs'],
    renderContent: (_, sc) => {
      return (
        <ResourceTable
          resource="persistentvolumes"
          useTableParams={{
            filters: {
              permanent: [
                {
                  field: '',
                  value: '',
                  fn(pv: PersistentVolumeModel) {
                    return sc.filterPV(pv, sc.metadata?.name);
                  },
                },
              ] as unknown as CrudFilters,
            },
          }}
        />
      );
    },
  };
};

export const PVCapacityField = <Model extends PersistentVolumeModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'capacity',
    path: ['spec', 'capacity', 'storage'],
    title: i18n.t('dovetail.capacity'),
    renderContent(value) {
      return <Units.Byte rawValue={parseSi(value as string)} decimals={1} />;
    },
  };
};

export const PVCStorageField = <Model extends PersistentVolumeClaimModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'storage',
    path: ['spec', 'resources', 'requests', 'storage'],
    title: i18n.t('dovetail.distributed'),
    renderContent(value, pvc) {
      return <PVCDistributeStorage pvc={pvc} editable />;
    },
  };
};

export const PVRefField = <Model extends PersistentVolumeClaimModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'pv',
    path: ['pv'],
    title: i18n.t('dovetail.pv'),
    renderContent(value) {
      return (
        <ResourceLink
          resourceKind="persistentvolumes"
          namespace=""
          name={value as string}
        />
      );
    },
  };
};

export const PVStorageClassField = <
  Model extends PersistentVolumeModel | PersistentVolumeClaimModel,
>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'storageClass',
    path: ['spec', 'storageClassName'],
    title: i18n.t('dovetail.storage_class'),
    renderContent(value) {
      return (
        <ResourceLink resourceKind="storageclasses" namespace="" name={value as string} />
      );
    },
  };
};

export const PVPhaseField = <
  Model extends PersistentVolumeModel | PersistentVolumeClaimModel,
>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'phase',
    path: ['stateDisplay'],
    title: i18n.t('dovetail.state'),
    renderContent(value) {
      return <StateTag state={value as ResourceState} hideBackground />;
    },
  };
};

export const PVVolumeModeField = <
  Model extends PersistentVolumeModel | PersistentVolumeClaimModel,
>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'mode',
    path: ['spec', 'volumeMode'],
    title: i18n.t('dovetail.volume_mode'),
    renderContent(value) {
      return <PVVolumeModeDisplay value={value as string} />;
    },
  };
};

export const PVAccessModeField = <
  Model extends PersistentVolumeModel | PersistentVolumeClaimModel,
>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'accessMode',
    path: ['spec', 'accessModes'],
    title: i18n.t('dovetail.access_mode'),
    renderContent(value) {
      return (value as string[]).join(', ');
    },
  };
};

export const PVCPodsField = <
  Model extends PersistentVolumeClaimModel,
>(): ShowField<Model> => {
  return {
    key: 'pods',
    path: [],
    renderContent: (_, record) => {
      return (
        <WorkloadPodsTable
          filter={item =>
            !!item.spec?.volumes?.some(
              v => v.persistentVolumeClaim?.claimName === record.metadata?.name
            )
          }
          namespace={record.metadata?.namespace}
          hideToolbar
        />
      );
    },
  };
};

export const PVCRefField = <Model extends PersistentVolumeModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'pvc',
    path: ['pvc'],
    title: i18n.t('dovetail.pvc'),
    renderContent(value, pvc) {
      return (
        <ResourceLink
          resourceKind="persistentvolumeclaims"
          namespace={pvc.pvcNamespace || 'default'}
          name={value as string}
        />
      );
    },
  };
};

export const PVCSIRefField = <Model extends PersistentVolumeModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'csi',
    path: ['csi'],
    title: i18n.t('dovetail.csi'),
  };
};

export const IsDefaultSCField = <Model extends StorageClassModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'isDefaultSC',
    path: ['isDefaultSC'],
    title: i18n.t('dovetail.default_sc'),
    renderContent(val) {
      return val ? i18n.t('dovetail.true') : i18n.t('dovetail.false');
    },
  };
};

export const SCReclaimPolicyField = <Model extends StorageClassModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'reclaimPolicy',
    path: ['reclaimPolicy'],
    title: i18n.t('dovetail.reclaim_policy'),
    renderContent(val) {
      const map: Record<string, string> = {
        Delete: i18n.t('dovetail.delete'),
        Retain: i18n.t('dovetail.retain'),
      };

      return map[val as string] || val;
    },
  };
};

export const IsSCAllowVolumeExpansionField = <Model extends StorageClassModel>(
  i18n: I18nType
): ShowField<Model> => {
  return {
    key: 'allowVolumeExpansion',
    path: ['allowVolumeExpansion'],
    title: i18n.t('dovetail.allow_expand'),
    renderContent(val) {
      return val ? i18n.t('dovetail.support') : i18n.t('dovetail.not_support');
    },
  };
};

export const ResourceTableField = <Model extends ResourceModel>(
  resource: string,
  useTableParams?: Parameters<typeof useTable<Model>>[0]
): ShowField<Model> => {
  return {
    key: resource,
    path: [],
    renderContent() {
      return <ResourceTable resource={resource} useTableParams={useTableParams} />;
    },
  };
};
