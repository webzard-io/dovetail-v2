import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useParsed, useShow } from '@refinedev/core';
import { Typography } from 'antd';
import { get } from 'lodash-es';
import React from 'react';
import { DeleteButton } from '../DeleteButton';
import { EditButton } from '../EditButton';
import { ShowField } from './Fields';

const { Title } = Typography;

const ShowContentStyle = css`
  overflow: auto;
`;

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
    <kit.space direction="vertical" className={ShowContentStyle}>
      <EditButton />
      <DeleteButton />
      {content}
    </kit.space>
  );
};
