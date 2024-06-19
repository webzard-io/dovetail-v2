import { IResourceComponentsProps } from '@refinedev/core';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ListPage } from 'src/components/ListPage';
import { ReplicasDropdown } from 'src/components/ReplicasDropdown';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  ReplicasColumnRenderer,
  WorkloadRestartsColumnRenderer,
  StateDisplayColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import useNamespaceRefineFilter from 'src/hooks/useNamespaceRefineFilter';
import { DeploymentModel } from '../../../models';

export const DeploymentList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  const filters = useNamespaceRefineFilter();
  const { tableProps, selectedKeys } = useEagleTable<DeploymentModel>({
    useTableParams: {
      filters
    },
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
      defaultSize: 10,
    },
    Dropdown: ReplicasDropdown,
  });

  useEffect(() => {
    tableProps.onPageChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <ListPage
      selectedKeys={selectedKeys}
      tableProps={tableProps}
    />
  );
};
