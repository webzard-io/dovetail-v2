import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useDataProvider, useParsed } from '@refinedev/core';
import { Pod } from 'kubernetes-types/core/v1';
import { LabelSelector } from 'kubernetes-types/meta/v1';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NameColumnRenderer,
  NodeNameColumnRenderer,
  PhaseColumnRenderer,
  RestartCountColumnRenderer,
  WorkloadImageColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { PodModel } from '../../model';
import { WithId } from '../../types';
import Table, { Column } from '../Table';
import { TableToolBar } from '../Table/TableToolBar';

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
  const { i18n } = useTranslation();
  const [pods, setPods] = useState<PodModel[] | undefined>(undefined);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    dataProvider
      .getList({ resource: 'pods', meta: { resourceBasePath: '/api/v1' } })
      .then(res => {
        setPods(
          res.data
            .map(p => new PodModel(p as WithId<Pod>))
            .filter(p => {
              return selector ? matchSelector(p, selector) : true;
            })
        );
      });
  }, [dataProvider, id, selector]);

  const columns: Column<PodModel>[] = [
    PhaseColumnRenderer(i18n),
    NameColumnRenderer(i18n, 'pods'),
    NodeNameColumnRenderer(i18n),
    WorkloadImageColumnRenderer(i18n),
    RestartCountColumnRenderer(i18n),
  ];

  return (
    <kit.space
      direction="vertical"
      className={css`
        width: 100%;
      `}
    >
      <TableToolBar title="" selectedKeys={selectedKeys} hideCreate />
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
