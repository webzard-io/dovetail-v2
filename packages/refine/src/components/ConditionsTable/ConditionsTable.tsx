import { useUIKit } from '@cloudtower/eagle';
import React from 'react';

type Condition = {
  lastTransitionTime: string;
  lastUpdateTime: string;
  message: string;
  reason: string;
  status: 'True' | 'False' | 'Unknown';
  type: 'Available';
};

type Props = {
  conditions: Condition[];
};

export const ConditionsTable: React.FC<Props> = ({ conditions }) => {
  const kit = useUIKit();

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
      title: 'Condition',
      sortable: true,
    },
    {
      key: 'status',
      display: true,
      dataIndex: 'status',
      title: 'Status',
      sortable: true,
    },
    {
      key: 'lastUpdateTime',
      display: true,
      dataIndex: 'lastUpdateTime',
      title: 'Updated',
      sortable: true,
      render: (value: string) => {
        return <span>{new Date(value).toDateString()}</span>;
      },
    },
    {
      key: 'message',
      display: true,
      dataIndex: 'message',
      title: 'Message',
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
