import { useUIKit } from '@cloudtower/eagle';
import { useGo, useNavigation, useParsed } from '@refinedev/core';
import { i18n } from 'i18next';
import { get } from 'lodash';
import React from 'react';
import { StateTag } from '../../components/StateTag';
import { Column } from '../../components/Table';
import { ResourceModel } from '../../model';
import { WorkloadModel } from '../../model/workload-model';

const NameLink: React.FC<{ id: string; name: string }> = props => {
  const { name, id } = props;
  const kit = useUIKit();
  const go = useGo();
  const navigation = useNavigation();
  const parsed = useParsed();
  return (
    <kit.button
      type="link"
      onClick={() => {
        go({
          to: navigation.showUrl(parsed.resource?.name || '', ''),
          query: {
            id,
          },
        });
      }}
    >
      {name}
    </kit.button>
  );
};

const CommonSorter = (dataIndex: string[]) => (a: ResourceModel, b: ResourceModel) => {
  const valA = get(a, dataIndex);
  const valB = get(b, dataIndex);
  if (valA === valB) return 0;
  if (valA > valB) return 1;
  return -1;
};

export const NameColumnRenderer = <Model extends ResourceModel>(
  i18n: i18n
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
      return <NameLink name={v} id={record.id} />;
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
    render: () => <StateTag />,
  };
};

export const PocImageColumnRenderer = <Model extends ResourceModel>(
  i18n: i18n
): Column<Model> => {
  const dataIndex = ['spec', 'containers', '0', 'image'];
  return {
    key: 'podSpecImage',
    display: true,
    dataIndex,
    title: i18n.t('phase'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
  };
};

export const WorkloadImageColumnRenderer = <Model extends ResourceModel>(
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
  };
};

export const PodSpecImageColumnRenderer = <Model extends ResourceModel>(
  i18n: i18n
): Column<Model> => {
  const dataIndex = ['spec', 'containers', '0', 'image'];
  return {
    key: 'podSpecImage',
    display: true,
    dataIndex,
    title: i18n.t('phase'),
    sortable: true,
    sorter: CommonSorter(dataIndex),
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
      console.log('record', record);
      return (
        <span>
          {record.status?.readyReplicas}/{record.status?.replicas}
        </span>
      );
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
      return <span>{new Date(value).toDateString()}</span>;
    },
  };
};
