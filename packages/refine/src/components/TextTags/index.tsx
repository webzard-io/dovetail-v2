import { OverflowTooltip } from '@cloudtower/eagle';
import React from 'react';
import ValueDisplay from 'src/components/ValueDisplay';

type Props = {
  value?: Record<string, string>;
};

export const TextTags: React.FC<Props> = props => {
  const { value } = props;

  if (!value) {
    return <ValueDisplay value="" />;
  }
  const tags = Object.keys(value).map(key => {
    return (
      <li key={key}>
        <OverflowTooltip content={`${key}=${value[key]}`}>
        </OverflowTooltip>
      </li>
    );
  });

  return <ul>{tags}</ul>;
};
