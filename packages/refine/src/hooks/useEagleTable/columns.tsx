import {
  Button,
  Time as BaseTime,
  Tooltip,
  OverflowTooltip,
  Divider,
  Units,
} from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useGo, useNavigation, useParsed } from '@refinedev/core';
import { i18n as I18nType } from 'i18next';
import type { OwnerReference } from 'kubernetes-types/meta/v1';
import type { IngressBackend, IngressTLS } from 'kubernetes-types/networking/v1';
import { get } from 'lodash';
import React from 'react';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { DurationTime } from 'src/components/DurationTime';
import ValueDisplay from 'src/components/ValueDisplay';
import {
  PVVolumeModeDisplay,
  ResourceLink,
  ServiceInClusterAccessComponent,
  ServiceOutClusterAccessComponent,
} from '../../components';
import { ImageNames } from '../../components/ImageNames';
import { IngressRulesComponent } from '../../components/IngressRulesComponent';
import { Column } from '../../components/InternalBaseTable';
import { ReferenceLink } from '../../components/ReferenceLink';
import { StateTag } from '../../components/StateTag';
import { Time } from '../../components/Time';
import {
  JobModel,
  PodModel,
  ResourceModel,
  WorkloadModel,
  WorkloadBaseModel,
  CronJobModel,
  IngressModel,
  ServiceModel,
  DaemonSetModel,
  StorageClassModel,
  PersistentVolumeModel,
  PersistentVolumeClaimModel,
} from '../../models';

const DashedTitleStyle = css`
  border-bottom: 1px dashed rgba(107, 128, 167, 0.6);
  padding-bottom: 1px;
`;
const ServiceClusterTooltipStyle = css`
  &.ant-tooltip {
    .ant-tooltip-inner {
      width: 256px;
    }
  }
`;

const NameLink: React.FC<{ id: string; name: string; resource?: string }> = props => {
  const { name, id, resource } = props;
  const go = useGo();
  const navigation = useNavigation();
  const parsed = useParsed();
  const resourceName = resource || parsed.resource?.name || '';
  return (
    <Button
      type="link"
      onClick={() => {
        go({
          to: navigation.showUrl(resourceName, ''),
          query: {
            id,
          },
          options: {
            keepQuery: true,
          },
        });
      }}
      title={name}
    >
      {name}
    </Button>
  );
};

export const CommonSorter = (dataIndex: string[]) => (a: unknown, b: unknown) => {
  const valA = get(a, dataIndex);
  const valB = get(b, dataIndex);
  
  // 处理 undefined 值的情况
  if (valA === valB) return 0;
  if (valA !== undefined && valB === undefined) return 1; // undefined 更小
  if (valA === undefined && valB !== undefined) return -1;

  if (valA > valB) return 1;
  return -1;
};

export const NameColumnRenderer = <Model extends ResourceModel>(
  i18n: I18nType,
  resource = ''
): Column<Model> => {
  const dataIndex = ['metadata', 'name'];

  return {
    key: 'name',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.name'),
    sortable: true,
    width: 200,
    sorter: CommonSorter(dataIndex),
    render: (v: string, record: Model) => {
      return <NameLink name={v} id={record.id} resource={resource} />;
    },
  };
};

export const PlainTextNameColumnRenderer = <Model extends ResourceModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['metadata', 'name'];

  return {
    key: 'name',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.name'),
    sortable: true,
    width: 200,
    sorter: CommonSorter(dataIndex),
    render: v => <OverflowTooltip content={v} tooltip={v} />,
  };
};

export const NameSpaceColumnRenderer = <Model extends ResourceModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['metadata', 'namespace'];
  return {
    key: 'namespace',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.namespace'),
    sortable: true,
    width: 160,
    sorter: CommonSorter(dataIndex),
  };
};

export const StateDisplayColumnRenderer = <
  Model extends
    | WorkloadModel
    | CronJobModel
    | PodModel
    | ServiceModel
    | DaemonSetModel
    | JobModel,
