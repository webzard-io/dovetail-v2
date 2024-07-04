import { StatusCapsuleColor, StatusCapsule } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadState } from '../../constants';

export const StateTagStyle = css`
  &.ant-tag {
    padding: 3px 16px;
    height: 24px;
  }

  &.no-background {
    background-color: transparent !important;
    padding: 0;
  }
`;

type Props = {
  state?: WorkloadState;
  className?: string;
  hideBackground?: boolean;
};

export const StateTag: React.FC<Props> = ({ state = WorkloadState.UPDATING, hideBackground, className }) => {
  const { t } = useTranslation();

  const statusMap: Record<WorkloadState, StatusCapsuleColor | 'loading'> = {
    updating: 'loading',
    ready: 'green',
    completed: 'gray',
    failed: 'red',
    suspended: 'warning',
    running: 'green',
    succeeded: 'blue',
    unknown: 'gray',
    terminating: 'loading',
    pending: 'warning',
    waiting: 'warning',
    terminated: 'red',
    stopped: 'gray',
  };

  return <StatusCapsule
    className={cx(className, StateTagStyle, hideBackground && 'no-background')}
    color={statusMap[state] !== 'loading' ? statusMap[state] as StatusCapsuleColor : undefined}
    loading={statusMap[state] === 'loading'}
  >
    {t(`dovetail.${state || 'updating'}`)}
  </StatusCapsule>;
};
