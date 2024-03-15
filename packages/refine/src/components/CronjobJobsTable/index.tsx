import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useList } from '@refinedev/core';
import { OwnerReference } from 'kubernetes-types/meta/v1';
import React, { useMemo, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ComponentContext from 'src/contexts/component';
import {
  AgeColumnRenderer,
  CompletionsCountColumnRenderer,
  DurationColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  StateDisplayColumnRenderer,
  WorkloadImageColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { CronJobModel } from '../../models';
import BaseTable, { Column } from '../Table';
import { TableToolBar } from '../Table/TableToolBar';

const WrapperStyle = css`
  &.ant-space {
    width: 100%;
    display: flex;
  }
`;

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
  hideToolBar?: boolean;
}> = ({ owner, hideToolBar }) => {
  const { i18n } = useTranslation();
  const kit = useUIKit();
  const [selectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const component = useContext(ComponentContext);
  const Table = component.Table || BaseTable;

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
    NameColumnRenderer(i18n, 'jobs'),
    StateDisplayColumnRenderer(i18n),
    NameSpaceColumnRenderer(i18n),
    WorkloadImageColumnRenderer(i18n),
    CompletionsCountColumnRenderer(i18n),
    DurationColumnRenderer(i18n),
    AgeColumnRenderer(i18n),
  ];

  return (
    <kit.space
      direction="vertical"
      className={WrapperStyle}
    >
      {hideToolBar ? null : (<TableToolBar selectedKeys={selectedKeys} hideCreate />)}
      <Table
        tableKey="cronjobs"
        loading={!dataSource}
        data={dataSource || []}
        columns={columns}
        rowKey="id"
        error={false}
        currentPage={currentPage}
        onPageChange={p => setCurrentPage(p)}
        currentSize={10}
        refetch={() => null}
        showMenuColumn={false}
      />
    </kit.space>
  );
};