>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['stateDisplay'];
  return {
    key: 'stateDisplay',
    display: true,
    dataIndex: dataIndex,
    title: i18n.t('dovetail.state'),
    sortable: true,
    width: 120,
    sorter: CommonSorter(dataIndex),
    render: v => <StateTag state={v} hideBackground />,
  };
};

export const WorkloadImageColumnRenderer = <Model extends WorkloadBaseModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['imageNames'];
  return {
    key: 'image',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.image'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
    width: 160,
    render(value, record) {
      return <ImageNames value={record.imageNames} />;
    },
  };
};

export const RestartsColumnRenderer = <Model extends WorkloadModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['restarts'];
  return {
    key: 'restarts',
    display: true,
    width: 120,
    dataIndex,
    align: 'right',
    sortable: true,
    sorter: CommonSorter(dataIndex),
    title: i18n.t('dovetail.restarts'),
    render: (value: number) => {
      return <ValueDisplay value={value} />;
    },
  };
};

export const ReplicasColumnRenderer = <Model extends WorkloadModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['status', 'replicas'];
  return {
    key: 'replicas',
    display: true,
    dataIndex,
    title: (
      <Tooltip title={i18n.t('dovetail.ready_num_tooltip')}>
        <span className={DashedTitleStyle}>{i18n.t('dovetail.pod_num')}</span>
      </Tooltip>
    ),
    width: 120,
    sortable: true,
    align: 'right',
    sorter: CommonSorter(dataIndex),
    render: (_, record: Model) => {
      return (
        <span>
          {record.readyReplicas}/{record.replicas}
        </span>
      );
    },
  };
};

export const AgeColumnRenderer = <Model extends ResourceModel>(
  i18n: I18nType,
  config?: { title?: string; width: number },
  { isRelativeTime = true }: { isRelativeTime?: boolean } = {}
): Column<Model> => {
  const dataIndex = ['metadata', 'creationTimestamp'];

  return {
    key: 'creationTimestamp',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.created_time'),
    width: 120,
    sorter: true,
    render: (value: string) => {
      return isRelativeTime ? (
        <Time date={new Date(value)} />
      ) : (
        <ValueDisplay
          value={
            <BaseTime date={value} timeTemplate="HH:mm:ss" dateTemplate="YYYY-MM-DD" />
          }
        />
      );
    },
    ...config,
  };
};

export const NodeNameColumnRenderer = <Model extends PodModel>(
  i18n: I18nType,
  options?: Partial<Column<Model>>
): Column<Model> => {
  const dataIndex = ['spec', 'nodeName'];

  return {
    key: 'node',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.belong_to_node'),
    sortable: true,
    width: 160,
    sorter: CommonSorter(dataIndex),
    render: v => {
      return <ResourceLink resourceName="nodes" name={v} namespace="" />;
    },
    ...options,
  };
};

export const CompletionsCountColumnRenderer = <Model extends JobModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['succeeded'];

  return {
    key: 'completions',
    display: true,
    dataIndex,
    title: (
      <Tooltip title={i18n.t('dovetail.completion_num_tooltip')}>
        <span className={DashedTitleStyle}>{i18n.t('dovetail.pod_num')}</span>
      </Tooltip>
    ),
    sortable: true,
    width: 120,
    align: 'right',
    sorter: CommonSorter(dataIndex),
    render: (_, record: Model) => {
      return <span>{record.completionsDisplay}</span>;
    },
  };
};

export const DurationColumnRenderer = <Model extends JobModel | CronJobModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['duration'];
  return {
    key: 'duration',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.duration'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
    width: 120,
    align: 'right',
    render: v => {
      return <DurationTime value={v} />;
    },
  };
};

export const ServiceTypeColumnRenderer = <Model extends ResourceModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['displayType'];
  return {
    key: 'displayType',
    title: i18n.t('dovetail.type'),
    display: true,
    dataIndex,
    sortable: true,
    width: 120,
    sorter: CommonSorter(dataIndex),
  };
};

