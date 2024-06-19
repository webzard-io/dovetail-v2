import { IResourceComponentsProps, useList } from '@refinedev/core';
import { compact } from 'lodash-es';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PodDropdown } from 'src/components/PodDropdown';
import { Column } from '../../../components';
import { ListPage } from '../../../components/ListPage';
import { useEagleTable } from '../../../hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  CommonSorter,
  RestartCountColumnRenderer,
  NodeNameColumnRenderer,
  StateDisplayColumnRenderer,
  PodWorkloadColumnRenderer,
  PodContainersNumColumnRenderer,
} from '../../../hooks/useEagleTable/columns';
import { PodMetricsModel, PodModel } from '../../../models';

export const PodList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  const { tableProps, selectedKeys } = useEagleTable<PodModel>({
    useTableParams: {},
    columns: compact([
      StateDisplayColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      WorkloadImageColumnRenderer(i18n),
      PodContainersNumColumnRenderer(i18n),
      RestartCountColumnRenderer(i18n),
      NodeNameColumnRenderer(i18n),
      PodWorkloadColumnRenderer(i18n),
      AgeColumnRenderer(i18n),
    ]) as Column<PodModel>[],
    tableProps: {
      defaultSize: 10,
    },
    Dropdown: PodDropdown,
  });

  return <ListPage selectedKeys={selectedKeys} tableProps={tableProps} />;
};
