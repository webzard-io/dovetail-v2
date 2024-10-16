import { StatusCapsuleColor, StatusCapsule } from '@cloudtower/eagle';
import { cx } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StateTagStyle } from 'src/styles/tag';
import { ResourceState } from '../../constants';

type Props = {
  state?: ResourceState;
  resourceKind?: string;
  className?: string;
  hideBackground?: boolean;
};

export const StateTag: React.FC<Props> = (props) => {
  const { state = ResourceState.UPDATING, hideBackground, className, resourceKind } = props;
  const { t } = useTranslation();

  const defaultStateMap: Record<string, StatusCapsuleColor | 'loading'> = {
    [ResourceState.UPDATING]: 'loading',
    [ResourceState.READY]: 'green',
    [ResourceState.COMPLETED]: 'gray',
    [ResourceState.FAILED]: 'red',
    [ResourceState.SUSPENDED]: 'warning',
    [ResourceState.RUNNING]: 'green',
    [ResourceState.SUCCEEDED]: 'blue',
    [ResourceState.UNKNOWN]: 'gray',
    [ResourceState.TERMINATING]: 'loading',
    [ResourceState.PENDING]: 'warning',
    [ResourceState.WAITING]: 'warning',
    [ResourceState.TERMINATED]: 'red',
    [ResourceState.STOPPED]: 'gray',
    [ResourceState.AVAILABLE]: 'blue',
    [ResourceState.BOUND]: 'green',
    [ResourceState.RELEASED]: 'gray',
    [ResourceState.LOST]: 'red',
  };
  const resourceStateMap: Record<string, Record<string, StatusCapsuleColor | 'loading'>> = {};
  const finalStateMap = resourceStateMap[resourceKind || ''] || defaultStateMap;

  return <StatusCapsule
    className={cx(className, StateTagStyle, hideBackground && 'no-background')}
    color={finalStateMap[state] !== 'loading' ? finalStateMap[state] as StatusCapsuleColor : undefined}
    loading={finalStateMap[state] === 'loading'}
  >
    {t(`dovetail.${state || 'updating'}_state`)}
  </StatusCapsule>;
};
