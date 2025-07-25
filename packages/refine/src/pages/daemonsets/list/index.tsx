import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadDropdown } from 'src/components/Dropdowns/WorkloadDropdown';
import { ListPage } from 'src/components/ListPage';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  StateDisplayColumnRenderer,
  RestartsColumnRenderer,
  ReplicasColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { WorkloadModel } from '../../../models';

export const DaemonSetList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<WorkloadModel>({
    useTableParams: {},
    columns: [
      StateDisplayColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      WorkloadImageColumnRenderer(i18n),
      ReplicasColumnRenderer(i18n),
      RestartsColumnRenderer(i18n),
      AgeColumnRenderer(i18n),
    ],
    tableProps: {
      defaultSize: 10,
    },
    Dropdown: WorkloadDropdown,
  });

  return (
    <ListPage selectedKeys={selectedKeys} tableProps={tableProps} />
  );
};
