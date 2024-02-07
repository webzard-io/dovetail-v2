import { useUIKit } from '@cloudtower/eagle';
import { useGo, useNavigation, useParsed } from '@refinedev/core';
import type { OwnerReference } from 'kubernetes-types/meta/v1';
import type { IngressBackend } from 'kubernetes-types/networking/v1';
import { get } from 'lodash';
import React from 'react';
import { ResourceLink } from '../../components';
import { ImageNames } from '../../components/ImageNames';
import { IngressRulesComponent } from '../../components/IngressRulesComponent';
import { ReferenceLink } from '../../components/ReferenceLink';
import { StateTag } from '../../components/StateTag';
import { Column } from '../../components/Table';
import Time from '../../components/Time';
import i18n from '../../i18n';
import {
  JobModel,
  PodModel,
  ResourceModel,
  WorkloadModel,
  WorkloadBaseModel,
  CronJobModel,
  IngressModel,
} from '../../models';
import { elapsedTime } from '../../utils/time';

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

export const NameSpaceColumnRenderer = <Model extends ResourceModel>(): Column<Model> => {
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
  Model extends WorkloadModel | CronJobModel | PodModel,
>(): Column<Model> => {
  const dataIndex = ['stateDisplay'];
  return {
    key: 'stateDisplay',
    display: true,
    dataIndex: dataIndex,
    title: i18n.t('dovetail.state'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
    render: v => <StateTag state={v} />,
  };
};

export const WorkloadImageColumnRenderer = <
  Model extends WorkloadBaseModel,
>(): Column<Model> => {
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

export const WorkloadRestartsColumnRenderer = <
  Model extends WorkloadModel,
>(): Column<Model> => {
  const dataIndex = ['restarts'];
  return {
    key: 'restarts',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.restarts'),
    sortable: false,
  };
};

export const ReplicasColumnRenderer = <Model extends WorkloadModel>(): Column<Model> => {
  const dataIndex = ['status', 'replicas'];
  return {
    key: 'replicas',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.replicas'),
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

export const AgeColumnRenderer = <Model extends ResourceModel>(): Column<Model> => {
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
  };
};

export const NodeNameColumnRenderer = <Model extends PodModel>(
  options?: Partial<Column<Model>>
): Column<Model> => {
  const dataIndex = ['spec', 'nodeName'];

  return {
    key: 'node',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.node_name'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
    ...options,
  };
};

export const RestartCountColumnRenderer = <Model extends PodModel>(): Column<Model> => {
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

export const CompletionsCountColumnRenderer = <
  Model extends JobModel | CronJobModel,
>(): Column<Model> => {
  const dataIndex = ['completionsDisplay'];
  return {
    key: 'completions',
    display: true,
    dataIndex,
    title: i18n.t('completions'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
  };
};

export const DurationColumnRenderer = <
  Model extends JobModel | CronJobModel,
>(): Column<Model> => {
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

export const ServiceTypeColumnRenderer = <
  Model extends ResourceModel,
>(): Column<Model> => {
  const dataIndex = ['spec', 'type'];
  return {
    key: 'type',
    title: i18n.t('dovetail.type'),
    display: true,
    dataIndex,
    sortable: true,
    sorter: CommonSorter(dataIndex),
  };
};
export const PodWorkloadColumnRenderer = <Model extends PodModel>(): Column<Model> => {
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

export const IngressRulesColumnRenderer = <
  Model extends IngressModel,
>(): Column<Model> => {
  const dataIndex = ['spec', 'rules'];
  return {
    key: 'type',
    title: i18n.t('dovetail.rule'),
    display: true,
    dataIndex,
    sortable: true,
    sorter: CommonSorter(dataIndex),
    render(_, record) {
      return <IngressRulesComponent ingress={record} />;
    },
  };
};

export const IngressDefaultBackendColumnRenderer = <
  Model extends IngressModel,
>(): Column<Model> => {
  const dataIndex = ['spec', 'defaultBackend'];
  return {
    key: 'defaultBackend',
    display: true,
    dataIndex,
    title: i18n.t('dovetail.default_backend'),
    sortable: true,
    sorter: CommonSorter(['spec', 'defaultBackend']),
    render: (defaultBackend: IngressBackend, record) => {
      if (!defaultBackend?.service?.name) return <span>-</span>;
      const divider = 'Default > ';
      return (
        <span>
          {divider}
          <ResourceLink
            name="services"
            namespace={record.metadata.namespace || 'default'}
            resourceId={defaultBackend.service?.name || ''}
          />
        </span>
      );
    },
  };
};
