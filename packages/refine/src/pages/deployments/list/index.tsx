import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReplicasDropdown } from 'src/components/Dropdowns/ReplicasDropdown';
import { ListPage } from 'src/components/ListPage';
import ValueDisplay from 'src/components/ValueDisplay';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  ReplicasColumnRenderer,
  RestartsColumnRenderer,
  StateDisplayColumnRenderer,
  CommonSorter,
} from 'src/hooks/useEagleTable/columns';
import { DeploymentModel } from '../../../models';

export const DeploymentList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<DeploymentModel>({
    useTableParams: {},
    columns: [
      StateDisplayColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      {
        key: 'services',
        display: true,
        width: 120,
        dataIndex: ['services', 'length'],
        align: 'right',
        sortable: true,
        sorter: CommonSorter(['services', 'length']),
        title: i18n.t('dovetail.service'),
        render: (value: number) => {
          return <ValueDisplay value={value} />;
        },
      },
      {
        key: 'ingresses',
        display: true,
        width: 120,
        dataIndex: ['ingresses', 'length'],
        align: 'right',
        sortable: true,
        sorter: CommonSorter(['ingresses', 'length']),
        title: i18n.t('dovetail.ingress'),
        render: (value: number) => {
          return <ValueDisplay value={value} />;
        },
      },
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

  return <ListPage selectedKeys={selectedKeys} tableProps={tableProps} />;
};
