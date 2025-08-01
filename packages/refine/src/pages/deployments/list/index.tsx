import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReplicasDropdown } from 'src/components/Dropdowns/ReplicasDropdown';
import { ListPage } from 'src/components/ListPage';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  ReplicasColumnRenderer,
  RestartsColumnRenderer,
  StateDisplayColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { DeploymentModel } from '../../../models';

export const DeploymentList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<DeploymentModel>({
    useTableParams: {},
    columns: [
      StateDisplayColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      WorkloadImageColumnRenderer(i18n),
      RestartsColumnRenderer(i18n),
      ReplicasColumnRenderer(i18n),
      AgeColumnRenderer(i18n),
    ],
    tableProps: {
      defaultSize: 10,
    },
    Dropdown: ReplicasDropdown,
  });

  return (
    <ListPage
      selectedKeys={selectedKeys}
      tableProps={tableProps}
    />
  );
};