export function ServiceInClusterAccessTitle() {
  const { i18n } = useTranslation();

  return (
    <Tooltip
      overlayClassName={ServiceClusterTooltipStyle}
      title={
        <div style={{ lineHeight: '22px' }}>
          <div>{i18n.t('dovetail.in_cluster_desc')}</div>
          <div>{i18n.t('dovetail.in_cluster_ip_desc')}</div>
          <Divider style={{ margin: '6px 0', background: 'rgba(107, 128, 167, 0.60)' }} />
          <div>{i18n.t('dovetail.in_cluster_external_name_desc')}</div>
        </div>
      }
    >
      <span className={DashedTitleStyle}>{i18n.t('dovetail.in_cluster_access')}</span>
    </Tooltip>
  );
}
export const ServiceInClusterAccessColumnRenderer = <
  Model extends ServiceModel,
>(): Column<Model> => {
  return {
    key: 'inClusterAccess',
    title: <ServiceInClusterAccessTitle />,
    display: true,
    dataIndex: [],
    width: 160,
    sorter: undefined,
    render(_, record) {
      return <ServiceInClusterAccessComponent service={record} />;
    },
  };
};

export function ServiceOutClusterAccessTitle() {
  const { i18n } = useTranslation();

  return (
    <Tooltip
      overlayClassName={ServiceClusterTooltipStyle}
      title={
        <div
          style={{
            lineHeight: '22px',
          }}
        >
          <div>{i18n.t('dovetail.out_cluster_ip_desc')}</div>
          <div>
            <Trans i18nKey="dovetail.out_cluster_node_port_desc" />
          </div>
          <div>
            <Trans i18nKey="dovetail.out_cluster_lb_desc" />
          </div>
          <div>
            <Trans i18nKey="dovetail.out_external_name_desc" />
          </div>
        </div>
      }
    >
      <span className={DashedTitleStyle}>{i18n.t('dovetail.out_cluster_access')}</span>
    </Tooltip>
  );
}
export const ServiceOutClusterAccessColumnRenderer = <Model extends ServiceModel>(
  clusterVip: string
): Column<Model> => {
  return {
    key: 'outClusterAccess',
    title: <ServiceOutClusterAccessTitle />,
    display: true,
    dataIndex: [],
    width: 160,
    sorter: undefined,
    render(_, record) {
      return (
        <ServiceOutClusterAccessComponent service={record} clusterVip={clusterVip} />
      );
    },
  };
};

export const PodWorkloadColumnRenderer = <Model extends PodModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['metadata', 'ownerReferences'];
  return {
    key: 'type',
    title: i18n.t('dovetail.workload'),
    display: true,
    dataIndex,
    sortable: true,
    sorter: CommonSorter(dataIndex),
    width: 160,
    render(value: OwnerReference[], record) {
      if (!value?.length) {
        return <ValueDisplay value="" />;
      }

      return value.map(o => (
        <ReferenceLink
          key={o.name}
          ownerReference={o}
          namespace={record.metadata.namespace || 'default'}
        />
      ));
    },
  };
};

export const IngressRulesColumnRenderer = <Model extends IngressModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['spec', 'rules'];
  return {
    key: 'type',
    title: i18n.t('dovetail.rule'),
    display: true,
    dataIndex,
    sortable: true,
    sorter: undefined,
    width: 300,
    render(_, record) {
      return <IngressRulesComponent ingress={record} />;
    },
  };
};

export const IngressDefaultBackendColumnRenderer = <Model extends IngressModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['spec', 'defaultBackend'];
  return {
    key: 'defaultBackend',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.default_backend'),
    sortable: true,
    sorter: CommonSorter(['spec', 'defaultBackend']),
    width: 120,
    render: (defaultBackend: IngressBackend) => {
      if (defaultBackend?.service?.name || defaultBackend?.resource?.name)
        return <span>{i18n.t('dovetail.true')}</span>;
      return <span>{i18n.t('dovetail.false')}</span>;
    },
  };
};

