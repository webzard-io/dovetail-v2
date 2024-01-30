import { TagColor, useUIKit } from '@cloudtower/eagle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadState } from '../../constants';

type Props = {
  state?: WorkloadState;
};

export const StateTag: React.FC<Props> = ({ state = WorkloadState.UPDATEING }) => {
  const kit = useUIKit();
  const { t } = useTranslation();
  const colorMap: Record<WorkloadState, TagColor> = {
    updating: 'blue',
    ready: 'green',
    completed: 'green',
    failed: 'red',
    suspended: 'gray',
    running: 'blue',
    succeeded: 'green',
    unknown: 'gray',
    terminating: 'gray',
    pending: 'gray',
    waiting: 'gray',
  };
  return <kit.tag color={colorMap[state]}>{t(`dovetail.${state || 'updaing'}`)}</kit.tag>;
};
