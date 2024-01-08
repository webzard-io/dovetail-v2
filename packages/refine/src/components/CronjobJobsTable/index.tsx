import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useList } from '@refinedev/core';
import { OwnerReference } from 'kubernetes-types/meta/v1';
import React, { useMemo, useState } from 'react';
import {
  AgeColumnRenderer,
  CompletionsCountColumnRenderer,
  DurationColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
  WorkloadImageColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { CronJobModel } from '../../models';
import Table, { Column } from '../Table';
import { TableToolBar } from '../Table/TableToolBar';

function matchOwner(
  job: CronJobModel,
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
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data } = useList<CronJobModel>({
    resource: 'jobs',
    meta: { resourceBasePath: '/apis/batch/v1', kind: 'Job' },
  });

  const dataSource = useMemo(() => {
    return data?.data.filter(p => {
      return owner ? matchOwner(p, owner) : true;
    });
  }, [data?.data, owner]);

  const columns: Column<CronJobModel>[] = [
    PhaseColumnRenderer(),
    NameColumnRenderer('jobs'),
    NameSpaceColumnRenderer(),
    WorkloadImageColumnRenderer(),
    CompletionsCountColumnRenderer(),
    DurationColumnRenderer(),
    AgeColumnRenderer(),
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
        tableKey='cronjobs'
        loading={!dataSource}
        data={dataSource || []}
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
