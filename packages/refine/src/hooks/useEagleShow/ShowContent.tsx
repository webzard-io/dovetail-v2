import { useUIKit } from '@cloudtower/eagle';
import { useParsed, useShow } from '@refinedev/core';
import { Typography } from 'antd';
import { get } from 'lodash-es';
import React from 'react';
import { DeleteButton } from '../../components/DeleteButton';
import { EditButton } from '../../components/EditButton';

const { Title } = Typography;

type ShowField = {
  title: string;
  path: string[];
  render?: (val: unknown) => React.ReactElement;
};

export const MetadataFields: ShowField[] = [
  {
    title: '名字',
    path: ['metadata', 'name'],
  },
  {
    title: '名字空间',
    path: ['metadata', 'namespace'],
  },
  {
    title: '创建时间',
    path: ['metadata', 'creationTimestamp'],
  },
];

export const ShowContent: React.FC<{ fields: ShowField[] }> = props => {
  const { fields } = props;
  const kit = useUIKit();
  const parsed = useParsed();
  const { queryResult } = useShow({ id: parsed?.params?.id });
  const { data } = queryResult;
  const record = data?.data;

  const content = fields.map(field => {
    let content = <span>{get(record, field.path)}</span>;
    if (field.render) {
      content = field.render(get(record, field.path));
    }
    return (
      <kit.space key={field.path.join()} direction="vertical">
        <Title level={4}>{field.title}</Title>
        {content}
      </kit.space>
    );
  });

  return (
    <kit.space direction="vertical">
      <EditButton />
      <DeleteButton />
      {content}
    </kit.space>
  );
};
