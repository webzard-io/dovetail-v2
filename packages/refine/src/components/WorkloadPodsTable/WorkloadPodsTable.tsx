import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useDataProvider, useParsed } from '@refinedev/core';
import { LabelSelector } from 'kubernetes-types/meta/v1';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PodModel } from '../../model';
import { StateTag } from '../StateTag';
import Table from '../Table';
import { TableToolBar } from '../Table/TableToolBar';
import { ImageNames } from '../ImageNames';

function matchSelector(pod: PodModel, selector: LabelSelector): boolean {
  let match = true;
  // TODO: support complete selector match strategy
  // https://github.com/rancher/dashboard/blob/master/shell/utils/selector.js#L166
  for (const key in selector.matchLabels) {
    if (
      !pod.metadata?.labels?.[key] ||
      pod.metadata.labels?.[key] !== selector.matchLabels[key]
    ) {
      match = false;
    }
  }
  return match;
}

export const WorkloadPodsTable: React.FC<{ selector?: LabelSelector }> = ({
  selector,
}) => {
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
        setPods(
          res.data
            .map(p => new PodModel(p as any))
            .filter(p => {
              return selector ? matchSelector(p, selector) : true;
            })
        );
      });
  }, [dataProvider, id, selector]);

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
      render(value: string[]) {
        return (
          <>
            <ImageNames value={value} />
          </>
        );
      },
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
