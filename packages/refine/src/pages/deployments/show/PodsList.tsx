import { useUIKit } from '@cloudtower/eagle';
import { useDataProvider, useParsed } from '@refinedev/core';
import React, { useEffect, useState } from 'react';
import { PodModel } from '../../../model/PodModel';
import { StateTag } from '../../../components/StateTag';

type Props = {};

export const PodsList: React.FC<Props> = () => {
  const kit = useUIKit();
  const dataProvider = useDataProvider()();
  const { id } = useParsed();
  const [pods, setPods] = useState<PodModel[]>([]);

  useEffect(() => {
    dataProvider
      .getList({ resource: 'pods', meta: { resourceBasePath: '/api/v1' } })
      .then(res => {
        console.log('res.data', res.data);
        setPods(res.data.map(p => new PodModel(p as any)));
      });
  }, [dataProvider, id]);

  const columns = [
    {
      key: 'state',
      display: true,
      dataIndex: [],
      title: 'State',
      sortable: true,
      render: () => <StateTag />,
    },
    {
      key: 'name',
      display: true,
      dataIndex: ['name'],
      title: 'Name',
      sortable: true,
    },
    {
      key: 'node',
      display: true,
      dataIndex: ['nodeName'],
      title: 'Node',
      sortable: true,
    },
    {
      key: 'image',
      display: true,
      dataIndex: ['imageNames'],
      title: 'Image',
      sortable: true,
    },
    {
      key: 'restartCount',
      display: true,
      dataIndex: ['restartCount'],
      title: 'Restarts',
      sortable: true,
    },
  ];

  return <kit.table loading={false} dataSource={pods} columns={columns} rowKey="type" />;
};
