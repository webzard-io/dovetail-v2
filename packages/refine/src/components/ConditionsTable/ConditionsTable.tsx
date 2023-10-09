import { useUIKit } from '@cloudtower/eagle';
import { Condition } from 'kubernetes-types/meta/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  conditions: Condition[];
};

export const ConditionsTable: React.FC<Props> = ({ conditions }) => {
  const kit = useUIKit();
  const { t } = useTranslation();

  const conditionsWithId = conditions.map(c => {
    return {
      ...c,
      id: c.type,
    };
  });

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
      key: 'lastUpdateTime',
      display: true,
      dataIndex: 'lastUpdateTime',
      title: t('updated_time'),
      sortable: true,
      render: (value: string) => {
        return <span>{new Date(value).toDateString()}</span>;
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

  return (
    <kit.table
      loading={false}
      dataSource={conditionsWithId}
      columns={columns}
      rowKey="type"
    />
  );
};
