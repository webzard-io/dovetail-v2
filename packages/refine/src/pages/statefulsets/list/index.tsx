import { IResourceComponentsProps } from '@refinedev/core';
import { StatefulSet } from 'kubernetes-types/apps/v1';
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
  ReplicasColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { WorkloadModel } from 'src/model/workload-model';
import { WithId } from 'src/types';

export const StatefulSetList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<WithId<StatefulSet>, WorkloadModel>({
    useTableParams: {},
    columns: [
      PhaseColumnRenderer(),
      NameColumnRenderer(),
      NameSpaceColumnRenderer(),
      WorkloadImageColumnRenderer(),
      ReplicasColumnRenderer(),
      AgeColumnRenderer(),
    ],
    tableProps: {
      currentSize: 10,
    },
    formatter: d => new WorkloadModel(d),
    Dropdown: WorkloadDropdown,
  });

  return (
    <ListPage title="StatefulSet" selectedKeys={selectedKeys} tableProps={tableProps} />
  );
};
