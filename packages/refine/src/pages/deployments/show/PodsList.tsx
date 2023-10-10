import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useDataProvider, useParsed } from '@refinedev/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StateTag } from '../../../components/StateTag';
import Table from '../../../components/Table';
import { TableToolBar } from '../../../components/Table/TableToolBar';
import { PodModel } from '../../../model/pod-model';

export const PodsList: React.FC = () => {
  const kit = useUIKit();
  const dataProvider = useDataProvider()();
  const { id } = useParsed();
  const { t } = useTranslation();
  const [pods, setPods] = useState<PodModel[] | undefined>(undefined);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

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
      title: t('state'),
      sortable: true,
      render: () => <StateTag />,
    },
    {
      key: 'name',
      display: true,
      dataIndex: ['name'],
      title: t('name'),
      sortable: true,
    },
    {
      key: 'node',
      display: true,
      dataIndex: ['nodeName'],
      title: t('node_name'),
      sortable: true,
    },
    {
      key: 'image',
      display: true,
      dataIndex: ['imageNames'],
      title: t('image'),
      sortable: true,
    },
    {
      key: 'restartCount',
      display: true,
      dataIndex: ['restartCount'],
      title: t('restarts'),
      sortable: true,
    },
  ];

  return (
    <kit.space
      direction="vertical"
      className={css`
        width: 100%;
      `}
    >
      <TableToolBar title="Pods" selectedKeys={selectedKeys} hideCreate />
      <Table
        loading={!pods}
        dataSource={pods || []}
        columns={columns}
        onSelect={keys => setSelectedKeys(keys as string[])}
        rowKey="id"
        error={false}
        currentPage={currentPage}
        onPageChange={p => setCurrentPage(p)}
        currentSize={10}
        refetch={() => null}
      />
    </kit.space>
  );
};
