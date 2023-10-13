import { TagColor, useUIKit } from '@cloudtower/eagle';
import React from 'react';

type Props = {
  state?: string;
};

export const StateTag: React.FC<Props> = ({ state }) => {
  const kit = useUIKit();
  const colorMap: Record<string, TagColor> = {
    running: 'green',
    active: 'green',
    succeeded: 'blue',
    terminated: 'red',
    pending: 'gray',
  };
  return (
    <kit.tag color={colorMap[state?.toLowerCase() || ''] || 'green'}>
      {state || 'Active'}
    </kit.tag>
  );
};
