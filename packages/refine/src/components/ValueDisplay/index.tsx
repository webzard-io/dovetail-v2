import { OverflowTooltip } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import React from 'react';

const EMPTY_VALUES: unknown[] = [undefined, null, '', '-'];

const EmptyStyle = css`
  &.empty-text {
    color: rgba(0, 21, 64, 0.3);
  }
`;
const ContentStyle = css`
  width: 100%;
`;

interface ValueDisplayProps {
  value: React.ReactNode;
  useOverflow?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function ValueDisplay(props: ValueDisplayProps) {
  const { value, useOverflow = true, className, style } = props;
  const htmlTitle = typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;
  const result = useOverflow ? (
    <div title={htmlTitle} style={style} className={cx(className, ContentStyle)}>
      <OverflowTooltip content={value} className={ContentStyle} />
    </div>
  ) : (
    <div
      style={style}
      className={cx(className, ContentStyle)}
      title={htmlTitle ?? ''}
    >
      {value}
    </div>
  );

  return EMPTY_VALUES.includes(value) ? (
    <div className={cx(EmptyStyle, 'empty-text', className)} style={style}>
      -
    </div>
  ) : (
    result
  );
}

export default ValueDisplay;