export const IngressClassColumnRenderer = <Model extends IngressModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['spec', 'ingressClassName'];
  return {
    key: 'ingressClassName',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.ingress_class'),
    sortable: true,
    width: 160,
    sorter: CommonSorter(['spec', 'ingressClassName']),
    render: (name: IngressBackend) => {
      return <ValueDisplay value={name} />;
    },
  };
};

export const IngressTlsColumnRenderer = <Model extends IngressModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['spec', 'tls'];
  return {
    key: 'cert',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.cert'),
    sortable: true,
    sorter: CommonSorter(['spec', 'ingressClassName']),
    render: (tls: IngressTLS[]) => {
      if (!tls) return <ValueDisplay value="" />;

      return (
        <ul>
          {tls.map(t => (
            <li key={t.secretName}>{t.secretName}</li>
          ))}
        </ul>
      );
    },
  };
};

export const PodContainersNumColumnRenderer = <Model extends PodModel>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'readyDisplay',
    display: true,
    dataIndex: ['readyDisplay'],
    title: (
      <Tooltip title={i18n.t('dovetail.ready_num_tooltip')}>
        <span className={DashedTitleStyle}>{i18n.t('dovetail.container_num')}</span>
      </Tooltip>
    ),
    width: 120,
    sortable: true,
    align: 'right',
    sorter: CommonSorter(['readyDisplay']),
  };
};

export const DataKeysColumnRenderer = <Model extends ResourceModel>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'data',
    display: true,
    dataIndex: ['data'],
    title: i18n.t('dovetail.data'),
    render(data) {
      const keys = Object.keys(data || {});

      return keys.length ? (
        keys.map(key => <OverflowTooltip content={key} key={key} />)
      ) : (
        <ValueDisplay value="" />
      );
    },
    width: 300,
    sortable: true,
    sorter: undefined,
  };
};

export const PortMappingColumnRenderer = <Model extends ServiceModel>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'displayPortMapping',
    title: (
      <Tooltip title={i18n.t('dovetail.port_mapping_title_tooltip')}>
        <span className={DashedTitleStyle}>{i18n.t('dovetail.port_mapping')}</span>
      </Tooltip>
    ),
    display: true,
    dataIndex: ['displayPortMapping'],
    width: 300,
    sorter: undefined,
    render(value, record) {
      const content = record.displayPortMapping?.map(v => (
        <OverflowTooltip
          content={
            <span style={{ whiteSpace: 'pre' }}>
              {v.servicePort} &gt; {v.targetPort}/{v.protocol}
            </span>
          }
          key={v.servicePort}
          tooltip={`${v.servicePort} > ${v.targetPort}/${v.protocol}`}
        ></OverflowTooltip>
      ));

      return <ValueDisplay value={content} />;
    },
  };
};

export const ProvisionerColumnRenderer = <Model extends StorageClassModel>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'provisioner',
    display: true,
    dataIndex: ['provisioner'],
    title: i18n.t('dovetail.provisioner'),
    width: 120,
    sortable: true,
  };
};

export const PVCapacityColumnRenderer = <Model extends PersistentVolumeModel>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'capacity',
    display: true,
    dataIndex: ['storageBytes'],
    title: i18n.t('dovetail.capacity'),
    width: 120,
    sortable: true,
    align: 'right',
    render(value) {
      return <Units.Byte rawValue={value} decimals={2} />;
    },
  };
};

export const PVCStorageColumnRenderer = <Model extends PersistentVolumeClaimModel>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'storage',
    display: true,
    dataIndex: ['storageBytes'],
    title: i18n.t('dovetail.distributed'),
    width: 120,
    sortable: true,
    align: 'right',
    render(value) {
      return <Units.Byte rawValue={value} decimals={2} />;
    },
  };
};

