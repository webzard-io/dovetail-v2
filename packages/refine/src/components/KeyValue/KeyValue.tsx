import { useUIKit } from '@cloudtower/eagle';
import React from 'react';

type Props = {
  value?: Record<string, string>;
};

export const KeyValue: React.FC<Props> = ({ value }) => {
  const kit = useUIKit();

  if (!value || Object.keys.length === 0) {
    return <div>Empty</div>;
  }

  const data = Object.keys(value).map(key => {
    return {
      id: key,
      key,
      value: value[key],
    };
  });

  return (
    <kit.table
      loading={false}
      columns={[
        {
          key: 'key',
          title: 'Key',
          dataIndex: ['key'],
        },
        {
          key: 'value',
          title: 'Value',
          dataIndex: ['value'],
        },
      ]}
      dataSource={data}
    />
  );
};
