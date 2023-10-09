import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';

const TagWrapper = css`
  flex-wrap: wrap;
  max-width: 100%;
`;

const TagStyle = css`
  max-width: 256px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

type Props = {
  value: Record<string, string>;
};

export const Tags: React.FC<Props> = props => {
  const { value } = props;
  const kit = useUIKit();
  const tags = Object.keys(value).map(key => {
    return (
      <kit.tag className={TagStyle} title={`${key}:${value[key]}`} key={key}>
        {key}:{value[key]}
      </kit.tag>
    );
  });
  return <kit.space className={TagWrapper} size={8}>{tags}</kit.space>;
};
