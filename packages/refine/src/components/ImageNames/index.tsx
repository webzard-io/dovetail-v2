import { OverflowTooltip } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';

const ImageWrapperStyle = css`
  white-space: pre-line;
`;

export const ImageNames: React.FC<{ value: string[]; breakLine?: boolean; }> = ({ value, breakLine = true }) => {
  return (
    <span className={ImageWrapperStyle}>
      {breakLine ? value.map(image => (
        <OverflowTooltip key={image} content={image} tooltip={image}></OverflowTooltip>
      )) : value.join(', ')}
    </span>
  );
};
