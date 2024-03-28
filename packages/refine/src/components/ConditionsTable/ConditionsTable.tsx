import { StatusCapsule, StatusCapsuleColor } from '@cloudtower/eagle';
import { cx } from '@linaria/core';
import { Condition } from 'kubernetes-types/meta/v1';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';
import { StateTagStyle } from 'src/components/StateTag';
import BaseTable from 'src/components/Table';
import ComponentContext from 'src/contexts/component';
import { addDefaultRenderToColumns } from 'src/hooks/useEagleTable';
import { WithId } from 'src/types';
import { addId } from '../../utils/addId';
import { Time } from '../Time';

type Props = {
  conditions: Condition[];
};

export const ConditionsTable: React.FC<Props> = ({ conditions = [] }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t } = useTranslation();
  const component = useContext(ComponentContext);
  const Table = component.Table || BaseTable;
  const currentSize = 10;

  const conditionsWithId = addId(conditions, 'type');

  const columns = [
    {
      key: 'type',
      display: true,
      dataIndex: 'type',
      title: t('dovetail.type'),
      width: 120,
      sortable: true,
    },
    {
      key: 'status',
      display: true,
      dataIndex: 'status',
      title: t('dovetail.state'),
      render(value: string) {
        const colorMap: Record<string, StatusCapsuleColor> = {
          'True': 'green',
          'False': 'red',
          'Unknown': 'warning',
        };

        return (
          <StatusCapsule color={colorMap[value || 'Unknown']} className={cx(StateTagStyle, 'no-background')}>
            {t(`dovetail.${value.toLowerCase()}`)}
          </StatusCapsule>
        );
      },
      width: 120,
      sortable: true,
    },
    {
      key: 'lastUpdateTime',
      display: true,
      dataIndex: 'lastUpdateTime',
      title: t('dovetail.updated_time'),
      sortable: true,
      width: 120,
      render: (value: string, record: Condition) => {
        const time = value || record.lastTransitionTime;
        return <Time date={new Date(time)} />;
      },
    },
    {
      key: 'reason',
      display: true,
      dataIndex: 'reason',
      title: t('dovetail.reason'),
      sortable: true,
      width: 300,
    },
    {
      key: 'message',
      display: true,
      dataIndex: 'message',
      title: t('dovetail.message'),
      sortable: true,
      width: 403,
    },
  ];

  if (conditionsWithId.length === 0) {
    return <ErrorContent
      errorText={t('dovetail.no_resource', { kind: t('dovetail.condition') })}
      style={{ padding: '15px 0' }}
      type={ErrorContentType.Card}
    />;
  }

  return (
    <Table<WithId<Condition>>
      tableKey="condition"
      loading={false}
      data={conditionsWithId.slice((currentPage - 1) * currentSize, currentPage * currentSize)}
      total={conditionsWithId.length}
      columns={addDefaultRenderToColumns<WithId<Condition>>(columns)}
      rowKey="type"
      empty={t('dovetail.empty')}
      defaultSize={currentSize}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      showMenuColumn={false}
    />
  );
};
