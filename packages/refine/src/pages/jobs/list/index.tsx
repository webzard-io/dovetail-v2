import { css } from '@linaria/core';
import { IResourceComponentsProps } from '@refinedev/core';
import { Job } from 'kubernetes-types/batch/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Table from 'src/components/Table';
import { TableToolBar } from 'src/components/Table/TableToolBar';
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
import { JobModel } from '../../../model';
import { WithId } from '../../../types';

const ListPageStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TableStyle = css`
  flex: 1;
  min-height: 0;
`;

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

  return (
    <div className={ListPageStyle}>
      <TableToolBar title="Jobs" selectedKeys={selectedKeys} />
      <Table {...tableProps} className={TableStyle} scroll={{ y: 'calc(100% - 48px)' }} />
    </div>
  );
};
