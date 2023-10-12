import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useDataProvider, useParsed } from '@refinedev/core';
import { OwnerReference } from 'kubernetes-types/meta/v1';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AgeColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
  WorkloadImageColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { JobModel } from '../../model';
import Table from '../Table';
import { TableToolBar } from '../Table/TableToolBar';

function matchOwner(
  job: JobModel,
  owner: OwnerReference & { namespace: string }
): boolean {
  let match = false;
  // TODO: use relations
  for (const o of job.metadata?.ownerReferences || []) {
    if (
      o.apiVersion === owner.apiVersion &&
      o.kind === owner.kind &&
      o.name === owner.name &&
      job.namespace === owner.namespace
    ) {
      match = true;
    }
  }
  return match;
}

export const CronjobJobsTable: React.FC<{
  owner?: OwnerReference & { namespace: string };
}> = ({ owner }) => {
  const kit = useUIKit();
  const dataProvider = useDataProvider()();
  const { id } = useParsed();
  const { i18n } = useTranslation();
  const [jobs, setJobs] = useState<JobModel[] | undefined>(undefined);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    dataProvider
      .getList({ resource: 'jobs', meta: { resourceBasePath: '/apis/batch/v1' } })
      .then(res => {
        setJobs(
          res.data
            .map(p => new JobModel(p as any))
            .filter(p => {
              return owner ? matchOwner(p, owner) : true;
            })
        );
      });
  }, [dataProvider, id, owner]);

  const columns = [
    PhaseColumnRenderer(i18n),
    NameColumnRenderer(i18n, 'jobs'),
    NameSpaceColumnRenderer(i18n),
    WorkloadImageColumnRenderer(i18n),
    {
      key: 'completions',
      display: true,
      dataIndex: ['spec', 'completions'],
      title: 'Completions',
      sortable: true,
    },
    {
      key: 'duration',
      display: true,
      dataIndex: ['duration'],
      title: 'Duration',
      sortable: true,
    },
    AgeColumnRenderer(i18n),
  ];

  return (
    <kit.space
      direction="vertical"
      className={css`
        width: 100%;
      `}
    >
      <TableToolBar title="Jobs" selectedKeys={selectedKeys} hideCreate />
      <Table
        loading={!jobs}
        dataSource={jobs || []}
        columns={columns}
        onSelect={keys => setSelectedKeys(keys as string[])}
        rowKey="id"
        error={false}
        currentPage={currentPage}
        onPageChange={p => setCurrentPage(p)}
        currentSize={10}
        refetch={() => null}
      />
    </kit.space>
  );
};
