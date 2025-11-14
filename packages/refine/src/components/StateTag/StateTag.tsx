import { StatusCapsuleColor, StatusCapsule } from '@cloudtower/eagle';
import { cx } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StateTagStyle } from 'src/styles/tag';
import { ResourceState } from '../../constants';

type Props = {
  state?: ResourceState;
  className?: string;
  hideBackground?: boolean;
  customResourceStateMap?: {
    color: Record<string, StatusCapsuleColor | 'loading'>;
    text: Record<string, string>;
  };
  size?: 'small' | 'medium';
};

export const StateTag: React.FC<Props> = props => {
  const {
    state = ResourceState.UPDATING,
    hideBackground,
    className,
    customResourceStateMap,
    size = 'medium',
  } = props;
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
    [ResourceState.TERMINATED]: 'gray',
    [ResourceState.STOPPED]: 'gray',
    [ResourceState.AVAILABLE]: 'blue',
    [ResourceState.BOUND]: 'green',
    [ResourceState.RELEASED]: 'gray',
    [ResourceState.LOST]: 'red',
    [ResourceState.ACTIVE]: 'green',
    [ResourceState.DELETING]: 'loading',
  };
  const finalColorMap = customResourceStateMap?.color || defaultStateMap;
  const finalTextMap = customResourceStateMap?.text;

  return (
    <StatusCapsule
      className={cx(className, StateTagStyle, hideBackground && 'no-background', size)}
      color={
        finalColorMap[state] !== 'loading'
          ? (finalColorMap[state] as StatusCapsuleColor)
          : undefined
      }
      loading={finalColorMap[state] === 'loading'}
    >
      {finalTextMap ? finalTextMap[state] : t(`dovetail.${state || 'updating'}_state`)}
    </StatusCapsule>
  );
};