export const PVRefColumnRenderer = <Model extends PersistentVolumeClaimModel>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'pv',
    display: true,
    dataIndex: ['pv'],
    title: i18n.t('dovetail.pv'),
    width: 160,
    sortable: true,
    render(value) {
      return <ResourceLink resourceName="persistentvolumes" namespace="" name={value} />;
    },
  };
};

export const PVStorageClassColumnRenderer = <
  Model extends PersistentVolumeModel | PersistentVolumeClaimModel,
>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'storageClass',
    display: true,
    dataIndex: ['spec', 'storageClassName'],
    title: i18n.t('dovetail.storage_class'),
    width: 160,
    sortable: true,
    render(value) {
      return <ResourceLink resourceName="storageclasses" namespace="" name={value} />;
    },
  };
};

export const PVPhaseColumnRenderer = <
  Model extends PersistentVolumeModel | PersistentVolumeClaimModel,
>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'phase',
    display: true,
    dataIndex: ['stateDisplay'],
    title: i18n.t('dovetail.state'),
    width: 120,
    sortable: true,
    render(value) {
      return <StateTag state={value} hideBackground />;
    },
  };
};

export const PVCRefColumnRenderer = <Model extends PersistentVolumeModel>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'pvc',
    display: true,
    dataIndex: ['pvc'],
    title: i18n.t('dovetail.pvc'),
    width: 160,
    sortable: true,
    render(value, pv) {
      return (
        <ResourceLink
          resourceName="persistentvolumeclaims"
          namespace={pv.pvcNamespace || 'default'}
          name={value}
          uid={pv.pvcUid}
        />
      );
    },
  };
};

export const PVCSIRefColumnRenderer = <Model extends PersistentVolumeModel>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'csi',
    display: true,
    dataIndex: ['csi'],
    title: i18n.t('dovetail.csi'),
    width: 160,
    sortable: true,
  };
};

export const PVVolumeModeColumnRenderer = <
  Model extends PersistentVolumeModel | PersistentVolumeClaimModel,
>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'mode',
    display: true,
    dataIndex: ['spec', 'volumeMode'],
    title: i18n.t('dovetail.volume_mode'),
    width: 120,
    sortable: true,
    render(value) {
      return <PVVolumeModeDisplay value={value} />;
    },
  };
};

export const PVAccessModeColumnRenderer = <
  Model extends PersistentVolumeModel | PersistentVolumeClaimModel,
>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'accessMode',
    display: true,
    dataIndex: ['spec', 'accessModes'],
    title: i18n.t('dovetail.access_mode'),
    width: 120,
    sortable: true,
    render(value) {
      return (
        <span style={{ whiteSpace: 'pre-wrap' }}>{(value as string[]).join('\n')}</span>
      );
    },
  };
};

export const IsDefaultSCColumnRenderer = <Model extends StorageClassModel>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'isDefaultSC',
    display: true,
    dataIndex: ['isDefaultSC'],
    title: i18n.t('dovetail.default_sc'),
    width: 120,
    sortable: true,
    render(val) {
      return val ? i18n.t('dovetail.true') : i18n.t('dovetail.false');
    },
  };
};

export const SCReclaimPolicyColumnRenderer = <Model extends StorageClassModel>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'reclaimPolicy',
    display: true,
    dataIndex: ['reclaimPolicy'],
    title: i18n.t('dovetail.reclaim_policy'),
    width: 120,
    sortable: true,
    render(val) {
      const map: Record<string, string> = {
        Delete: i18n.t('dovetail.delete'),
        Retain: i18n.t('dovetail.retain'),
      };

      return map[val as string] || val;
    },
  };
};

export const SCAllowExpandColumnRenderer = <Model extends StorageClassModel>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'allowVolumeExpansion',
    display: true,
    dataIndex: ['allowVolumeExpansion'],
    title: i18n.t('dovetail.allow_expand'),
    width: 120,
    sortable: true,
    render(val) {
      return val ? i18n.t('dovetail.support') : i18n.t('dovetail.not_support');
    },
  };
};
