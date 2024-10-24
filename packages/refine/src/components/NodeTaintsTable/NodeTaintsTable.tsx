import { Tooltip } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { Taint } from 'kubernetes-types/core/v1';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';
import InternalBaseTable from 'src/components/InternalBaseTable';
import ComponentContext from 'src/contexts/component';
import { addDefaultRenderToColumns } from 'src/hooks/useEagleTable';
import useTableData from 'src/hooks/useTableData';
import { WithId } from 'src/types';
import { addId } from '../../utils/addId';
import {
  NodeTaintEffect,
  TaintEffectTooltip,
} from '../EditMetadataForm/EditNodeTaintForm';

type Props = {
  taints: Taint[];
};

const EffectStyle = css`
  border-bottom: 1px dashed rgba(107, 128, 167, 0.6);
`;

export const NodeTaintsTable: React.FC<Props> = ({ taints = [] }) => {
  const { t } = useTranslation();
  const component = useContext(ComponentContext);
  const Table = component.Table || InternalBaseTable;
  const taintsWithId = addId(taints, 'key');

  const columns = [
    {
      key: 'key',
      display: true,
      dataIndex: 'key',
      title: t('dovetail.key'),
      sortable: true,
    },
    {
      key: 'value',
      display: true,
      dataIndex: 'value',
      title: t('dovetail.value'),
      sortable: true,
    },
    {
      key: 'effect',
      display: true,
      dataIndex: 'effect',
      title: t('dovetail.effect'),
      sortable: true,
      render: (value: NodeTaintEffect) => {
        return (
          <Tooltip title={<TaintEffectTooltip effect={value} />}>
            <span className={EffectStyle}>{t(`dovetail.node_taint_${value}`)}</span>
          </Tooltip>
        );
      },
    },
  ];
  const {
    data: finalData,
    currentPage,
    onPageChange,
    onSorterChange,
  } = useTableData({
    data: taintsWithId,
    columns,
    defaultSorters: [
      {
        field: 'lastUpdateTime',
        order: 'desc',
      },
    ],
  });
  const currentSize = 10;

  if (taintsWithId.length === 0) {
    return (
      <ErrorContent
        errorText={t('dovetail.no_resource', { kind: t('dovetail.taint') })}
        type={ErrorContentType.Card}
      />
    );
  }

  return (
    <Table<WithId<Taint>>
      tableKey="condition"
      loading={false}
      data={finalData}
      total={taintsWithId.length}
      columns={addDefaultRenderToColumns<WithId<Taint>>(columns)}
      rowKey="key"
      empty={t('dovetail.empty')}
      defaultSize={currentSize}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onSorterChange={onSorterChange}
      showMenuColumn={false}
    />
  );
};
