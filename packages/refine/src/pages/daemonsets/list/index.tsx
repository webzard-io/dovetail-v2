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
  StateDisplayColumnRenderer,
  WorkloadRestartsColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { WorkloadModel } from '../../../models';

export const DaemonSetList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, selectedKeys } = useEagleTable<WorkloadModel>({
    useTableParams: {},
    columns: [
      StateDisplayColumnRenderer(),
      NameColumnRenderer(),
      NameSpaceColumnRenderer(),
      WorkloadImageColumnRenderer(),
      {
        key: 'ready',
        display: true,
        dataIndex: ['status', 'numberReady'],
        title: 'Ready',
        sortable: true,
      },
      WorkloadRestartsColumnRenderer(),
      AgeColumnRenderer(),
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
