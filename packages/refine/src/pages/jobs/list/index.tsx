import { IResourceComponentsProps } from '@refinedev/core';
import { Job } from 'kubernetes-types/batch/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ListPage from 'src/components/ListPage';
import { useEagleTable } from 'src/hooks/useEagleTable';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
  DurationColumnRenderer,
  CompletionsCountColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { JobModel } from 'src/model';
import { WithId } from 'src/types';

export const JobList: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  const { tableProps, selectedKeys } = useEagleTable<WithId<Job>, JobModel>({
    useTableParams: {},
    columns: [
      PhaseColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      WorkloadImageColumnRenderer(i18n),
      CompletionsCountColumnRenderer(i18n),
      DurationColumnRenderer(i18n),
      AgeColumnRenderer(i18n),
    ],
    tableProps: {
      currentSize: 10,
    },
    formatter: d => new JobModel(d),
  });

  return <ListPage title="Jobs" selectedKeys={selectedKeys} tableProps={tableProps} />;
};
