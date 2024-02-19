import { IResourceComponentsProps } from '@refinedev/core';
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
  StateDisplayColumnRenderer,
  ReplicasColumnRenderer,
  WorkloadRestartsColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { WorkloadModel } from '../../../models';

export const StatefulSetList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<WorkloadModel>({
    useTableParams: {},
    columns: [
      StateDisplayColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      WorkloadImageColumnRenderer(i18n),
      WorkloadRestartsColumnRenderer(i18n),
      ReplicasColumnRenderer(i18n),
      AgeColumnRenderer(i18n),
    ],
    tableProps: {
      currentSize: 10,
    },
    Dropdown: WorkloadDropdown,
  });

  return (
    <ListPage title="StatefulSet" selectedKeys={selectedKeys} tableProps={tableProps} />
  );
};
