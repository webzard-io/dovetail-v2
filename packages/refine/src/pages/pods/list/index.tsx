import { IResourceComponentsProps } from '@refinedev/core';
import { Pod } from 'kubernetes-types/core/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ListPage from 'src/components/ListPage';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
  CommonSorter,
  RestartCountColumnRenderer,
  NodeNameColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { PodModel } from 'src/model';
import { WithId } from 'src/types';

export const PodList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<WithId<Pod>, PodModel>({
    useTableParams: {},
    columns: [
      PhaseColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      WorkloadImageColumnRenderer(i18n),
      {
        key: 'readyDisplay',
        display: true,
        dataIndex: ['readyDisplay'],
        title: 'Ready',
        sortable: true,
        sorter: CommonSorter(['readyDisplay']),
      },
      RestartCountColumnRenderer(i18n),
      NodeNameColumnRenderer(i18n),
      {
        key: 'ip',
        display: true,
        dataIndex: ['status', 'podIP'],
        title: 'IP',
        sortable: true,
        sorter: CommonSorter(['status', 'podIP']),
      },
      AgeColumnRenderer(i18n),
    ],
    tableProps: {
      currentSize: 10,
    },
    formatter: d => new PodModel(d),
  });

  return (
    <ListPage
      title="Pod"
      selectedKeys={selectedKeys}
      tableProps={tableProps}
    />
  );
};
