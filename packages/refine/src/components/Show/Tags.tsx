import { useUIKit } from '@cloudtower/eagle';
import React from 'react';

type Props = {
  value: Record<string, string>;
};

export const Tags: React.FC<Props> = props => {
  const { value } = props;
  const kit = useUIKit();
  const tags = Object.keys(value).map(key => {
    return (
      <kit.tag key={key}>
        {key}:{value[key]}
      </kit.tag>
    );
  });
  return <kit.space size={8}>{tags}</kit.space>;
};
