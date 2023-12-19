import { IResourceComponentsProps } from '@refinedev/core';
import { WorkloadModel } from 'k8s-api-provider';
import { DaemonSet } from 'kubernetes-types/apps/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ListPage } from 'src/components/ListPage';
import { WorkloadDropdown } from 'src/components/WorkloadDropdown';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { WithId } from '../../../types';

export const DaemonSetList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<WithId<DaemonSet>, WorkloadModel>({
    useTableParams: {},
    columns: [
      PhaseColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      WorkloadImageColumnRenderer(i18n),
      {
        key: 'ready',
        display: true,
        dataIndex: ['status', 'numberReady'],
        title: 'Ready',
        sortable: true,
      },
      AgeColumnRenderer(i18n),
    ],
    tableProps: {
      currentSize: 10,
    },
    Dropdown: WorkloadDropdown,
  });

  return (
    <ListPage title="DaemonSet" selectedKeys={selectedKeys} tableProps={tableProps} />
  );
};
