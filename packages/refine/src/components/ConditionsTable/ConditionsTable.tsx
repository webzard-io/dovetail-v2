import { useUIKit } from '@cloudtower/eagle';
import { Condition } from 'kubernetes-types/meta/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { addId } from '../../utils/addId';
import ErrorContent from '../Table/ErrorContent';
import Time from '../Time';

type Props = {
  conditions: Condition[];
};

export const ConditionsTable: React.FC<Props> = ({ conditions = [] }) => {
  const kit = useUIKit();
  const { t } = useTranslation();

  const conditionsWithId = addId(conditions, 'type');

  const columns = [
    {
      key: 'type',
      display: true,
      dataIndex: 'type',
      title: t('condition'),
      sortable: true,
    },
    {
      key: 'status',
      display: true,
      dataIndex: 'status',
      title: t('status'),
      sortable: true,
    },
    {
      key: 'reason',
      display: true,
      dataIndex: 'reason',
      title: t('reason'),
      sortable: true,
    },
    {
      key: 'lastUpdateTime',
      display: true,
      dataIndex: 'lastUpdateTime',
      title: t('updated_time'),
      sortable: true,
      render: (value: string, record: Condition) => {
        const time = value || record.lastTransitionTime;
        return <Time date={new Date(time)} />;
      },
    },
    {
      key: 'message',
      display: true,
      dataIndex: 'message',
      title: t('message'),
      sortable: true,
    },
  ];

  if (conditionsWithId.length === 0) {
    return <ErrorContent errorText={t('dovetail.empty')} style={{ padding: '15px 0' }} />;
  }

  return (
    <kit.table
      loading={false}
      dataSource={conditionsWithId}
      columns={columns}
      rowKey="type"
      empty={t('dovetail.empty')}
    />
  );
};
