import { useUIKit } from '@cloudtower/eagle';
import React from 'react';

export const StateTag: React.FC = () => {
  const kit = useUIKit();
  return <kit.tag color="green">Active</kit.tag>;
};
