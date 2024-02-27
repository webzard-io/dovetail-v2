import { StatusCapsuleColor, useUIKit } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadState } from '../../constants';

const StateTagStyle = css`
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

export const StateTag: React.FC<Props> = ({ state = WorkloadState.UPDATEING, hideBackground, className }) => {
  const kit = useUIKit();
  const { t } = useTranslation();

  const colorMap: Record<WorkloadState, StatusCapsuleColor> = {
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

  return <kit.statusCapsule
    className={cx(className, StateTagStyle, hideBackground && 'no-background')}
    color={colorMap[state]}
  >
    {t(`dovetail.${state || 'updaing'}`)}
  </kit.statusCapsule>;
};
