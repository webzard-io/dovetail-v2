import { useUIKit } from '@cloudtower/eagle';
import { useGo, useNavigation, useParsed } from '@refinedev/core';
import { get } from 'lodash';
import React from 'react';
import { StateTag } from '../../components/StateTag';
import { Column, IDObject } from '../../components/Table';

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

const CommonSorter =
  (dataIndex: string[]) =>
  <T extends IDObject>(a: T, b: T) => {
    const valA = get(a, dataIndex);
    const valB = get(b, dataIndex);
    if (valA === valB) return 0;
    if (valA > valB) return 1;
    return -1;
  };

export const NameColumnRenderer = <T extends IDObject>(): Column<T> => {
  const dataIndex = ['metadata', 'name'];
  return {
    key: 'name',
    display: true,
    dataIndex,
    title: '名字',
    sortable: true,
    sorter: CommonSorter(dataIndex),
    render: (v: string, record: T) => {
      return <NameLink name={v} id={record.id} />;
    },
  };
};

export const NameSpaceColumnRenderer = <T extends IDObject>(): Column<T> => {
  const dataIndex = ['metadata', 'namespace'];
  return {
    key: 'namespace',
    display: true,
    dataIndex,
    title: '名字空间',
    sortable: true,
    sorter: CommonSorter(dataIndex),
  };
};

export const PhaseColumnRenderer = <T extends IDObject>(): Column<T> => {
  const dataIndex = ['status', 'phase'];
  return {
    key: 'phase',
    display: true,
    dataIndex: dataIndex,
    title: '状态',
    sortable: true,
    sorter: CommonSorter(dataIndex),
    render: () => <StateTag />,
  };
};

export const PocImageColumnRenderer = <T extends IDObject>(): Column<T> => {
  const dataIndex = ['spec', 'containers', '0', 'image'];
  return {
    key: 'podSpecImage',
    display: true,
    dataIndex,
    title: '镜像',
    sortable: true,
    sorter: CommonSorter(dataIndex),
  };
};

export const DeploymentImageColumnRenderer = <T extends IDObject>(): Column<T> => {
  const dataIndex = ['spec', 'template', 'spec', 'containers', '0', 'image'];
  return {
    key: 'podSpecImage',
    display: true,
    dataIndex,
    title: '镜像',
    sortable: true,
    sorter: CommonSorter(dataIndex),
  };
};

export const PodSpecImageColumnRenderer = <T extends IDObject>(): Column<T> => {
  const dataIndex = ['spec', 'containers', '0', 'image'];
  return {
    key: 'podSpecImage',
    display: true,
    dataIndex,
    title: '镜像',
    sortable: true,
    sorter: CommonSorter(dataIndex),
  };
};

export const ReplicasColumnRenderer = <T extends IDObject>(): Column<T> => {
  const dataIndex = ['status', 'replicas'];
  return {
    key: 'replicas',
    display: true,
    dataIndex,
    title: '副本数',
    sortable: true,
    sorter: CommonSorter(dataIndex),
    render: (_, record: any) => {
      return (
        <span>
          {record.status.readyReplicas}/{record.status.replicas}
        </span>
      );
    },
  };
};

export const AgeColumnRenderer = <T extends IDObject>(): Column<T> => {
  const dataIndex = ['metadata', 'creationTimestamp'];
  return {
    key: 'creationTimestamp',
    display: true,
    dataIndex,
    title: '创建时间',
    sortable: true,
    sorter: (a: T, b: T) => {
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
