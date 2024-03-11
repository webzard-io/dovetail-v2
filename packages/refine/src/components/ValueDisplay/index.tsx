import { css, cx } from '@linaria/core';
import React from 'react';

const EMPTY_VALUES: unknown[] = [undefined, null, '', '-'];

const EmptyStyle = css`
  color: rgba(0,21,64,.3);
`;
const ContentStyle = css`
  width: 100%;

  &.overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

interface ValueDisplayProps {
  value: React.ReactNode;
  useOverflow?: boolean;
  className?: string;
}

function ValueDisplay(props: ValueDisplayProps) {
  const { value, useOverflow = true, className } = props;

  return EMPTY_VALUES.includes(value) ? (
    <div className={cx(EmptyStyle, className)}>-</div>
  ) : (
    <div
      className={cx(className, ContentStyle, useOverflow && 'overflow')}
      title={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
    >
      {value}
    </div>
  );
}

export default ValueDisplay;
