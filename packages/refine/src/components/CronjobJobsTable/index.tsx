import { Space } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { OwnerReference } from 'kubernetes-types/meta/v1';
import React, { useState, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';
import ComponentContext from 'src/contexts/component';
import { useEagleTable } from 'src/hooks/useEagleTable/useEagleTable';
import {
  AgeColumnRenderer,
  CompletionsCountColumnRenderer,
  DurationColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  StateDisplayColumnRenderer,
  WorkloadImageColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { JobModel } from '../../models';
import BaseTable, { Column } from '../InternalBaseTable';
import { TableToolBar } from '../TableToolbar';

const WrapperStyle = css`
  &.ant-space {
    width: 100%;
    display: flex;
  }
`;

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
  hideToolBar?: boolean;
}> = ({ owner, hideToolBar }) => {
  const { i18n } = useTranslation();
  const [selectedKeys] = useState<string[]>([]);
  const component = useContext(ComponentContext);
  const Table = component.Table || BaseTable;
  const columns: Column<JobModel>[] = useMemo(() => ([
    NameColumnRenderer(i18n, 'jobs'),
    StateDisplayColumnRenderer(i18n),
    NameSpaceColumnRenderer(i18n),
    {
      ...WorkloadImageColumnRenderer(i18n),
      width: 238,
    },
    CompletionsCountColumnRenderer(i18n),
    DurationColumnRenderer(i18n),
    AgeColumnRenderer(i18n),
  ]), [i18n]);
  const params = useMemo(() => ({
    columns,
    useTableParams: {
      resource: 'jobs',
      meta: { resourceBasePath: '/apis/batch/v1', kind: 'Job' },
      filters: {
        permanent: [{
          field: '',
          value: '',
          fn(item: JobModel) {
            return owner ? matchOwner(item, owner) : true;
          }
        }] as any
      }
    }
  }), [columns, owner]);

  const { tableProps } = useEagleTable<JobModel>(params);

  if (!tableProps.data?.length && !tableProps.loading) {
    return <ErrorContent
      errorText={i18n.t('dovetail.no_resource', { kind: ' Job' })}
      type={ErrorContentType.Card}
    />;
  }

  return (
    <Space
      direction="vertical"
      className={WrapperStyle}
    >
      {hideToolBar ? null : (<TableToolBar selectedKeys={selectedKeys} hideCreate />)}
      <Table
        {...tableProps}
        tableKey="cronjobs"
        showMenuColumn={false}
      />
    </Space>
  );
};
