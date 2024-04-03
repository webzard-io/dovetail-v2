import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';
import ValueDisplay from 'src/components/ValueDisplay';

const TagWrapper = css`
  flex-wrap: wrap;
  max-width: 100%;
  gap: 8px 8px;
`;

const TagStyle = css`
  &.ant-tag {
    overflow: hidden;
    text-overflow: ellipsis;
    color: #1D326C;

    &.outside-tag {
      border: 1px solid #A3B4CC;
      background-color: #E4E9F2;
    }

    .inside-tag {
      background-color: #CCD4E3;
    }
  }
`;

type Props = {
  value?: Record<string, string>;
};

export const Tags: React.FC<Props> = props => {
  const { value } = props;
  const kit = useUIKit();

  if (!value) {
    return <ValueDisplay value="" />;
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
