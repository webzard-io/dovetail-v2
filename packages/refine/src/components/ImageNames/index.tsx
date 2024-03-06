import { css } from '@linaria/core';
import React from 'react';

const ImageWrapperStyle = css`
  white-space: pre-wrap;
`;

export const ImageNames: React.FC<{ value: string[]; separator?: string; }> = ({ value, separator = '\n' }) => {
  return (
    <span className={ImageWrapperStyle}>
      {value.join(separator)}
    </span>
  );
};
