import { useUIKit, Tooltip } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useGo, useNavigation, useParsed } from '@refinedev/core';
import { i18n as I18nType } from 'i18next';
import type { OwnerReference } from 'kubernetes-types/meta/v1';
import type { IngressBackend, IngressTLS } from 'kubernetes-types/networking/v1';
import { get } from 'lodash';
import React from 'react';
import {
  ServiceInClusterAccessComponent,
  ServiceOutClusterAccessComponent,
} from '../../components';
import { ImageNames } from '../../components/ImageNames';
import { IngressRulesComponent } from '../../components/IngressRulesComponent';
import { ReferenceLink } from '../../components/ReferenceLink';
import { StateTag } from '../../components/StateTag';
import { Column } from '../../components/Table';
import Time from '../../components/Time';
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
} from '../../models';
import { elapsedTime } from '../../utils/time';

const DashedTitleStyle = css`
  border-bottom: 1px dashed rgba(107, 128, 167, 0.6);
  padding-bottom: 3px;
`;

const NameLink: React.FC<{ id: string; name: string; resource?: string }> = props => {
  const { name, id, resource } = props;
  const kit = useUIKit();
  const go = useGo();
  const navigation = useNavigation();
  const parsed = useParsed();
  const resourceName = resource || parsed.resource?.name || '';
  return (
    <kit.button
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
    >
      {name}
    </kit.button>
  );
};

export const CommonSorter = (dataIndex: string[]) => (a: unknown, b: unknown) => {
  const valA = get(a, dataIndex);
  const valB = get(b, dataIndex);
  if (valA === valB) return 0;
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
    sorter: CommonSorter(dataIndex),
    render: (v: string, record: Model) => {
      return <NameLink name={v} id={record.id} resource={resource} />;
    },
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
    sorter: CommonSorter(dataIndex),
  };
};

export const StateDisplayColumnRenderer = <
  Model extends WorkloadModel | CronJobModel | PodModel | ServiceModel | DaemonSetModel | JobModel,
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
    render(value, record) {
      return <ImageNames value={record.imageNames} />;
    },
  };
};

export const WorkloadRestartsColumnRenderer = <Model extends WorkloadModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['restarts'];
  return {
    key: 'restarts',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.restarts'),
    sortable: false,
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
      <Tooltip title={i18n.t('dovetail.completion_num_tooltip')}>
        <span className={DashedTitleStyle}>{i18n.t('dovetail.pod')}</span>
      </Tooltip>
    ),
    sortable: true,
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
  config?: { title?: string }
): Column<Model> => {
  const dataIndex = ['metadata', 'creationTimestamp'];
  return {
    key: 'creationTimestamp',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.created_time'),
    sortable: true,
    sorter: (a: ResourceModel, b: ResourceModel) => {
      const valA = new Date(get(a, dataIndex));
      const valB = new Date(get(b, dataIndex));
      if (valA === valB) return 0;
      if (valA > valB) return 1;
      return -1;
    },
    render: (value: string) => {
      return <Time date={new Date(value)} />;
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
    sorter: CommonSorter(dataIndex),
    ...options,
  };
};

export const RestartCountColumnRenderer = <Model extends PodModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['restartCount'];
  return {
    key: 'restartCount',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.restarts'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
  };
};

export const CompletionsCountColumnRenderer = <Model extends JobModel | CronJobModel>(
  i18n: I18nType
): Column<Model> => {
  const dataIndex = ['completionsDisplay'];

  return {
    key: 'completions',
    display: true,
    dataIndex,
    title: (
      <Tooltip title={i18n.t('dovetail.completion_num_tooltip')}>
        <span className={DashedTitleStyle}>Pod</span>
      </Tooltip>
    ),
    sortable: true,
    sorter: CommonSorter(dataIndex),
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
    render: v => {
      const i18nMap = {
        sec: i18n.t('dovetail.sec'),
        day: i18n.t('dovetail.day'),
        min: i18n.t('dovetail.min'),
        hr: i18n.t('dovetail.hr'),
      };

      return <span>{elapsedTime(v, i18nMap).label || '-'}</span>;
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
    sorter: CommonSorter(dataIndex),
  };
};

export const ServiceInClusterAccessColumnRenderer = <Model extends ServiceModel>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'inClusterAccess',
    title: i18n.t('dovetail.in_cluster_access'),
    display: true,
    dataIndex: [],
    render(_, record) {
      return <ServiceInClusterAccessComponent service={record} />;
    },
  };
};

export const ServiceOutClusterAccessColumnRenderer = <Model extends ServiceModel>(
  i18n: I18nType
): Column<Model> => {
  return {
    key: 'outClusterAccess',
    title: i18n.t('dovetail.out_cluster_access'),
    display: true,
    dataIndex: [],
    render(_, record) {
      return (
        <ServiceOutClusterAccessComponent
          service={record}
          // the API_HOST in vite.config.js
          clusterVip="192.168.31.86"
        />
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
    render(value: OwnerReference[], record) {
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
    width: 300,
    sorter: CommonSorter(dataIndex),
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
    render: (defaultBackend: IngressBackend) => {
      if (defaultBackend?.service?.name) return <span>√</span>;
      return <span>x</span>;
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
    sorter: CommonSorter(['spec', 'ingressClassName']),
    render: (name: IngressBackend) => {
      return <span>{name || '-'}</span>;
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
      if (!tls) return '-';
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
        <span className={DashedTitleStyle}>{i18n.t('dovetail.container')}</span>
      </Tooltip>
    ),
    sortable: true,
    sorter: CommonSorter(['readyDisplay']),
  };
};
