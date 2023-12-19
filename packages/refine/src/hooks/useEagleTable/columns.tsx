import { useUIKit } from '@cloudtower/eagle';
import { useGo, useNavigation, useParsed } from '@refinedev/core';
import { i18n } from 'i18next';
import {
  JobModel,
  PodModel,
  ResourceModel,
  WorkloadModel,
  WorkloadBaseModel,
} from 'k8s-api-provider';
import { get } from 'lodash';
import React from 'react';
import { ImageNames } from '../../components/ImageNames';
import { StateTag } from '../../components/StateTag';
import { Column } from '../../components/Table';
import Time from '../../components/Time';
import { WorkloadReplicas } from '../../components/WorkloadReplicas';

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
  i18n: i18n,
  resource = ''
): Column<Model> => {
  const dataIndex = ['metadata', 'name'];
  return {
    key: 'name',
    display: true,
    dataIndex,
    title: i18n.t('name'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
    render: (v: string, record: Model) => {
      return <NameLink name={v} id={record.id} resource={resource} />;
    },
  };
};

export const NameSpaceColumnRenderer = <Model extends ResourceModel>(
  i18n: i18n
): Column<Model> => {
  const dataIndex = ['metadata', 'namespace'];
  return {
    key: 'namespace',
    display: true,
    dataIndex,
    title: i18n.t('namespace'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
  };
};

export const PhaseColumnRenderer = <Model extends ResourceModel>(
  i18n: i18n
): Column<Model> => {
  const dataIndex = ['status', 'phase'];
  return {
    key: 'phase',
    display: true,
    dataIndex: dataIndex,
    title: i18n.t('phase'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
    render: v => <StateTag state={v} />,
  };
};

export const WorkloadImageColumnRenderer = <Model extends WorkloadBaseModel>(
  i18n: i18n
): Column<Model> => {
  const dataIndex = ['imageNames'];
  return {
    key: 'image',
    display: true,
    dataIndex,
    title: i18n.t('image'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
    render(value, record) {
      return <ImageNames value={record.imageNames} />;
    },
  };
};

export const WorkloadRestartsColumnRenderer = <Model extends WorkloadModel>(
  i18n: i18n
): Column<Model> => {
  const dataIndex = ['restarts'];
  return {
    key: 'restarts',
    display: true,
    dataIndex,
    title: i18n.t('restarts'),
    sortable: false,
  };
};

export const ReplicasColumnRenderer = <Model extends WorkloadModel>(
  i18n: i18n
): Column<Model> => {
  const dataIndex = ['status', 'replicas'];
  return {
    key: 'replicas',
    display: true,
    dataIndex,
    title: i18n.t('replicas'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
    render: (_, record: Model) => {
      return <WorkloadReplicas record={record} />;
    },
  };
};

export const AgeColumnRenderer = <Model extends ResourceModel>(
  i18n: i18n
): Column<Model> => {
  const dataIndex = ['metadata', 'creationTimestamp'];
  return {
    key: 'creationTimestamp',
    display: true,
    dataIndex,
    title: i18n.t('created_time'),
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
  i18n: i18n
): Column<Model> => {
  const dataIndex = ['spec', 'nodeName'];
  return {
    key: 'node',
    display: true,
    dataIndex,
    title: i18n.t('node_name'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
  };
};

export const RestartCountColumnRenderer = <Model extends PodModel>(
  i18n: i18n
): Column<Model> => {
  const dataIndex = ['restartCount'];
  return {
    key: 'restartCount',
    display: true,
    dataIndex,
    title: i18n.t('restarts'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
  };
};

export const CompletionsCountColumnRenderer = <Model extends JobModel>(
  i18n: i18n
): Column<Model> => {
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

export const DurationColumnRenderer = <Model extends JobModel>(
  i18n: i18n
): Column<Model> => {
  const dataIndex = ['durationDisplay'];
  return {
    key: 'duration',
    display: true,
    dataIndex,
    title: i18n.t('duration'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
  };
};

export const ServiceTypeColumnRenderer = <Model extends ResourceModel>(
  i18n: i18n
): Column<Model> => {
  const dataIndex = ['rawYaml', 'spec', 'type'];
  return {
    key: 'type',
    title: i18n.t('dovetail.type'),
    display: true,
    dataIndex,
    sortable: true,
    sorter: CommonSorter(dataIndex),
  };
};
