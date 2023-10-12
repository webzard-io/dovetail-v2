import { useUIKit } from '@cloudtower/eagle';
import React from 'react';

type Props = {
  state: string;
};

export const StateTag: React.FC<Props> = ({ state }) => {
  const kit = useUIKit();
  return <kit.tag color="green">{state || 'Active'}</kit.tag>;
};
