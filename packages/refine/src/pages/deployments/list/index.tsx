import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { ListPage } from 'src/components/ListPage';
import { WorkloadDropdown } from 'src/components/WorkloadDropdown';
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
import { FormType } from 'src/types';
import { WorkloadModel } from '../../../models';

export const DeploymentList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, selectedKeys } = useEagleTable<WorkloadModel>({
    useTableParams: {},
    columns: [
      StateDisplayColumnRenderer(),
      NameColumnRenderer(),
      NameSpaceColumnRenderer(),
      WorkloadImageColumnRenderer(),
      WorkloadRestartsColumnRenderer(),
      ReplicasColumnRenderer(),
      AgeColumnRenderer(),
    ],
    tableProps: {
      currentSize: 10,
    },
    Dropdown: WorkloadDropdown,
    formType: FormType.MODAL,
  });

  return (
    <ListPage
      title="Deployments"
      selectedKeys={selectedKeys}
      tableProps={tableProps}
      formType={FormType.MODAL}
    />
  );
};
