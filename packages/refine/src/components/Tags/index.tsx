import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';

const TagWrapper = css`
  flex-wrap: wrap;
  max-width: 100%;
`;

const TagStyle = css`
  overflow: hidden;
  text-overflow: ellipsis;
`;

type Props = {
  value?: Record<string, string>;
};

export const Tags: React.FC<Props> = props => {
  const { value } = props;
  const kit = useUIKit();

  if (!value) {
    return <span>-</span>;
  }
  const tags = Object.keys(value).map(key => {
    return (
      <kit.tag.SplitTag
        className={TagStyle}
        primaryContent={key}
        secondaryContent={value[key]}
        title={`${key}:${value[key]}`}
        color="gray"
        key={key}
      />
    );
  });

  return (
    <kit.space className={TagWrapper} size={8}>
      {tags}
    </kit.space>
  );
};
