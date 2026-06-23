import { css } from '@linaria/core';
import React from 'react';
import { CopyButton } from 'src/components/CopyButton';

type Props = {
  value: string;
  children: React.ReactNode;
};

const PathCellStyle = css`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
`;

const PathTextStyle = css`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  & > * {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const PathCopyStyle = css`
  flex: 0 0 16px;
  margin-left: auto;
`;

export const PathWithCopy: React.FC<Props> = ({ value, children }) => {
  return (
    <div className={PathCellStyle}>
      <span className={PathTextStyle}>{children}</span>
      <CopyButton value={value} className={PathCopyStyle} />
    </div>
  );
};
