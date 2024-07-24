import { css, cx } from '@linaria/core';
import React from 'react';

const EMPTY_VALUES: unknown[] = [undefined, null, '', '-'];

const EmptyStyle = css`
  && {
    color: rgba(0,21,64,.3);
  }
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
  style?: React.CSSProperties;
  className?: string;
}

export function ValueDisplay(props: ValueDisplayProps) {
  const { value, useOverflow = true, className, style } = props;

  return EMPTY_VALUES.includes(value) ? (
    <div className={cx(EmptyStyle, className)} style={style}>-</div>
  ) : (
    <div
      style={style}
      className={cx(className, ContentStyle, useOverflow && 'overflow')}
      title={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
    >
      {value}
    </div>
  );
}

export default ValueDisplay;
